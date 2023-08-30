import toast from 'react-hot-toast';
import { botpressClient as bpClientService } from '../services/botpress';
import { Client, Conversation } from '@botpress/client';
import { ConversationDetails } from '../components/ConversationDetails';
import { ConversationList } from '../components/ConversationList';
import { useEffect, useState } from 'react';

export interface ConversationWithMessagesAndUsers extends Conversation {
	// messages: Message[];
	// users: User[];
}

export const Dashboard = () => {
	// const [botpressToken, setBotpressToken] = useState<string | undefined>();
	// const [botpressWorkspaceId, setBotpressWorkspaceId] = useState<
	// 	string | undefined
	// >();
	// const [botpressBotId, setBotpressBotId] = useState<string | undefined>();

	const [selectedConversation, setSelectedConversation] =
		useState<Conversation>();

	const [conversations, setConversations] = useState<
		ConversationWithMessagesAndUsers[]
	>([]);

	const [botpressClient, setBotpressClient] = useState<Client | undefined>();

	useEffect(() => {
		if (!botpressClient) {
			toast('Please inform your credentials');

			const token = prompt('Botpress Token') || undefined;
			const workspaceId = prompt('Botpress Workspace ID') || undefined;
			const botId = prompt('Botpress Bot ID') || undefined;

			if (token && workspaceId && botId) {
				const client = bpClientService(token, workspaceId, botId);

				if (!client) {
					toast.error('Invalid credentials');
					return;
				}

				setBotpressClient(bpClientService(token, workspaceId, botId));
			}
		} else {
			(async () => {
				try {
					const allConversations: ConversationWithMessagesAndUsers[] =
						[];
					let nextTokenConversations: string | undefined;

					do {
						const listConversations =
							await botpressClient.listConversations({
								nextToken: nextTokenConversations,
							});

						const conversationsWithData: ConversationWithMessagesAndUsers[] =
							[];

						listConversations.conversations.forEach(
							async (conversation) => {
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

								conversationsWithData.push({
									...conversation,
									// messages,
									// users,
								});
							}
						);

						allConversations.push(...conversationsWithData);
						nextTokenConversations =
							listConversations.meta.nextToken;
					} while (nextTokenConversations);

					setConversations(allConversations);
				} catch (error: any) {
					console.log(error.response?.data || error);

					toast.error("Couldn't load older conversations");
				}
			})();
		}
	}, [botpressClient]);

	return botpressClient ? (
		<div className="flex h-screen">
			<div className="mx-auto max-w-7xl gap-5 flex w-full my-24">
				<ConversationList
					conversations={conversations}
					className="w-1/4 border-2 rounded-xl shadow-xl"
					selectedConversationId={selectedConversation?.id}
					onSelectConversation={(conversation: Conversation) =>
						setSelectedConversation(conversation)
					}
					botpressClient={botpressClient}
					// loadOlderConversations={
					// 	nextToken ? loadOlderConversations : undefined
					// }
				/>

				<div className="w-3/4 flex rounded-xl">
					{selectedConversation ? (
						<ConversationDetails
							conversation={selectedConversation}
							botpressClient={botpressClient}
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
		<div className="flex h-screen">
			<div className="mx-auto max-w-7xl gap-5 flex w-full my-24">
				<div className="bg-gray-100 p-5 text-lg font-medium rounded-xl my-auto mx-auto">
					Please inform your credentials
				</div>
			</div>
		</div>
	);
};
