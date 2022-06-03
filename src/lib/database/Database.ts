import { ApplicationCommandOptionData, Collection } from 'discord.js';
import { FieldValue, Firestore } from 'firebase-admin/firestore';

export class TagDb {
	private db: Firestore;
	private collection;
	public constructor(db: Firestore) {
		this.db = db;
		this.collection = this.db.collection('tags');
	}

	public async findOne(id: string) {
		const ref = this.collection.doc(id);
		const result = await ref.get();
		if (!result.exists) {
			await this.createOne(id, {});
			return;
		}
		return new Collection(((result.data() as Tags)?.tags).map((tag: Tag) => [tag.data.name, tag]));
	}

	public async createOne(guildId: string, data: unknown) {
		if (Array.isArray(data))
			return this.collection.doc(guildId).set({
				tags: data
			});
		return this.collection.doc(guildId).set({
			tags: [data]
		});
	}

	public async pushToCollection(guildId: string, data: Tag) {
		const docRef = this.collection.doc(guildId);

		return docRef.update({
			tags: FieldValue.arrayUnion(data)
		});
	}

	public async removeFromCollection(guildId: string, name: string) {
		const tags = (await this.findOne(guildId))!;
		const docRef = this.collection.doc(guildId);
		const tag = tags.get(name);

		return docRef.update({
			tags: FieldValue.arrayRemove(tag)
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
	data: {
		name: string;
		description: string;
		options: ApplicationCommandOptionData[];
	};
	content: string;
}
