import { isNullishOrEmpty } from '@sapphire/utilities';

export function envParseArray(key: 'OWNERS', defaultValue?: string[]): string[] {
	const value = process.env[key];
	if (isNullishOrEmpty(value)) {
		if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be an array, but is empty or undefined.`);
		return defaultValue;
	}

	return value.split(' ');
}

export function envParseString<K extends TaggerEnvString>(key: K, defaultValue?: TaggerEnv[K]): TaggerEnv[K] {
	const value: any = process.env[key];
	if (isNullishOrEmpty(value)) {
		if (defaultValue === undefined) throw new Error(`[ENV] ${key} - The key must be a string, but is empty or undefined.`);
		return defaultValue;
	}

	return value;
}

export type TaggerEnvAny = keyof TaggerEnv;
export type TaggerEnvString = {
	[K in TaggerEnvAny]: TaggerEnv[K] extends BooleanString | IntegerString ? never : K;
}[TaggerEnvAny];

export interface TaggerEnv {
	FIREBASE_API_KEY: string;
	FIREBASE_AUTH_URI: string;
	FIREBASE_PROJECT_ID: string;
	FIREBASE_CLIENT_ID: string;
	FIREBASE_CLIENT_EMAIL: string;
	FIREBASE_PRIVATE_KEY: string;
	FIREBASE_PRIVATE_KEY_ID: string;
	FIREBASE_TOKEN_URI: string;
	FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string;
	FIREBASE_CLIENT_X509_CERT_URL: string;
}
export type IntegerString = `${number}`;
export type BooleanString = 'true' | 'false';
