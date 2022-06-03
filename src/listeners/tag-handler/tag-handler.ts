import { ApplyOptions } from '@sapphire/decorators';
import { isGuildBasedChannel, isGuildMember } from '@sapphire/discord.js-utilities';
import { Listener } from '@sapphire/framework';
import type { Interaction } from 'discord.js';
import {
	ChannelTransformer,
	GuildTransformer,
	InteractionTransformer,
	MemberTransformer,
	resolveCommandOptions,
	UserTransformer
} from 'tagscript-plugin-discord';

@ApplyOptions<Listener.Options>({
	name: 'tagHandler',
	event: 'interactionCreate'
})
export class TagHandler extends Listener {
	public async run(interaction: Interaction) {
		if (!interaction.guild || !interaction.isCommand() || !isGuildMember(interaction.member) || !isGuildBasedChannel(interaction.channel)) return;
		const { commandName: command } = interaction;
		const result = await this.container.tags.db.findOne(interaction.guild.id);
		if (!result || !result.tags) return;
		const tag = result.tags.find((t) => t.data?.name === command);
		if (!tag) return;
		const content = await this.container.tagscript.run(tag.content, {
			...resolveCommandOptions(interaction.options),
			interaction: new InteractionTransformer(interaction),
			member: new MemberTransformer(interaction.member),
			user: new UserTransformer(interaction.user),
			guild: new GuildTransformer(interaction.guild),
			channel: new ChannelTransformer(interaction.channel)
		});
		return interaction.reply({
			content: content.body
		});
	}
}
