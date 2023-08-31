import toast from 'react-hot-toast';
import { Conversation } from '@botpress/client';
import { ConversationDetails } from '../components/ConversationDetails';
import { ConversationList } from '../components/ConversationList';
import { decrypt, encrypt } from '../services/crypto';
import { useBotpressClient } from '../hooks/botpressClient';
import { useEffect, useState } from 'react';

export const Dashboard = () => {
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
	}

	useEffect(() => {
		if (!botpressClient) {
			try {
				const credentialsEncrypted = localStorage.getItem(
					'bp-inbox-credentials'
				);

				// if there are credentials saved in the Local Storage, decrypts and creates the client
				if (credentialsEncrypted) {
					const decryptedCredentialsString =
						decrypt(credentialsEncrypted);

					if (!decryptedCredentialsString) {
						throw new Error('Invalid credentials');
					}

					const credentials = JSON.parse(decryptedCredentialsString);

					if (!credentials) {
						throw new Error('Invalid credentials');
					}

					if (
						!credentials.token ||
						!credentials.workspaceId ||
						!credentials.botId
					) {
						throw new Error('Invalid credentials');
					}

					createClient(
						credentials.token,
						credentials.workspaceId,
						credentials.botId
					);
				} else {
					// removes the credentials from the Local Storage
					localStorage.removeItem('bp-inbox-credentials');

					// if there are no credentials saved, prompts the user to inform them
					clearsCredentialsAndClient();
				}
			} catch (error: any) {
				toast("Couldn't start the app");
				toast.error(error.message || error);

				clearsCredentialsAndClient();
			}
		} else {
			// if there is a client, loads the conversations
			(async () => {
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

			createClient(token, workspaceId, botId);

			// saves the encrypted credentials to storage
			localStorage.setItem(
				'bp-inbox-credentials',
				encrypt(JSON.stringify({ token, workspaceId, botId }))
			);
		} catch (error) {
			toast.error('Invalid credentials');
			clearsCredentialsAndClient();
		}
	}

	return botpressClient ? (
		<div className="flex h-screen">
			<div className="mx-auto max-w-7xl gap-5 flex w-full my-24">
				<aside className="w-1/4 border-2 rounded-xl shadow-xl overflow-auto">
					<ConversationList
						conversations={conversations}
						onSelectConversation={(conversation: Conversation) =>
							setSelectedConversation(conversation)
						}
						selectedConversationId={selectedConversation?.id}
						loadOlderConversations={loadOlderConversations}
						nextConversationsToken={nextConversationsToken}
					/>
				</aside>

				<div className="w-3/4 flex rounded-xl">
					{selectedConversation ? (
						<ConversationDetails
							conversation={selectedConversation}
							className="w-full gap-5"
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
						<div className="bg-gray-100 p-5 text-lg font-medium rounded-xl my-auto mx-auto">
							Select a conversation to see details...
						</div>
					)}
				</div>
			</div>
		</div>
	) : (
		<div className="flex flex-col h-screen">
			<form
				onSubmit={handleSubmitCredentials}
				className="border-2 p-10 rounded-xl shadow-sm flex flex-col gap-3 max-w-xl w-full mx-auto my-auto"
			>
				<div className="bg-gray-100 p-5 mb-10 text-lg font-medium rounded-xl mx-auto">
					Please inform your credentials
				</div>

				<label htmlFor="" className="flex flex-col gap-1">
					<span className="text-lg font-medium">
						Personal Access Token
					</span>
					<input
						type="text"
						className="px-3 py-2 rounded-lg border-2 bg-white"
						value={userBotpressToken}
						onChange={(event) => {
							setUserBotpressToken(event.target.value);
						}}
					/>
				</label>
				<label htmlFor="" className="flex flex-col gap-1">
					<span className="text-lg font-medium">
						Bot Dashboard URL
					</span>
					<input
						type="text"
						className="px-3 py-2 rounded-lg border-2 bg-white"
						value={userBotpressURL}
						onChange={(event) => {
							setUserBotpressURL(event.target.value);
						}}
					/>
				</label>
				<button
					className="w-full p-3 rounded-lg bg-blue-500 mx-auto"
					type="button"
					onClick={() => handleSubmitCredentials()}
				>
					<span className="text-xl text-white font-medium">Save</span>
				</button>
			</form>
		</div>
	);
};
