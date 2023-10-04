import InfiniteScroll from 'react-infinite-scroller';
import { isDefinedAndHasItems } from '../utils';
import { Message } from '@botpress/client/dist/gen';
import { MessageItem } from './MessageItem';
import { useEffect, useState } from 'react';

interface MessageListProps {
	messages: Message[];
	loadOlderMessages: () => void;
	handleScrollToBottom: () => void;
	bottomRef: React.RefObject<HTMLDivElement>;
	hasMoreMessages?: boolean;
}

export const MessageList = ({
	messages,
	loadOlderMessages,
	handleScrollToBottom,
	bottomRef,
	hasMoreMessages,
}: MessageListProps) => {
	const [messageList, setMessageList] = useState<Message[]>([]);

	useEffect(() => {
		setMessageList(messages);
	}, [messages]);

	useEffect(() => {
		handleScrollToBottom();
	}, []);

	return (
		<InfiniteScroll
			pageStart={0}
			loadMore={loadOlderMessages}
			hasMore={hasMoreMessages}
			loader={
				<div
					className="loader rounded-md p-2 m-3 border-2 font-medium text-center"
					key={0}
				>
					Loading older messages...
				</div>
			}
			isReverse={true}
			useWindow={true}
			className="pr-2"
			// onLoadedData={() => {
			// 	handleScrollToBottom();
			// }}
		>
			<div className="flex-grow flex flex-col gap-1 pr-2">
				{isDefinedAndHasItems(messages) ? (
					<>
						{!hasMoreMessages && (
							<div className="rounded-md p-2 m-3 border-2 font-medium text-center">
								Start of the conversation
							</div>
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
									key={index}
									className={
										list[index - 1]?.direction !==
										message.direction
											? 'mt-2'
											: ''
									}
								/>
							))}
						<div ref={bottomRef} />
					</>
				) : (
					<div className="self-center bg-zinc-200 p-5 text-lg font-medium rounded-md my-auto">
						There are no messages...
					</div>
				)}
			</div>
		</InfiniteScroll>
	);
};
