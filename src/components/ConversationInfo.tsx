import { Conversation, User } from '@botpress/client';
import { format } from 'date-fns';
import { UserItem } from './UserItem';

interface ConversationInfoProps {
	conversation: Conversation;
	users: User[];
	onDeleteConversation: (conversationId: string) => void;
	// onUpdateConversation: (
	// 	conversationId: string,
	// 	data: {
	// 		name?: string;
	// 		phone?: string;
	// 	}
	// ) => void;
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
	onDeleteConversation,
	className,
}: ConversationInfoProps) => {
	return (
		<div className={`flex flex-col gap-8 p-4 ${className}`}>
			{/* <div className="flex items-center gap-4">
				<div className="flex-shrink-0 self-center w-20 h-20 rounded-full bg-gray-300 mr-2" />
				<input
					className="w-full px-3 py-1 rounded-xl border-2 text-lg font-medium"
					{...register('name', { required: false, disabled: true })}
				/>
			</div> */}
			{/* Phone */}
			{/* <div className="flex items-center relative">
				<span className="absolute top-2 left-2">📞</span>
				<input
					className="w-full pl-10 pr-3 py-1 rounded-xl border-2"
					{...register('phone', { required: false, disabled: true })}
				/>
			</div> */}
			{/* Textarea for details */}
			{/* <div className="flex items-center relative">
				<span className="absolute top-2 left-2">💬</span>
				<textarea
					className="w-full pl-10 pr-3 py-1 rounded-lg border-2"
					placeholder="Sobre o usuário..."
					{...register('about', { required: false, disabled: true })}
				/>
			</div> */}
			{/* <button
				className="bg-gray-400 font-medium text-white rounded-xl p-2"
				type="submit"
				disabled={true}
			>
				Atualizar conversa
			</button> */}

			<div>
				{users.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{users
							.sort((a) =>
								// to have the bot at the bottom always
								a.id ===
								import.meta.env.VITE_BOTPRESS_BOT_ID_AS_USER
									? 1
									: -1
							)
							.map((user) => {
								return <UserItem user={user} />;
							})}
					</div>
				) : (
					<div className="flex flex-col justify-between text-gray-400 gap-2 rounded-xl p-4 w-full border-2">
						No user info
					</div>
				)}
			</div>

			<hr />
			<div className="flex flex-col items-center gap-2">
				{Object.keys(conversation.tags).map((tag) => {
					return (
						<span
							className="bg-gray-200 w-full rounded-xl px-2 py-1 text-xs"
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
						{format(
							new Date(conversation.createdAt),
							'dd/MM/yyyy HH:mm'
						)}
					</span>
				</p>
				<p className="flex items-center gap-1">
					<span>📝</span>
					<span className="text-gray-400">
						Updated at{' '}
						{format(
							new Date(conversation.updatedAt),
							'dd/MM/yyyy HH:mm'
						)}
					</span>
				</p>
			</div>
			<hr />
			<button
				className="bg-red-500 font-medium text-white rounded-xl p-2"
				type="button"
				onClick={() => onDeleteConversation(conversation.id)}
			>
				Delete conversation
			</button>
		</div>
	);
};
