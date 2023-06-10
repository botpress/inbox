import toast from 'react-hot-toast';
import { botpressClient } from '../services/botpress';
import { CreateMessageBody, Message } from '@botpress/client/dist/gen';
import { isDefinedAndHasItems } from '../utils';
import { MessageItem } from './MessageItem';
import { useEffect, useRef, useState } from 'react';

interface MessageListProps {
	messages: Message[];
	conversationId: string;
	loadOlderMessages?: () => void;
}

export const MessageList = ({
	messages,
	conversationId,
	loadOlderMessages,
}: MessageListProps) => {
	const [messageList, setMessageList] = useState<Message[]>([]);
	const [messageInput, setMessageInput] = useState<string>('');
	const [clickedLoadOlderMessages, setClickedLoadOlderMessages] =
		useState<boolean>(false);

	const messageListEndRef = useRef<HTMLDivElement>(null);

	function handleScrollToEnd() {
		if (messageListEndRef.current) {
			messageListEndRef.current.scrollIntoView({ behavior: 'smooth' });
		} else {
			console.log('messageListEndRef.current is null');
		}
	}

	async function handleSendMessage() {
		try {
			const sendMessageBody: CreateMessageBody = {
				conversationId,
				userId: import.meta.env.VITE_BOTPRESS_BOT_ID_AS_USER,
				payload: { text: messageInput },
				type: 'text',
				tags: {},
			};

			const sendMessage = await botpressClient.createMessage(
				sendMessageBody
			);

			console.log(sendMessage);

			if (sendMessage && sendMessage.message) {
				setMessageInput('');

				setMessageList((prevMessages) => [
					...prevMessages,
					sendMessage.message,
				]);

				handleScrollToEnd();
			}
		} catch (error: any) {
			console.log(error.response.data);

			toast.error("Couldn't send message");
		}
	}

	useEffect(() => {
		setMessageList(messages);
	}, [messages]);

	useEffect(() => {
		!clickedLoadOlderMessages && handleScrollToEnd();

		setClickedLoadOlderMessages(false);
	}, [messageList]);

	return (
		<div className="flex flex-col h-full p-5">
			<div className="flex-grow flex flex-col gap-1 overflow-y-scroll pr-2">
				{isDefinedAndHasItems(messages) ? (
					<>
						{loadOlderMessages && (
							<button
								className="rounded-xl p-2 border-2 self-center mb-5"
								onClick={() => {
									loadOlderMessages();
									setClickedLoadOlderMessages(true);
								}}
							>
								Load older messages
							</button>
						)}
						{messageList
							.sort(
								(a, b) =>
									new Date(a.createdAt).getTime() -
									new Date(b.createdAt).getTime()
							)
							.map((message, index, list) => (
								<MessageItem
									message={message}
									key={message.id}
									className={
										list[index - 1]?.direction !==
										message.direction
											? 'mt-2'
											: ''
									}
								/>
							))}
						<div ref={messageListEndRef} />
					</>
				) : (
					<div className="self-center bg-gray-100 p-5 text-lg font-medium rounded-xl my-auto">
						There are no messages...
					</div>
				)}
			</div>
			<div className="flex gap-2 items-center flex-shrink-0 mt-5">
				<input
					type="text"
					className="w-full rounded-xl border-2 p-4"
					placeholder="Type something..."
					value={messageInput}
					onChange={(e) => setMessageInput(e.target.value)}
				/>
				<button
					className="bg-blue-500 text-white rounded-xl p-4"
					onClick={() => handleSendMessage()}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.keyCode === 13) {
							handleSendMessage();
						}
					}}
				>
					Send
				</button>
			</div>
		</div>
	);
};
