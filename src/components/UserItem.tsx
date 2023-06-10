import defaultAvatarImg from '../assets/default-avatar.png';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from '@botpress/client';

interface UserItemProps {
	user: User;
}

export function UserItem({ user }: UserItemProps) {
	return (
		<div className="flex flex-col justify-between gap-2 rounded-xl p-4 w-full border-2">
			<div className="flex gap-2 items-center">
				<img
					src={defaultAvatarImg}
					alt="Default avatar"
					className="h-10"
				/>
				{user.id === import.meta.env.VITE_BOTPRESS_BOT_ID_AS_USER ? (
					<p className="flex flex-col">
						<span className="font-medium text-blue-500">Bot</span>
					</p>
				) : (
					<p className="flex flex-col leading-none">
						<span className="font-medium">
							{user.tags['whatsapp:name'] || 'User with no name'}
						</span>
						<span className="text-sm text-gray-400">
							{user.tags['whatsapp:userId'] ||
								'No whatsapp user id'}
						</span>
					</p>
				)}
			</div>
			<hr />
			{Object.keys(user.tags).length > 0 && (
				<>
					<div className="flex flex-col gap-2">
						{Object.keys(user.tags)
							.filter(
								(tag) =>
									tag !== 'whatsapp:name' &&
									tag !== 'whatsapp:userId'
							)
							.map((tag) => {
								return (
									<span
										className="flex flex-col bg-gray-200 rounded-xl px-2 py-1 text-xs"
										key={tag}
									>
										<span className="font-medium">
											🏷️ {tag}
										</span>{' '}
										<span className="">
											{user.tags[tag]}
										</span>
									</span>
								);
							})}
					</div>
					<hr />
				</>
			)}
			<p className="flex items-center gap-1">
				<span className="text-sm text-gray-400">
					Created at{' '}
					{format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm', {
						// change it to your locale
						locale: ptBR,
					})}
				</span>
			</p>
		</div>
	);
}
