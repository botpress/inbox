import toast from 'react-hot-toast';
import { Conversation } from '@botpress/client';
import { ConversationDetails } from '../components/ConversationDetails';
import { ConversationList } from '../components/ConversationList';
import { Header } from '../components/interface/Header';
import { LoadingAnimation } from '../components/interface/Loading';
import { useBotpressClient } from '../hooks/botpressClient';
import { useEffect, useState } from 'react';
import {
	clearCredentials,
	getStoredCredentials,
	storeCredentials,
} from '../services/storage';


export const Dashboard = () => {
	const [conversationsState, setConversationsState] = useState<{
		isLoading: boolean;
		bot?: {
			id?: string;
			name?: string;
		};
	}>({
		isLoading: true,
	});
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation>();

	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [nextConversationsToken, setNextConversationsToken] =
		useState<string>();

	const { botpressClient, createClient, deleteClient } = useBotpressClient();

	const [userBotpressToken, setUserBotpressToken] = useState<string>('');
	const [userBotpressURL, setUserBotpressURL] = useState<string>('');

	function clearsCredentialsAndClient() {
		setUserBotpressToken('');
		setUserBotpressURL('');

		deleteClient();

		clearCredentials();
	}

	const logout = () => {
		clearsCredentialsAndClient();
		window.location.reload();
	};

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

					setConversationsState((prev) => ({
						...prev,
						bot: {
							id: credentials.botId,
							name: undefined,
						},
					}));
				}
			} catch (error: any) {
				toast("Couldn't start the app");

				toast.error(error.message || error);
			}
		} else {
			// if there is a client, loads the conversations
			(async () => {
				try {
					if (conversationsState.bot?.id) {
						const getBot = await botpressClient.getBot({
							id: conversationsState.bot!.id!,
						});

						setConversationsState((prev) => ({
							...prev,
							bot: {
								...prev.bot,
								name: getBot.bot.name,
							},
						}));
					}
				} catch (error) {}

				setConversationsState((prev) => ({
					...prev,
					isLoading: true,
				}));

				try {
					const allConversations: Conversation[] = [];

					const listConversations =
						await botpressClient.listConversations({});

					listConversations.conversations.forEach(
						async (currentConversation) => {
							// let messages: Message[] = [];
							// let nextTokenMessages: string | undefined;

							// let users: User[] = [];
							// let nextTokenUsers: string | undefined;

							// do {
							// 	const listMessages =
							// 		await botpressClient.listMessages({
							// 			conversationId: conversation.id,
							// 		});

							// 	messages.push(...listMessages.messages);
							// 	nextTokenMessages = listMessages.meta.nextToken;
							// } while (nextTokenMessages);

							// do {
							// 	const listUsers =
							// 		await botpressClient.listUsers({
							// 			conversationId: conversation.id,
							// 		});

							// 	users.push(...listUsers.users);
							// 	nextTokenUsers = listUsers.meta.nextToken;
							// } while (nextTokenUsers);

							allConversations.push(currentConversation);
						}
					);

					setNextConversationsToken(
						listConversations.meta.nextToken || undefined
					);

					setConversations((previousConversations) => {
						return [...previousConversations, ...allConversations];
					});
				} catch (error: any) {
					console.log(error.response?.data || error);

					toast.error("Couldn't load older conversations");

					clearsCredentialsAndClient();
				}

				setConversationsState((prev) => ({
					...prev,
					isLoading: false,
				}));
			})();
		}
	}, [botpressClient]);

	function loadOlderConversations() {
		if (!botpressClient) {
			return;
		}

		(async () => {
			try {
				const listConversations =
					await botpressClient.listConversations({
						nextToken: nextConversationsToken,
					});

				setNextConversationsToken(
					listConversations.meta.nextToken || undefined
				);

				setConversations((previousConversations) => {
					return [
						...previousConversations,
						...listConversations.conversations,
					];
				});
			} catch (error: any) {
				console.log(error.response?.data || error.message || error);

				toast.error("Couldn't load older conversations");

				clearsCredentialsAndClient();
			}
		})();
	}

	function handleSubmitCredentials() {
		if (!userBotpressToken || !userBotpressURL) {
			toast.error('Please inform all the credentials');
			return;
		}

		try {
			const token = userBotpressToken;

			const splittedURL = userBotpressURL.split('/');
			const workspaceId = splittedURL[4];
			const botId = splittedURL[6];

			if (!token || !workspaceId || !botId) {
				throw new Error();
			}

			const bpClient = createClient(token, workspaceId, botId);

			if (!bpClient) {
				throw new Error();
			}

			// saves the encrypted credentials to storage
			storeCredentials({ token, workspaceId, botId });
		} catch (error) {
			toast.error('You have informed invalid credentials');

			clearsCredentialsAndClient();
		}
	}

	return botpressClient ? (
		<div className="flex flex-col h-screen overflow-hidden bg-zinc-100 text-gray-800">
			{/* HEADER */}
			<Header handleLogout={logout} className="flex-shrink-0 h-14" />
			{/* CONVERSATIONS */}
			<div className="mx-2 mb-2 gap-2 flex overflow-hidden h-full">
				<div className="flex flex-col gap-2 w-1/4">
					<div className="px-3 py-2 text-lg text-white text-center font-medium rounded-md bg-zinc-800">
						🤖 {conversationsState.bot?.name || 'Unnamed bot'}
					</div>

					{/* CONVERSATION LIST */}
					<aside className="w-full flex-col flex flex-1 rounded-md border border-zinc-200 overflow-auto">
						{conversationsState.isLoading ? (
							<div className="self-center bg-zinc-200 p-6 text-lg font-medium rounded-md my-auto flex flex-col items-center gap-5">
								<LoadingAnimation label="Loading messages..." />
								Loading conversations...
							</div>
						) : (
							<ConversationList
								conversations={conversations}
								onSelectConversation={(
									conversation: Conversation
								) => setSelectedConversation(conversation)}
								selectedConversationId={
									selectedConversation?.id
								}
								loadOlderConversations={loadOlderConversations}
								nextConversationsToken={nextConversationsToken}
								className="bg-white"
							/>
						)}
					</aside>
				</div>

				{/* CONVERSATION DETAILS */}
				<div className="flex w-3/4 h-full">
					{selectedConversation ? (
						<ConversationDetails
							conversation={selectedConversation}
							className="w-full gap-1"
							onDeleteConversation={(conversationId: string) => {
								setSelectedConversation(undefined);
								setConversations(
									conversations.filter(
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
		</div>
	) : (
		<div className="flex flex-col h-screen">
			<form
				onSubmit={handleSubmitCredentials}
				className="border-2 p-10 rounded-md shadow-sm flex flex-col gap-3 max-w-xl w-full mx-auto my-auto"
			>
				<div className="bg-zinc-100 px-5 py-3 mb-10 flex flex-col items-center gap-1 rounded-md mx-auto">
					<img
						src="https://avatars.githubusercontent.com/u/23510677?s=200&v=4"
						alt="Botpress logo"
						className="h-16 w-16 rounded-full"
					/>
					<span className="text-lg font-bold">Botpress Inbox</span>
					<span>See your conversations</span>
				</div>

				<label htmlFor="" className="flex flex-col gap-1">
					<span className="text-lg font-medium">
						Bot Dashboard URL
					</span>
					<input
						type="text"
						className="px-3 py-2 rounded-md border-2 bg-white"
						value={userBotpressURL}
						onChange={(event) => {
							setUserBotpressURL(event.target.value);
						}}
					/>
					<span className="text-sm italic text-gray-600">
						Go to app.botpress.cloud, open your bot and copy the
						link
					</span>
				</label>

				<label htmlFor="" className="flex flex-col gap-1">
					<span className="text-lg font-medium">
						Personal Access Token
					</span>
					<input
						type="password"
						className="px-3 py-2 rounded-md border-2 bg-white"
						value={userBotpressToken}
						onChange={(event) => {
							setUserBotpressToken(event.target.value);
						}}
					/>
					<span className="text-sm italic text-gray-600">
						You can find this by clicking your avatar in the
						dashboard
					</span>
				</label>

				<button
					className="w-full p-3 rounded-md bg-blue-500 mx-auto"
					type="button"
					onClick={() => handleSubmitCredentials()}
				>
					<span className="text-xl text-white font-medium">Save</span>
				</button>
			</form>
		</div>
	);
};
