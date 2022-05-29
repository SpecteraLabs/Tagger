import { InteractionHandler } from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';

export class TagsAutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		if (interaction.options.getSubcommand() !== 'remove' || interaction.options.getSubcommand() !== 'update') return this.none();
		const focused = interaction.options.getFocused(true);
		if (!interaction.guild) return this.none();
		if (focused.name !== 'name') return this.none();
		const result = await this.container.db.tags.findOne(interaction.guild.id);
		if (!result || !result.tags) return this.none();
		const data = result.tags.map((tag) => {
			return {
				name: tag.data.name,
				value: tag.data.name
			};
		});
		return this.some(data);
	}
}
