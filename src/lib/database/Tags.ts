import type { ApplicationCommandOptionData } from 'discord.js';
import type { Firestore } from 'firebase-admin/firestore';

export namespace TagsCollection {
	export class TagDb {
		private db: Firestore;
		private collection;
		public constructor(db: Firestore) {
			this.db = db;
			this.collection = this.db.collection('tags');
		}

		public async findOne(id: string) {
			const ref = this.collection.doc(id);
			if (!ref) return;
			const result = await ref.get();
			return result.data() as Promise<Tags>;
		}

		public async createOne(guildId: string, data: unknown) {
			if (Array.isArray(data))
				return this.collection.doc(guildId).set({
					tags: [...data]
				});
			return this.collection.doc(guildId).set({
				tags: [data]
			});
		}

		public async pushToCollection(guildId: string, data: Tag) {
			const tags = (await this.findOne(guildId))!.tags;
			const docRef = this.collection.doc(guildId);
			tags.push(data);

			return docRef.update({
				tags: [...tags]
			});
		}

		public async deleteOne(guildId: string) {
			const docRef = this.collection.doc(guildId);
			return docRef.delete();
		}
	}

	export interface Tags {
		tags: Tag[];
	}

	export interface Tag {
		name: string;
		description: string;
		options: ApplicationCommandOptionData;
		response: string;
	}
}
