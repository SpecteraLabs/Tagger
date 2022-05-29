import { RegisterBehavior } from '@sapphire/framework';
import { ChatInputSubcommandMappings, SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { CommandInteraction } from 'discord.js';
import { RegisterCommand } from '../lib/decorators/RegisterCommand';
import { makeTag } from '../lib/utils';

@RegisterCommand(
	{
		description: 'Manage tags of this server',
		subcommands: [
			new ChatInputSubcommandMappings([
				{
					name: 'add',
					to: 'addTag'
				},
				{
					name: 'list',
					to: 'listTags'
				}
			])
		]
	},
	{
		builder: (builder) => {
			return builder
				.setName('tag')
				.addSubcommand((subcommand) => {
					return subcommand
						.setName('add')
						.setDescription('Add a tag to the server')
						.addStringOption((option) => {
							return option.setName('name').setDescription('The name of the tag').setRequired(true);
						})
						.addStringOption((option) => {
							return option.setName('description').setDescription('The description of the tag').setRequired(true);
						})
						.addStringOption((option) => {
							return option.setName('content').setDescription('The content of the tag').setRequired(true);
						})
						.addStringOption((option) => {
							return option.setName('options').setDescription('The options for the tag');
						});
				})
				.addSubcommand((subcommand) => {
					return subcommand
						.setName('remove')
						.setDescription('Remove a tag from the server')
						.addStringOption((option) => {
							return option.setName('name').setDescription('The name of the tag').setRequired(true);
						});
				})
				.addSubcommand((subcommand) => {
					return subcommand.setName('list').setDescription('List all tags on the server');
				})
				.addSubcommand((subcommand) => {
					return subcommand
						.setName('update')
						.setDescription('Update a tag on the server')
						.addStringOption((option) => {
							return option.setName('name').setDescription('The name of the tag').setRequired(true);
						})
						.addStringOption((option) => {
							return option.setName('description').setDescription('The new description of the tag');
						})
						.addStringOption((option) => {
							return option.setName('content').setDescription('The new content of the tag');
						})
						.addStringOption((option) => {
							return option.setName('options').setDescription('The new options for the tag');
						});
				});
		},
		options: {
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
			idHints: ['979378493152444416']
		}
	}
)
export class Tag extends SubCommandPluginCommand {
	public async addTag(interaction: CommandInteraction) {
		const name = interaction.options.getString('name', true);
		const description = interaction.options.getString('description', true);
		const content = interaction.options.getString('content', true);
		const options = interaction.options.getString('options');
		const tag = makeTag(name, description, content, options!);
		await this.container.db.tags.pushToCollection(interaction.guild!.id, tag);
		return interaction.reply(`Added tag **${name}**`);
	}

	public async listTags(interaction: CommandInteraction) {
		const tags = await this.container.db.tags.findOne(interaction.guild!.id);
		if (!tags || !tags.tags.length) return interaction.reply('No tags found');
		return interaction.reply({
			content: `${tags.tags.map((tag) => {
				return `**${tag.data?.name}**: ${tag.data?.description}`;
			})}`
		});
	}
}
