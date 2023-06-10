import { formatRelative } from 'date-fns';
import { Message } from '@botpress/client';
import { ptBR } from 'date-fns/locale';
import {
	ChoicePayloadBP,
	QuickReplyPayloadBP,
	TextPayloadBP,
} from '../types/botpress';

interface MessageItemProps {
	message: Message;
	className?: string;
}

export const MessageItem = ({ message, className }: MessageItemProps) => {
	const isTextPayload = (payload: any): payload is TextPayloadBP => {
		return (
			(payload as TextPayloadBP).text !== undefined &&
			payload.options === undefined
		);
	};

	const isChoicePayload = (payload: any): payload is ChoicePayloadBP => {
		return (payload as ChoicePayloadBP).options !== undefined;
	};

	const isQuickReplyPayload = (
		payload: any
	): payload is QuickReplyPayloadBP => {
		return (payload as QuickReplyPayloadBP).payload?.text !== undefined;
	};

	return (
		<div
			className={`flex flex-col ${
				message.direction === 'incoming'
					? 'self-start items-start pr-5'
					: 'self-end items-end pl-5'
			} ${className}`}
		>
			<div
				className={`px-3 py-2 rounded-2xl ${
					message.direction === 'incoming'
						? 'bg-blue-500 text-white'
						: 'bg-gray-200'
				}`}
			>
				{isTextPayload(message.payload) ? (
					<span className="whitespace-pre-line">
						{message.payload.text}
					</span>
				) : isQuickReplyPayload(message.payload) ? (
					<span className="whitespace-pre-line">
						{message.payload.payload.text}
					</span>
				) : isChoicePayload(message.payload) ? (
					<>
						<span className="whitespace-pre-line">
							{message.payload.text}
						</span>
						<ul className="list-inside mt-2">
							{message.payload.options.map((option) => (
								<li key={option.value}>{option.label}</li>
							))}
						</ul>
					</>
				) : (
					<></>
				)}
			</div>
			<span className="text-sm text-gray-400">
				{formatRelative(new Date(message.createdAt), new Date(), {
					// change it to your locale
					locale: ptBR,
				})}
			</span>
		</div>
	);
};
