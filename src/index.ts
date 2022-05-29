import './lib/setup';
import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import { Firebase } from './lib/database/Firebase';
import { firebaseConfig } from './lib/constants';
import { credential } from 'firebase-admin';
import {
	BreakParser,
	DefineParser,
	FiftyFiftyParser,
	IfStatementParser,
	IncludesParser,
	Interpreter,
	IntersectionStatementParser,
	JSONVarParser,
	LooseVarsParser,
	OrdinalFormatParser,
	RandomParser,
	RangeParser,
	ReplaceParser,
	SliceParser,
	StopParser,
	StringFormatParser,
	UnionStatementParser
} from 'tagscript';
import { CooldownParser, DateFormatParser, DenyParser, EmbedParser, FilesParser, RequiredParser } from 'tagscript-plugin-discord';

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
container.tagscript = new Interpreter(
	new BreakParser(),
	new IfStatementParser(),
	new UnionStatementParser(),
	new IntersectionStatementParser(),
	new DefineParser(),
	new FiftyFiftyParser(),
	new StringFormatParser(),
	new OrdinalFormatParser(),
	new IncludesParser(),
	new JSONVarParser(),
	new LooseVarsParser(),
	new RandomParser(),
	new RangeParser(),
	new ReplaceParser(),
	new SliceParser(),
	new StopParser(),
	// Discord related parsers
	new RequiredParser(),
	new DenyParser(),
	new CooldownParser(),
	new EmbedParser(),
	new FilesParser(),
	new DateFormatParser()
);
