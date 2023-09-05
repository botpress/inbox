interface DisclaimerProps {
	full?: boolean;
}

export function Disclaimer({ full }: DisclaimerProps) {
	return (
		<p className="px-4 py-3 border-2 border-blue-300 bg-blue-100 rounded-md text-zinc-700">
			{full && (
				<>
					This tool is not affiliated with Botpress.
					<br />
				</>
			)}
			The official conversation manager is coming soon! 🔎
		</p>
	);
}
