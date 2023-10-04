import { Client, Conversation, Message } from '@botpress/client';

export interface ConversationWithOptionalMessages extends Conversation {
	messages?: Message[];
	nextMessagesToken?: string;
}

export async function listConversations(
	client: Client,
	nextConversationsToken?: string
) {
	const listRequest = await client.listConversations({
		nextToken: nextConversationsToken,
	});

	return {
		conversations: listRequest.conversations,
		nextConversationsToken: listRequest.meta.nextToken,
	};
}

export async function listConversationsWithMessages(
	client: Client,
	nextConversationsToken?: string,
	hideEmptyConversations?: boolean
) {
	// should use the listConversationsWithMessages function

	const listRequest = await client.listConversations({
		nextToken: nextConversationsToken,
	});

	const conversations: ConversationWithOptionalMessages[] =
		listRequest.conversations;

	if (hideEmptyConversations) {
		const conversationsWithMessages = await filterOutEmptyConversations(
			client,
			conversations
		);

		return {
			conversations: conversationsWithMessages,
			nextConversationsToken: listRequest.meta.nextToken,
		};
	}

	return {
		conversations,
		nextConversationsToken: listRequest.meta.nextToken,
	};
}

export async function listMessagesByConversationId(
	client: Client,
	conversationId: string,
	nextMessagesToken?: string
) {
	const listRequest = await client.listMessages({
		conversationId,
		nextToken: nextMessagesToken,
	});

	return {
		messages: listRequest.messages,
		nextMessagesToken: listRequest.meta.nextToken,
	};
}

export async function getBotInfo(client: Client, botId: string) {
	const botInfo = await client.getBot({
		id: botId,
	});

	return {
		name: botInfo.bot.name,
	};
}

export async function filterOutEmptyConversations(
	client: Client,
	conversations: ConversationWithOptionalMessages[]
) {
	for (const conversation of conversations) {
		const { messages, nextMessagesToken } =
			await listMessagesByConversationId(client, conversation.id);

		conversation.messages = messages;
		conversation.nextMessagesToken = nextMessagesToken;
	}

	return conversations.filter(
		(conversation) => conversation.messages!.length > 0
	);
}
