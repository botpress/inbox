import toast from 'react-hot-toast';
import { Conversation, Message, User } from '@botpress/client';
import { ConversationInfo } from './ConversationInfo';
import { isDefinedAndHasItems } from '../utils';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { useBotpressClient } from '../hooks/botpressClient';
import { useEffect, useRef, useState } from 'react';

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
	const [nextMessagesToken, setNextMessagesToken] = useState<string>();

	const [users, setUsers] = useState<User[]>([]);
	const [isLoadingUsers, setIsLoadingUsers] = useState(false);

	const { botpressClient } = useBotpressClient();
	const [botpressBotIdAsAUser, setBotpressBotIdAsAUser] = useState<
		string | undefined
	>(undefined);

	const messageListEndRef = useRef<HTMLDivElement>(null);

	function handleScrollToBottom() {
		if (messageListEndRef.current) {
			messageListEndRef.current.scrollIntoView({ behavior: 'smooth' });
		} else {
			console.log('messageListEndRef.current is null');
		}
	}

	async function loadOlderMessages() {
		try {
			if (!nextMessagesToken || !botpressClient) {
				return;
			}

			const getMessages = await botpressClient.listMessages({
				conversationId: conversation.id,
				nextToken: nextMessagesToken,
			});

			setMessages((prevMessages) => [
				...getMessages.messages,
				...prevMessages,
			]);

			setNextMessagesToken(getMessages.meta.nextToken || undefined);
		} catch (error: any) {
			console.log(error.response?.data || error);

			toast.error("Couldn't load older messages");
		}
	}

	async function handleDeleteConversation(conversationId: string) {
		if (
			confirm(
				'Are you sure you want to delete this conversation?\nAll of its messages and users are gonna be deleted!'
			)
		) {
			try {
				const deleteConversation =
					await botpressClient?.deleteConversation({
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

	useEffect(() => {
		setMessages([]); // reset messages
		setUsers([]); // reset users

		if (!botpressClient) {
			return;
		}

		(async () => {
			setIsLoadingMessages(true);

			try {
				const getMessages = await botpressClient.listMessages({
					conversationId: conversation.id,
				});

				setMessages(getMessages.messages);
				setNextMessagesToken(getMessages.meta.nextToken || undefined);
			} catch (error: any) {
				console.log(error.response.data || error.message || error);

				toast.error("Couldn't load messages");
			}

			setIsLoadingMessages(false);
		})();
	}, [conversation]);

	useEffect(() => {
		// sets the botpress bot id as a user by searching all messages
		messages.forEach((message) => {
			if (message.direction === 'outgoing') {
				setBotpressBotIdAsAUser(message.userId);
			}
		});

		isDefinedAndHasItems(messages) &&
			!isDefinedAndHasItems(users) &&
			(async () => {
				setIsLoadingUsers(true);

				try {
					// grabs all user ids from messages
					const userIds = messages.reduce(
						(acc: string[], message: Message) => {
							// checks if the message has a userId and if it's not already in the array
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

					// gets all users from the user ids
					userIds.forEach(async (userId, index) => {
						try {
							const showUserRequest =
								await botpressClient?.getUser({
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
			<div className="w-2/3 flex flex-col border-2 rounded-xl shadow-xl">
				{isLoadingMessages ? (
					<div className="self-center bg-gray-100 p-5 text-lg font-medium rounded-xl my-auto">
						Loading messages...
					</div>
				) : (
					<div className="flex flex-col h-full p-5">
						<div className="overflow-auto h-full">
							<MessageList
								messages={messages}
								loadOlderMessages={loadOlderMessages}
								nextMessagesToken={nextMessagesToken}
								handleScrollToBottom={handleScrollToBottom}
								bottomRef={messageListEndRef}
							/>
						</div>
						<MessageInput
							conversationId={conversation.id}
							addMessageToList={(message: Message) => {
								setMessages((prevMessages) => [
									...prevMessages,
									message,
								]);
							}}
							botpressBotIdAsAUser={botpressBotIdAsAUser}
							handleScrollToBottom={handleScrollToBottom}
						/>
					</div>
				)}
			</div>

			<div className="w-1/3 border-2 rounded-xl overflow-y-auto shadow-xl">
				{isLoadingUsers ? (
					<div className="self-center bg-gray-100 p-5 text-lg font-medium rounded-xl my-auto">
						Loading users' details...
					</div>
				) : (
					<ConversationInfo
						conversation={conversation}
						users={users}
						onDeleteConversation={handleDeleteConversation}
						botpressBotIdAsAUser={botpressBotIdAsAUser}
						className="flex"
					/>
				)}
			</div>
		</div>
	);
};
