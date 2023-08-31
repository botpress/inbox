import CryptoJS from 'crypto-js';

const SECRET_KEY = 'my-secret-key';

export function encrypt(plainText: string) {
	return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
}

export function decrypt(cipherText: string) {
	const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
	return bytes.toString(CryptoJS.enc.Utf8);
}
