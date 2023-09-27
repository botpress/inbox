import { Conversation, User } from '@botpress/client';
import { formatRelative } from 'date-fns';
import { UserItem } from './UserItem';

interface ConversationInfoProps {
	conversation: Conversation;
	users: User[];
	botpressBotIdAsAUser?: string;
	onDeleteConversation: (conversationId: string) => void;
	className?: string;
}

export interface UserForm {
	name: string;
	phone: string;
	about: string | null;
}

export const ConversationInfo = ({
	conversation,
	users,
	botpressBotIdAsAUser,
	onDeleteConversation,
	className,
}: ConversationInfoProps) => {
	return (
		<div className={`flex flex-col gap-8 p-4 ${className}`}>
			<div>
				{users.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{users
							.sort((a) =>
								// to have the bot at the bottom always
								a.id === botpressBotIdAsAUser ? 1 : -1
							)
							.map((user, index) => {
								return (
									<UserItem
										user={user}
										botpressBotIdAsAUser={
											botpressBotIdAsAUser
										}
										key={index}
									/>
								);
							})}
					</div>
				) : (
					<div className="flex flex-col justify-between text-gray-400 gap-2 rounded-md p-4 w-full border-2">
						No users info
					</div>
				)}
			</div>

			<hr />
			<div className="flex flex-col items-center gap-2">
				{Object.keys(conversation.tags).map((tag) => {
					return (
						<span
							className="bg-gray-200 w-full rounded-md px-2 py-1 text-xs"
							key={tag}
						>
							🏷️ <span className="font-medium">{tag}</span>{' '}
							<span className="">{conversation.tags[tag]}</span>
						</span>
					);
				})}
			</div>
			<hr />

			{/* Conversation creation date */}
			<div className="flex flex-col gap-2">
				<p className="flex items-center gap-1">
					<span>📅</span>
					<span className="text-gray-400">
						Started at{' '}
						{formatRelative(
							new Date(),
							new Date(conversation.createdAt)
						)}
					</span>
				</p>
				<p className="flex items-center gap-1">
					<span>📝</span>
					<span className="text-gray-400">
						Updated at{' '}
						{formatRelative(
							new Date(),
							new Date(conversation.updatedAt)
						)}
					</span>
				</p>
			</div>
			<hr />
			<button
				className="bg-red-500 font-medium text-white rounded-md p-2"
				type="button"
				onClick={() => onDeleteConversation(conversation.id)}
			>
				Delete conversation
			</button>
		</div>
	);
};
