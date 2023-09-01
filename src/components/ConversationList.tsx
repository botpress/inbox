import InfiniteScroll from 'react-infinite-scroller';
import { Conversation } from '@botpress/client';
import { ConversationItem } from './ConversationItem';
import { LoadingAnimation } from './interface/Loading';

interface ConversationListProps {
	conversations: Conversation[];
	onSelectConversation: (conversation: Conversation) => void;
	loadOlderConversations: () => void;
	nextConversationsToken?: string;
	selectedConversationId?: string;
	className?: string;
}

export const ConversationList = ({
	conversations,
	onSelectConversation,
	loadOlderConversations,
	nextConversationsToken,
	selectedConversationId,
	className,
}: ConversationListProps) => {
	return (
		<InfiniteScroll
			pageStart={0}
			loadMore={loadOlderConversations}
			hasMore={nextConversationsToken ? true : false}
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
			</div>
			{!nextConversationsToken && (
				<div className="rounded-md p-2 m-3 text-center border-2 font-medium">
					No more conversations
				</div>
			)}
		</InfiniteScroll>
	);
};
