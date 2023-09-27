import toast from 'react-hot-toast';
import { CreateMessageBody, Message } from '@botpress/client/dist/gen';
import { useBotpressClient } from '../hooks/botpressClient';
import { useState } from 'react';

interface MessageInputProps {
	conversationId: string;
	addMessageToList: (message: Message) => void;
	handleScrollToBottom: () => void;
	botpressBotIdAsAUser?: string;
}

export const MessageInput = ({
	conversationId,
	addMessageToList,
	handleScrollToBottom,
	botpressBotIdAsAUser,
}: MessageInputProps) => {
	const [messageInput, setMessageInput] = useState<string>('');

	const { botpressClient } = useBotpressClient();

	async function handleSendMessage() {
		try {
			const sendMessageBody: CreateMessageBody = {
				conversationId,
				userId: botpressBotIdAsAUser!,
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

				handleScrollToBottom();
			}
		} catch (error: any) {
			console.log(JSON.stringify(error));

			toast.error("Couldn't send message");
		}
	}

	return botpressBotIdAsAUser ? (
		<div className="flex gap-2 items-center flex-shrink-0 mt-5">
			<input
				type="text"
				className="w-full rounded-2xl border-2 p-4"
				placeholder="Type something..."
				value={messageInput}
				onChange={(e) => setMessageInput(e.target.value)}
			/>
			<button
				className="bg-blue-500 text-white rounded-2xl p-4"
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
	) : (
		<div className="bg-zinc-200 p-5 mb-10 text-lg font-medium rounded-md mx-auto">
			You can only send messages in conversations where your bot has
			already talked to the user...
		</div>
	);
};
