import { Client, Conversation } from '@botpress/client';
import { ConversationItem } from './ConversationItem';
import { ConversationWithMessagesAndUsers } from '../pages/Dashboard';

interface ConversationListProps {
	conversations: ConversationWithMessagesAndUsers[];
	selectedConversationId?: string;
	onSelectConversation: (conversation: Conversation) => void;
	className?: string;
	botpressClient: Client;
	// loadOlderConversations?: () => void;
}

export const ConversationList = ({
	conversations,
	selectedConversationId,
	onSelectConversation,
	// loadOlderConversations,
	className,
}: ConversationListProps) => {
	return (
		<div className={`flex flex-col items-center ${className}`}>
			<div className="overflow-y-scroll flex w-full flex-col divide-y-2">
				{conversations
					// ordena pela mensagem com data mais recente
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
			{/* {loadOlderConversations && (
				<button
					className="rounded-xl p-2 m-3 border-2"
					onClick={() => loadOlderConversations()}
				>
					Load older conversations
				</button>
			)} */}
		</div>
	);
};
