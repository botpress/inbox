import { Client } from '@botpress/client';
import { createContext, ReactNode, useContext, useState } from 'react';

interface BotpressClientContextData {
	createClient: (token: string, workspaceId: string, botId: string) => void;
	deleteClient: () => void;
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

	function deleteClient(): void {
		setBotpressClient(undefined);
	}

	return (
		<BotpressClientContext.Provider
			value={{
				createClient,
				deleteClient,
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
