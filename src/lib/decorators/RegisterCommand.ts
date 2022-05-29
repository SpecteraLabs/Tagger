import type { ApplicationCommandRegistry, CommandOptions, Piece } from '@sapphire/framework';
import type { SlashCommandBuilder } from '@discordjs/builders';
import type { Ctor } from '@sapphire/utilities';
import { createClassDecorator, createProxy } from '@sapphire/decorators';
import type { SubcommandPluginCommandOptions } from '@sapphire/plugin-subcommands';

export function RegisterCommand<T extends SubcommandPluginCommandOptions>(options: T, command: CommandType): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof Piece>, Piece>) => {
		return createProxy(target, {
			construct: (ctor, [context, baseOptions = {}]: [Piece.Context, Piece.Options]) => {
				ctor.prototype.registerApplicationCommands = (registry: ApplicationCommandRegistry) => {
					registry.registerChatInputCommand((cmd) => {
						return command.builder(cmd.setName(baseOptions.name!).setDescription(options.description!));
					}, command.options);
				};
				return new ctor(context, {
					...baseOptions,
					...options
				});
			}
		});
	});
}

interface CommandType {
	builder: (builder: SlashCommandBuilder) => unknown;
	options?: ApplicationCommandRegistry.RegisterOptions;
}
