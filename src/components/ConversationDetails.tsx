import toast from 'react-hot-toast';
import { botpressClient } from '../services/botpress';
import { Conversation, Message } from '@botpress/client';
import { ConversationInfo } from './ConversationInfo';
import { isDefinedAndHasItems } from '../utils';
import { MessageList } from './MessageList';
import { useEffect, useState } from 'react';
import { User } from '@botpress/client/dist/gen';

interface ConversationDetailsProps {
	conversation: Conversation;
	onDeleteConversation: (conversationId: string) => void;
	className?: string;
}

export const ConversationDetails = ({
	conversation,
	onDeleteConversation,
	className,
}: ConversationDetailsProps) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoadingMessages, setIsLoadingMessages] = useState(true);
	const [nextToken, setNextToken] = useState<string>();

	const [users, setUsers] = useState<User[]>([]);
	const [isLoadingUsers, setIsLoadingUsers] = useState(false);

	async function loadOlderMessages() {
		try {
			if (!nextToken) {
				return;
			}

			const getMessages = await botpressClient.listMessages({
				conversationId: conversation.id,
				nextToken,
			});

			console.log('MESSAGES:', getMessages);

			setMessages((prevMessages) => [
				...getMessages.messages,
				...prevMessages,
			]);

			setNextToken(getMessages.meta.nextToken || undefined);
		} catch (error: any) {
			console.log(error.response?.data || error);

			toast.error("Couldn't load older messages");
		}
	}

	async function handleDeleteConversation(conversationId: string) {
		if (confirm('Are you sure you want to delete this conversation?')) {
			try {
				const deleteConversation =
					await botpressClient.deleteConversation({
						id: conversationId,
					});

				if (deleteConversation) {
					toast.success(
						'This conversation was deleted successfully!'
					);

					onDeleteConversation(conversationId);
				}
			} catch (error: any) {
				console.log(error.response.data);

				toast.error("Couldn't delete this conversation");
			}
		}
	}

	// async function handleUpdateConversation(
	// 	conversationId: string,
	// 	data: {
	// 		name?: string;
	// 		phone?: string;
	// 	}
	// ) {
	// 	try {
	// 		const tags: {
	// 			[key: string]: string | undefined;
	// 		} = {};

	// 		if (data.name) {
	// 			tags['user:name'] = data.name;
	// 		}

	// 		if (data.phone) {
	// 			tags['whatsapp:userPhone'] = data.phone;
	// 		}

	// 		const updateConversation = await botpressApi.put(
	// 			`conversations/${conversationId}`,
	// 			{
	// 				tags,
	// 				// gets all the userids together with no duplicates
	// 				participantIds: [
	// 					...new Set(messages.map((message) => message.userId)),
	// 				],
	// 			}
	// 		);

	// 		console.log(updateConversation.data);

	// 		if (updateConversation.status === 200) {
	// 			alert('Conversa atualizada com sucesso');
	// 		}
	// 	} catch (error: any) {
	// 		console.log(error.response.data);

	// 		alert('Deu problema ao atualizar conversa');
	// 	}
	// }

	useEffect(() => {
		setMessages([]); // reset messages
		setUsers([]); // reset users

		(async () => {
			setIsLoadingMessages(true);

			try {
				const getMessages = await botpressClient.listMessages({
					conversationId: conversation.id,
				});

				setMessages(getMessages.messages);
				setNextToken(getMessages.meta.nextToken || undefined);
			} catch (error: any) {
				console.log(error.response.data);

				toast.error("Couldn't load messages");
			}

			setIsLoadingMessages(false);
		})();
	}, [conversation]);

	useEffect(() => {
		isDefinedAndHasItems(messages) &&
			(async () => {
				setIsLoadingUsers(true);

				try {
					const userIds = messages.reduce(
						(acc: string[], message: Message) => {
							if (
								message.userId &&
								!acc.includes(message.userId)
							) {
								acc.push(message.userId);
							}

							return acc;
						},
						[]
					);

					userIds.forEach(async (userId, index) => {
						try {
							const showUserRequest =
								await botpressClient.getUser({
									id: userId,
								});

							if (showUserRequest && showUserRequest.user) {
								setUsers((prevUsers) => {
									return [...prevUsers, showUserRequest.user];
								});
							} else {
								throw new Error('Could not get user');
							}
						} catch (error: any) {
							console.log(error.response?.data || error);

							toast.error(
								`Couldn't load the user ${index} info `
							);
							toast.error(String(error));
						}
					});
				} catch (error) {
					console.log(error);

					toast.error("Couldn't load users' details");
				}

				setIsLoadingUsers(false);
			})();
	}, [messages]);

	return (
		<div className={`flex ${className}`}>
			<div className="w-2/3 flex flex-col">
				{isLoadingMessages ? (
					<div className="self-center bg-gray-100 p-5 text-lg font-medium rounded-xl my-auto">
						Loading messages...
					</div>
				) : (
					<MessageList
						messages={messages}
						conversationId={conversation.id}
						loadOlderMessages={
							nextToken ? loadOlderMessages : undefined
						}
					/>
				)}
			</div>
			{isLoadingUsers ? (
				<div className="self-center bg-gray-100 p-5 text-lg font-medium rounded-xl my-auto">
					Loading users' details...
				</div>
			) : (
				<ConversationInfo
					conversation={conversation}
					users={users}
					onDeleteConversation={handleDeleteConversation}
					// onUpdateConversation={handleUpdateConversation}
					className="w-1/3 flex"
				/>
			)}
		</div>
	);
};
