import InfiniteScroll from 'react-infinite-scroller';
import { ConversationItem } from './ConversationItem';
import { ConversationWithMessages } from '../pages/Dashboard';
import { LoadingAnimation } from './interface/Loading';
import { useRef } from 'react';

interface ConversationListProps {
	conversations: ConversationWithMessages[];
	onSelectConversation: (conversation: ConversationWithMessages) => void;
	loadOlderConversations: () => Promise<void>;
	hasMoreConversations?: boolean;
	selectedConversationId?: string;
	className?: string;
}

export const ConversationList = ({
	conversations,
	onSelectConversation,
	loadOlderConversations,
	hasMoreConversations,
	selectedConversationId,
	className,
}: ConversationListProps) => {
	const observerTarget = useRef<HTMLDivElement>(null);

	return (
		<InfiniteScroll
			pageStart={0}
			loadMore={loadOlderConversations}
			hasMore={hasMoreConversations}
			loader={
				<div
					className="loader rounded-md px-3 py-2 flex items-center gap-2 m-3 border-2 font-medium"
					key={0}
				>
					<LoadingAnimation
						label={'Loading conversations'}
						className="h-6 w-6"
					/>
					Loading older conversations...
				</div>
			}
			useWindow={false}
		>
			<div
				className={`flex flex-col  items-center w-full divide-y-2 ${className}`}
			>
				{conversations
					// if the conversation had the messages data, they could be sorted by the last message
					.sort((a, b) => {
						// a.messages.sort(
						// 	(a, b) =>
						// 		new Date(b.createdAt).getTime() -
						// 		new Date(a.createdAt).getTime()
						// );
						// b.messages.sort(
						// 	(a, b) =>
						// 		new Date(b.createdAt).getTime() -
						// 		new Date(a.createdAt).getTime()
						// );

						// return (
						// 	new Date(b.messages[0].createdAt).getTime() -
						// 	new Date(a.messages[0].createdAt).getTime()
						// );

						// sorts the conversations by the last update instead
						return (
							new Date(b.updatedAt).getTime() -
							new Date(a.updatedAt).getTime()
						);
					})
					.map((conversation) => (
						<button
							className="w-full"
							onClick={() => onSelectConversation(conversation)}
							key={conversation.id}
						>
							<ConversationItem
								conversation={conversation}
								userName={'Chatbot User'}
								isSelected={
									conversation.id === selectedConversationId
								}
							/>
						</button>
					))}
				<div ref={observerTarget} />
			</div>
			{!hasMoreConversations && (
				<div className="rounded-md p-2 m-3 text-center border-2 font-medium">
					No more conversations
				</div>
			)}
		</InfiniteScroll>
	);
};
