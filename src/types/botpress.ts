export interface TextPayloadBP {
	text: string;
	metadata?: string;
}

export interface ChoicePayloadBP {
	text: string;
	options: { label: string; value: string }[];
}

export interface QuickReplyPayloadBP {
	payload: {
		text: string;
		type: string;
		value: string;
	};
}
