import robotFaceIcon from '../../assets/robot-face-icon.png';

interface HeaderProps {
	handleLogout: () => void;
	botName?: string;
	className?: string;
}

export function Header({ handleLogout, botName, className }: HeaderProps) {
	return (
		<div
			className={`overflow-hidden default-border bg-white p-3 flex items-center justify-between top-1 z-10 m-2 ${className}`}
		>
			<div className="flex flex-row gap-5 items-center">
				<h1 className="text-lg font-medium flex items-center gap-2">
					<img
						src={robotFaceIcon}
						alt="Robot face icon"
						className="w-6 h-6 mt-[0.3rem]"
					/>
					Chatbot Inbox
				</h1>
				<div className="px-3 py-1 text-center font-medium rounded-full border-gray-200 border-2">
					{botName || 'Unnamed bot'}
				</div>
			</div>
			<div className="flex items-center gap-2">
				<a className="relative cursor-pointer whitespace-nowrap rounded-md p-2 px-4 text-sm transition-colors  text-zinc-900">
					<span className="relative z-10">Conversations</span>
					<div
						className="absolute inset-0 rounded-md bg-zinc-100 opacity-100"
						data-projection-id="1"
					></div>
				</a>
			</div>
			<div className="flex flex-row gap-5 items-center">
				<button
					className="bg-red-500 text-white text-sm font-medium rounded-md px-4 py-2"
					onClick={() => handleLogout()}
				>
					Logout
				</button>
			</div>
		</div>
	);
}
