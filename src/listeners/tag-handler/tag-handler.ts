import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { Interaction } from 'discord.js';
import { InteractionTransformer } from 'tagscript-plugin-discord';

@ApplyOptions<Listener.Options>({
	name: 'tagHandler',
	event: 'interactionCreate'
})
export class TagHandler extends Listener {
	public async run(interaction: Interaction) {
		if (!interaction.guild || !interaction.isCommand()) return;
		const { commandName: command } = interaction;
		const result = await this.container.db.tags.findOne(interaction.guild.id);
		if (!result || !result.tags) return;
		const tag = result.tags.find((t) => t.data?.name === command);
		if (!tag) return;
		const content = await this.container.tagscript.run(tag.content, { interaction: new InteractionTransformer(interaction) });
		return interaction.reply({
			content: content.body
		});
	}
}
