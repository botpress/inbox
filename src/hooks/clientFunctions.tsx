import { Client, Conversation, Message } from '@botpress/client';
import { ConversationWithMessages } from '../pages/Dashboard';


interface ListConversationsProps {
	client: Client;
	withFirstMessages?: boolean;
	hideEmpty?: boolean;
	nextToken?: string;
}

export async function listConversations({
	client,
	withFirstMessages,
	hideEmpty,
	nextToken,
}: ListConversationsProps): Promise<{
	conversations: (Conversation | ConversationWithMessages)[];
	nextToken?: string;
}> {
	let conversationList: (Conversation | ConversationWithMessages)[] = [];
	let nextConversationsToken: string | undefined;

	const listConversationsRequest = await client.listConversations({
		nextToken,
	});

	if (withFirstMessages) {
		listConversationsRequest.conversations.forEach(
			async (currentConversation) => {
				const messagesInfo = await listConversationMessages(
					client,
					currentConversation.id
				);

				// if there are no messages in the conversation, it's not added to the list
				if (hideEmpty && messagesInfo.messages?.length === 0) {
					return;
				}

				conversationList.push({
					...currentConversation,
					messages: messagesInfo ? messagesInfo.messages : [],
					nextMessagesToken: messagesInfo
						? messagesInfo.nextToken
						: undefined,
				} as ConversationWithMessages);
			}
		);
	} else {
		conversationList =
			listConversationsRequest.conversations as Conversation[];
	}

	nextConversationsToken = listConversationsRequest.meta.nextToken;

	return {
		conversations: conversationList,
		nextToken: nextConversationsToken,
	};
}

export async function listConversationMessages(
	client: Client,
	conversationId: string,
	nextToken?: string
): Promise<{
	messages: Message[];
	nextToken?: string;
}> {
	const listMessagesRequest = await client.listMessages({
		conversationId,
		nextToken,
	});

	return {
		messages: listMessagesRequest.messages,
		nextToken: listMessagesRequest.meta.nextToken,
	};
}
