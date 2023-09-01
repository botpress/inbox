import toast from 'react-hot-toast';
import { Client } from '@botpress/client';
import { createContext, ReactNode, useContext, useState } from 'react';

interface BotpressClientContextData {
	createClient: (
		token: string,
		workspaceId: string,
		botId: string
	) => Client | null;
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
	): Client | null {
		try {
			const client = new Client({ token, workspaceId, botId });

			setBotpressClient(client);

			return client;
		} catch (error) {
			toast.error("Couldn't create client");

			return null;
		}
	}

	botpressClient?.listConversations({});

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
