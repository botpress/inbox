import InfiniteScroll from 'react-infinite-scroller';
import { isDefinedAndHasItems } from '../utils';
import { Message } from '@botpress/client/dist/gen';
import { MessageItem } from './MessageItem';
import { useEffect, useRef, useState } from 'react';

interface MessageListProps {
	messages: Message[];
	loadOlderMessages: () => void;
	nextMessagesToken?: string;
}

export const MessageList = ({
	messages,
	loadOlderMessages,
	nextMessagesToken,
}: MessageListProps) => {
	const [messageList, setMessageList] = useState<Message[]>([]);

	const messageListEndRef = useRef<HTMLDivElement>(null);

	function handleScrollToEnd() {
		if (messageListEndRef.current) {
			messageListEndRef.current.scrollIntoView({ behavior: 'smooth' });
		} else {
			console.log('messageListEndRef.current is null');
		}
	}

	useEffect(() => {
		console.log('MESSAGES', messages);
		setMessageList(messages);
	}, [messages]);

	useEffect(() => {
		handleScrollToEnd();
	}, []);

	return (
		<InfiniteScroll
			pageStart={0}
			loadMore={loadOlderMessages}
			hasMore={nextMessagesToken ? true : false}
			loader={
				<div
					className="loader rounded-xl p-2 m-3 border-2 font-medium"
					key={0}
				>
					Loading older messages...
				</div>
			}
			isReverse={true}
			useWindow={false}
		>
			<div className="flex-grow flex flex-col gap-1 pr-2">
				{isDefinedAndHasItems(messages) ? (
					<>
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
		</InfiniteScroll>
	);
};
