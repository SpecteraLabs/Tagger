import { initializeApp, App, AppOptions } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { TagsCollection } from './Tags';

export class Firebase {
	private app: App;
	private db: Firestore;
	public tags: TagsCollection.TagDb;
	public constructor(options: AppOptions) {
		this.app = initializeApp(options);
		this.db = getFirestore(this.app);
		this.tags = new TagsCollection.TagDb(this.db);
	}
}
