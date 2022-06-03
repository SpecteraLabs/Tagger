import type { Interpreter } from 'tagscript';
import type { TagsManager } from './lib/database/TagsManager';

declare module '@sapphire/pieces' {
	interface Container {
		tags: TagsManager;
		tagscript: Interpreter;
	}
}
