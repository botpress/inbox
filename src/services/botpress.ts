import { Client } from '@botpress/client';

export const botpressClient = (
	token: string,
	workspaceId: string,
	botId: string
) =>
	new Client({
		token,
		workspaceId,
		botId,
	});

// USING ENVIRONMENT VARIABLES
// new Client({
// 	token: import.meta.env.VITE_BOTPRESS_TOKEN,
// 	workspaceId: import.meta.env.VITE_BOTPRESS_WORKSPACE_ID,
// 	botId: import.meta.env.VITE_BOTPRESS_BOT_ID,
// });
