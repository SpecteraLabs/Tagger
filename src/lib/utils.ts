import type { ApplicationCommandOptionData } from 'discord.js';

const regex = /\{[^}]*\}/g;

export function parseOptions(options?: string) {
	if (!options) return [];
	if (!regex.test(options)) throw new Error('Invalid options provided');
	const parsedOptions = options.match(regex)!;
	const optionsArray = new Set();
	for (const option of parsedOptions) {
		const parsedOption = option.replace(/[{}]/g, '');
		const [name, description, type, required] = parsedOption.split('|');
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
