import { Client } from '@botpress/client';
import { createContext, ReactNode, useContext, useState } from 'react';

interface BotpressClientContextData {
	createClient: (token: string, workspaceId: string, botId: string) => void;
	botpressClient: Client | undefined;
}

const BotpressClientContext = createContext<BotpressClientContextData>(
	{} as BotpressClientContextData
);

interface BotpressClientContextProviderProps {
	children: ReactNode;
}

export function BotpressClientContextProvider({
	children,
}: BotpressClientContextProviderProps) {
	const [botpressClient, setBotpressClient] = useState<Client | undefined>();

	function createClient(
		token: string,
		workspaceId: string,
		botId: string
	): void {
		setBotpressClient(new Client({ token, workspaceId, botId }));
	}

	return (
		<BotpressClientContext.Provider
			value={{
				createClient,
				botpressClient,
			}}
		>
			{children}
		</BotpressClientContext.Provider>
	);
}

export function useBotpressClient() {
	const context = useContext(BotpressClientContext);

	return context;
}
