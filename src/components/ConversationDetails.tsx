import pRetry, { AbortError } from 'p-retry';
import toast from 'react-hot-toast';
import { Conversation, Message, User } from '@botpress/client';
import { ConversationInfo } from './ConversationInfo';
import { isDefinedAndHasItems } from '../utils';
import { LoadingAnimation } from './interface/Loading';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { useBotpressClient } from '../hooks/botpressClient';
import { useEffect, useRef, useState } from 'react';

interface ConversationDetailsProps {
	conversation: Conversation;
	onDeleteConversation: (conversationId: string) => void;
	messagesInfo?: {
		list: Message[];
		nextToken?: string;
	};
	className?: string;
}

export const ConversationDetails = ({
	conversation,
	onDeleteConversation,
	messagesInfo,
	className,
}: ConversationDetailsProps) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoadingMessages, setIsLoadingMessages] = useState(true);
	const [nextMessagesToken, setNextMessagesToken] = useState<string>();

	const [users, setUsers] = useState<User[]>([]);
	const [isLoadingUsers, setIsLoadingUsers] = useState(false);

	const { botpressClient } = useBotpressClient();
	const [botpressBotIdAsAUser, setBotpressBotIdAsAUser] = useState<string>();

	const messageListEndRef = useRef<HTMLDivElement>(null);

	function handleScrollToBottom() {
		if (messageListEndRef.current) {
			messageListEndRef.current.scrollIntoView({ behavior: 'smooth' });
		} else {
			console.debug('messageListEndRef.current is null');
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
			console.log(JSON.stringify(error));

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
				console.log(JSON.stringify(error));

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

			const run = async () => {
				try {
					let messageList: Message[] = [];
					let token: string | undefined;

					// if the conversation already has already been given the messages data, use it
					if (messagesInfo?.list?.length) {
						messageList = messagesInfo.list;
						token = messagesInfo?.nextToken;
					} else {
						// otherwise, get the messages from the botpress api
						const getMessages = await botpressClient.listMessages({
							conversationId: conversation.id,
						});

						messageList = getMessages.messages;
						token = getMessages.meta.nextToken;
					}

					setMessages(messageList);
					setNextMessagesToken(token);
				} catch (error: any) {
					console.log(JSON.stringify(error));

					toast.error("Couldn't load messages");

					if (error.code === 429) {
						toast(
							'You have reached the limit of requests to the Botpress API... Please try again later'
						);

						throw new AbortError('API limit reached');
					}
				}
			};

			await pRetry(run, {
				onFailedAttempt: (error) => {
					if (error instanceof AbortError) {
						console.log(error.message);
					}
				},
				retries: 5,
			});

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
							}
						} catch (error: any) {
							console.log("Couldn't load user details");

							console.log(JSON.stringify(error));
						}
					});
				} catch (error) {
					console.log(JSON.stringify(error));

					toast.error("Couldn't load users' details");
				}

				setIsLoadingUsers(false);
			})();
	}, [messages]);

	return (
		<div className={`flex ${className}`}>
			<div className="w-2/3 flex flex-col default-border bg-white">
				{isLoadingMessages ? (
					<div className="self-center bg-zinc-200 p-6 text-lg font-medium rounded-md my-auto flex flex-col items-center gap-5">
						<LoadingAnimation label="Loading messages..." />
						Loading messages...
					</div>
				) : (
					<div className="flex flex-col h-full p-4">
						<div className="overflow-auto h-full">
							<MessageList
								messages={messages}
								loadOlderMessages={loadOlderMessages}
								hasMoreMessages={
									nextMessagesToken ? true : false
								}
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

			<div className="w-1/3 default-border overflow-y-auto bg-white">
				{isLoadingUsers ? (
					<div className="self-center bg-zinc-200 p-6 text-lg font-medium rounded-md my-auto flex flex-col items-center gap-5">
						<LoadingAnimation label="Loading messages..." />
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
