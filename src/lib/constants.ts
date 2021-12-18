import { join } from 'path';
import { envParseString } from './env-parser';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');
export const RandomLoadingMessage = ['Computing...', 'Thinking...', 'Cooking some food', 'Give me a moment', 'Loading...'];

export const firebaseConfig = {
	type: 'service_account',
	project_id: envParseString('FIREBASE_PROJECT_ID'),
	private_key_id: envParseString('FIREBASE_PRIVATE_KEY_ID'),
	private_key: process.env.FIREBASE_PRIVATE_KEY,
	client_email: envParseString('FIREBASE_CLIENT_EMAIL'),
	client_id: envParseString('FIREBASE_CLIENT_ID'),
	auth_uri: envParseString('FIREBASE_AUTH_URI'),
	token_uri: envParseString('FIREBASE_TOKEN_URI'),
	auth_provider_x509_cert_url: envParseString('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
	client_x509_cert_url: envParseString('FIREBASE_CLIENT_X509_CERT_URL')
};
