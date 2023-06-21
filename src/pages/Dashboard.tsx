import toast from 'react-hot-toast';
import { botpressClient } from '../services/botpress';
import { Conversation } from '@botpress/client';
import { ConversationDetails } from '../components/ConversationDetails';
import { ConversationList } from '../components/ConversationList';
import { useEffect, useState } from 'react';

export interface ConversationWithMessagesAndUsers extends Conversation {
	// messages: Message[];
	// users: User[];
}

export const Dashboard = () => {
	const [selectedConversation, setSelectedConversation] =
		useState<Conversation>();

	const [conversations, setConversations] = useState<
		ConversationWithMessagesAndUsers[]
	>([]);

	useEffect(() => {
		(async () => {
			try {
				const allConversations: ConversationWithMessagesAndUsers[] = [];
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
					nextTokenConversations = listConversations.meta.nextToken;
				} while (nextTokenConversations);

				setConversations(allConversations);
			} catch (error: any) {
				console.log(error.response?.data || error);

				toast.error("Couldn't load older conversations");
			}
		})();
	}, []);

	return (
		<div className="flex h-screen">
			<div className="rounded-lg mx-auto max-w-7xl border-2 shadow-2xl flex w-full my-24 divide-x-4">
				<ConversationList
					conversations={conversations}
					className="w-1/4"
					selectedConversationId={selectedConversation?.id}
					onSelectConversation={(conversation: Conversation) =>
						setSelectedConversation(conversation)
					}
					// loadOlderConversations={
					// 	nextToken ? loadOlderConversations : undefined
					// }
				/>

				<div className="w-3/4 flex">
					{selectedConversation ? (
						<ConversationDetails
							conversation={selectedConversation}
							className="divide-x-4 w-full"
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
							Select a conversation
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
