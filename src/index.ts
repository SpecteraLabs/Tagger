import './lib/setup';
import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { Firebase } from './lib/database/Firebase';
import { firebaseConfig } from './lib/constants';
import { credential } from 'firebase-admin';

const client = new SapphireClient({
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS'
	]
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

void main();
container.db = new Firebase({
	credential: credential.cert(JSON.parse(JSON.stringify(firebaseConfig)))
});
