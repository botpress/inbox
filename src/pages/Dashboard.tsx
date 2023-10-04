import toast from 'react-hot-toast';
import { AbortError } from 'p-retry';
import { Conversation, Message } from '@botpress/client';
import { ConversationDetails } from '../components/ConversationDetails';
import { ConversationList } from '../components/ConversationList';
import { Header } from '../components/interface/Header';
import { listConversationsWithMessages } from '../hooks/clientFunctions';
import { LoadingAnimation } from '../components/interface/Loading';
import { LoginPage } from '../components/LoginPage';
import { useBotpressClient } from '../hooks/botpressClient';
import { useEffect, useState } from 'react';
import {
	clearStoredCredentials,
	getStoredCredentials,
} from '../services/storage';

export interface ConversationWithMessages extends Conversation {
	messages: Message[];
	nextMessagesToken?: string;
}

export const Dashboard = () => {
	const [isLoadingConversations, setIsLoadingConversations] =
		useState<boolean>(true);

	const [botInfo, setBotInfo] = useState<{
		id?: string;
		name?: string;
	}>({});
	const [selectedConversation, setSelectedConversation] =
		useState<ConversationWithMessages>();

	const [conversationList, setConversationList] = useState<
		ConversationWithMessages[]
	>([]);
	const [nextConversationsToken, setNextConversationsToken] =
		useState<string>();

	const { botpressClient, createClient, deleteClient } = useBotpressClient();

	function clearsCredentialsAndClient() {
		deleteClient();

		clearStoredCredentials();
		// window.location.reload();
	}

	useEffect(() => {
		if (!botpressClient) {
			try {
				const credentials = getStoredCredentials();

				// if there are credentials saved in the Local Storage, decrypts and creates the client
				if (credentials) {
					createClient(
						credentials.token,
						credentials.workspaceId,
						credentials.botId
					);

					setBotInfo({
						id: credentials.botId,
						name: 'Loading',
					});
				}
			} catch (error: any) {
				toast("Couldn't start the app");

				toast.error(error.message || error);
			}
		} else {
			// if there are conversations already, returns
			if (conversationList.length > 0) {
				console.log("There's already conversations loaded");
				return;
			} else {
				console.log("There's no conversations loaded");
			}

			// if there is a client, loads the conversations
			(async () => {
				try {
					setIsLoadingConversations(true);

					console.log('LOADING CONVERSATIONS');

					const getConversations =
						await listConversationsWithMessages(
							botpressClient,
							undefined,
							true
						);

					setConversationList(
						getConversations.conversations as ConversationWithMessages[]
					);

					setNextConversationsToken(
						getConversations.nextConversationsToken
					);
				} catch (error: any) {
					console.log(
						'ERROR ON GETTING CONVERSATIONS : ',
						JSON.stringify(error)
					);

					if (error.code === 429) {
						toast(
							'You have reached the limit of requests to the Botpress API... Please try again later'
						);
					}

					toast.error("Couldn't load older conversations");
				} finally {
					setIsLoadingConversations(false);
				}

				// const retriable = await pRetry( (func) => {
				// 	try {
				// 		func
				// 	} catch (error) {
				// 		if (error.code !== 429)
				// 		{
				// 			throw new AbortError
				// 		}
				// 		throw error
				// 	}
				// },{onFailedAttempt: (error) => {
				// 	throw error
				// },retries:5})

				try {
					// tries to get the bot name
					if (botInfo.id) {
						const getBot = await botpressClient.getBot({
							id: botInfo.id,
						});

						setBotInfo((prev) => ({
							...prev,
							name: getBot.bot.name,
						}));
					}
				} catch (error) {
					console.log(JSON.stringify(error));

					toast.error("Couldn't load bot info");
				}
			})();
		}
	}, [botpressClient]);

	async function loadOlderConversations() {
		if (!botpressClient) {
			return;
		}

		try {
			console.log('LOADING OLDER CONVERSATIONS');
			const getConversations = await listConversationsWithMessages(
				botpressClient,
				nextConversationsToken,
				true
			);

			setConversationList((previousConversations) => {
				return [
					...previousConversations,
					...(getConversations.conversations as ConversationWithMessages[]),
				];
			});

			setNextConversationsToken(getConversations.nextConversationsToken);
		} catch (error: any) {
			console.log(JSON.stringify(error));

			if (error.code === 429) {
				toast(
					'You have reached the limit of requests to the Botpress API... Please try again later'
				);

				throw new AbortError('API limit reached');
			}

			toast.error("Couldn't load older conversations");
		}
	}

	return botpressClient ? (
		<div className="flex flex-col h-screen overflow-hidden bg-zinc-100 text-gray-800">
			{/* HEADER */}
			<Header
				handleLogout={clearsCredentialsAndClient}
				botName={botInfo.name}
				className="flex-shrink-0 h-14"
			/>
			{/* CONVERSATIONS */}
			<div className="mx-2 mb-2 gap-2 flex overflow-hidden h-full">
				<div className="flex flex-col gap-2 w-1/4">
					{/* CONVERSATION LIST */}
					<aside className="w-full flex-col flex flex-1 rounded-md border border-zinc-200 overflow-auto">
						<ConversationList
							conversations={conversationList}
							onSelectConversation={(
								conversation: ConversationWithMessages
							) => setSelectedConversation(conversation)}
							selectedConversationId={selectedConversation?.id}
							loadOlderConversations={loadOlderConversations}
							hasMoreConversations={
								nextConversationsToken ? true : false
							}
							className="bg-white"
						/>

						{isLoadingConversations && (
							<div className="self-center bg-zinc-200 p-6 text-lg font-medium rounded-md my-auto flex flex-col items-center gap-5">
								<LoadingAnimation label="Loading messages..." />
								Loading conversations...
							</div>
						)}
					</aside>
				</div>

				{/* CONVERSATION DETAILS */}
				<div className="flex w-3/4 h-full">
					{selectedConversation ? (
						<ConversationDetails
							conversation={selectedConversation}
							messagesInfo={{
								list: selectedConversation.messages,
								nextToken:
									selectedConversation.nextMessagesToken,
							}}
							className="w-full gap-1"
							onDeleteConversation={(conversationId: string) => {
								setSelectedConversation(undefined);
								setConversationList((prev) =>
									prev.filter(
										(conversation) =>
											conversation.id !== conversationId
									)
								);
							}}
						/>
					) : (
						<div className="bg-zinc-200 p-5 text-lg font-medium rounded-md my-auto mx-auto">
							Select a conversation to see details
						</div>
					)}
				</div>
			</div>
			{/* <div className="m-2">
				<Disclaimer />
			</div> */}
		</div>
	) : (
		<LoginPage clearsCredentialsAndClient={clearsCredentialsAndClient} />
	);
};
