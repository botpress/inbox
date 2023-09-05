interface HeaderProps {
	handleLogout: () => void;
	className?: string;
}

export function Header({ handleLogout, className }: HeaderProps) {
	return (
		<div
			className={`overflow-hidden default-border bg-white p-3 flex items-center justify-between top-1 z-10 m-2 ${className}`}
		>
			<div className="flex flex-row gap-5 items-center">
				<h1 className="text-lg font-medium">External tool</h1>
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
