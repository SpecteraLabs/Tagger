import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';
import Fuse from 'fuse.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class TagsAutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		if (interaction.options.getSubcommand() !== 'remove') return this.none();
		const focused = interaction.options.getFocused(true);
		if (!interaction.guild) return this.none();
		if (focused.name !== 'name') return this.none();
		const tags = await this.container.tags.db.findOne(interaction.guild.id);
		if (!tags || !tags) return this.none();
		const fuse = new Fuse(tags.toJSON(), {
			keys: ['data.name']
		});
		if (!String(focused.value).length)
			return this.some(
				tags.toJSON().map((tag) => {
					return { name: tag.data.name, value: tag.data.name };
				})
			);
		const data = fuse.search(String(focused.value));
		return this.some(
			data.map((tag) => {
				return {
					name: tag.item.data.name,
					value: tag.item.data.name
				};
			})
		);
	}
}
