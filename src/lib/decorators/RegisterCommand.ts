import type { ApplicationCommandRegistry, Piece } from '@sapphire/framework';
import type { SlashCommandBuilder } from '@discordjs/builders';
import type { Ctor } from '@sapphire/utilities';
import { createClassDecorator, createProxy } from '@sapphire/decorators';

export function RegisterCommand<T extends Piece.Options>(options: T, command: CommandType): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof Piece>, Piece>) => {
		return createProxy(target, {
			construct: (ctor, [context, baseOptions = {}]: [Piece.Context, Piece.Options]) => {
				ctor.prototype.registerApplicationCommands = (registry: ApplicationCommandRegistry) => {
					registry.registerChatInputCommand((cmd) => {
						return command.builder(cmd.setName(registry.commandName));
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
