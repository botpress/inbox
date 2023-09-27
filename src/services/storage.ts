import toast from 'react-hot-toast';
import { CredentialsClientBP } from '../types/botpress';
import { decrypt, encrypt } from './crypto';

export function extractAndDecryptCredentials(
	value: string
): CredentialsClientBP | null {
	try {
		const decryptedCredentialsString = decrypt(value);

		if (!decryptedCredentialsString) {
			return null;
		}

		const credentials = JSON.parse(decryptedCredentialsString);

		if (!credentials) {
			return null;
		}

		if (
			!credentials.token ||
			!credentials.workspaceId ||
			!credentials.botId
		) {
			return null;
		}

		return {
			token: credentials.token,
			workspaceId: credentials.workspaceId,
			botId: credentials.botId,
		};
	} catch (error: any) {
		toast("Couldn't decrypt credentials");

		toast.error(error.message || error);

		return null;
	}
}

export function getStoredCredentials(
	itemName?: string
): CredentialsClientBP | null {
	try {
		const credentialsEncrypted = localStorage.getItem(
			itemName ? itemName : 'bp-inbox-credentials'
		);

		const credentialsDecrypted = extractAndDecryptCredentials(
			credentialsEncrypted || ''
		);

		return credentialsDecrypted;
	} catch (error: any) {
		toast("Couldn't get credentials from storage");

		toast.error(error.message || error);

		return null;
	}
}

export function storeCredentials(
	credentials: CredentialsClientBP,
	itemName?: string
): void {
	try {
		const credentialsEncrypted = encrypt(JSON.stringify(credentials));

		localStorage.setItem(
			itemName ? itemName : 'bp-inbox-credentials',
			credentialsEncrypted
		);
	} catch (error: any) {
		toast("Couldn't clear credentials from storage");

		toast.error(error.message || error);
	}
}

export function clearStoredCredentials(itemName?: string): void {
	try {
		localStorage.removeItem(itemName ? itemName : 'bp-inbox-credentials');
	} catch (error: any) {
		toast("Couldn't clear credentials from storage");

		toast.error(error.message || error);
	}
}
