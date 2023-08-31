import toast from 'react-hot-toast';
import { CreateMessageBody, Message } from '@botpress/client/dist/gen';
import { useBotpressClient } from '../hooks/botpressClient';
import { useState } from 'react';

interface MessageInputProps {
	conversationId: string;
	addMessageToList: (message: Message) => void;
}

export const MessageInput = ({
	conversationId,
	addMessageToList,
}: MessageInputProps) => {
	const [messageInput, setMessageInput] = useState<string>('');

	const { botpressClient } = useBotpressClient();

	async function handleSendMessage() {
		try {
			const sendMessageBody: CreateMessageBody = {
				conversationId,
				userId: import.meta.env.VITE_BOTPRESS_BOT_ID_AS_USER,
				payload: { text: messageInput },
				type: 'text',
				tags: {},
			};

			const sendMessage = await botpressClient?.createMessage(
				sendMessageBody
			);

			console.log(sendMessage);

			if (sendMessage && sendMessage.message) {
				setMessageInput('');

				addMessageToList(sendMessage.message);
			}
		} catch (error: any) {
			console.log(error.response.data);

			toast.error("Couldn't send message");
		}
	}

	return (
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
	);
};
