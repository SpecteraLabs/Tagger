import type { Interpreter } from 'tagscript';
import type { Firebase } from './lib/database/Firebase';

declare module '@sapphire/pieces' {
	interface Container {
		db: Firebase;
		tagscript: Interpreter;
	}
}
