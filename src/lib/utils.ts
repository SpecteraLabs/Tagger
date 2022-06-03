import type { ApplicationCommandOptionData } from 'discord.js';

const regex = /\{[^}]*\}/g;
const optionTypes = ['STRING', 'INTEGER', 'BOOLEAN', 'USER', 'CHANNEL', 'ROLE', 'MENTIONABLE', 'NUMBER'];

export function parseOptions(options?: string) {
	if (!options) return [];
	if (!regex.test(options)) throw new Error('Invalid options provided');
	const parsedOptions = options.match(regex)!;
	const optionsArray = new Set();
	for (const option of parsedOptions) {
		const parsedOption = option.replace(/[{}]/g, '');
		const [name, description, type, required] = parsedOption.split('|');
		if (!optionTypes.includes(type.toUpperCase()))
			throw new Error(`OptionType should be 'string' or 'number' or 'boolean' but recieved '${type}'`);
		optionsArray.add({
			name,
			description,
			type,
			required: Boolean(required) ?? false
		});
	}
	const returnable = [...optionsArray];
	return returnable as ApplicationCommandOptionData[];
}

export function makeTag(name: string, description: string, content: string, options?: string) {
	const parsedOptions = parseOptions(options);
	return {
		data: {
			name,
			description,
			options: parsedOptions
		},
		content
	};
}
