import { initializeApp, App, AppOptions } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { createClient, RedisClientType } from 'redis';
import { TagDb } from './Database';

export class TagsManager {
	public db: TagDb;
	public cache: RedisClientType;
	private app: App;
	private database: Firestore;
	public constructor(options: AppOptions) {
		this.app = initializeApp(options);
		this.database = getFirestore(this.app);
		this.db = new TagDb(this.database);
		this.cache = createClient();
	}
}
