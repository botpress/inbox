import { Client } from '@botpress/client';

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

export type CustomClientBP = (
	token: string,
	workspaceId: string,
	botId: string
) => Client;

export interface CredentialsClientBP {
	token: string;
	workspaceId: string;
	botId: string;
}
