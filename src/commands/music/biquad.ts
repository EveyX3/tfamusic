import { Command } from '@sapphire/framework';
import { BiquadFilterType, useQueue } from 'discord-player';
import { APIApplicationCommandOptionChoice, Colors } from 'discord.js';

type SupportedBiquadFilters = keyof typeof BiquadFilterType | 'Off';

export class BiquadCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'The biquad filter that can be applied to tracks'
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		const biquadFilters = Object.keys(BiquadFilterType)
			.filter((k) => typeof k[0] === 'string')
			.map((m) => ({
				name: m,
				value: m
			})) as APIApplicationCommandOptionChoice<SupportedBiquadFilters>[];

		biquadFilters.unshift({
			name: 'Disable',
			value: 'Off'
		});

		registry.registerChatInputCommand((builder) => {
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('filter')
						.setDescription('The biquad filter to use')
						.addChoices(...biquadFilters)
						.setRequired(true)
				)
				.addNumberOption((option) => {
					return option.setMinValue(-50).setMaxValue(50).setName('gain').setDescription('The dB gain value').setRequired(false);
				});
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { emojis, voice } = this.container.client.utils;
		const queue = useQueue(interaction.guild!.id);
		const permissions = voice(interaction);

		const filter = interaction.options.getString('filter', true) as SupportedBiquadFilters;
		const dB = interaction.options.getNumber('gain');

		if (!queue) return interaction.reply({
			embeds: [{
				description: `${emojis.error} | I must be in the voice channel`,
				color: Colors.Orange
			}], ephemeral: true
		});
		if (!queue.currentTrack)
			return interaction.reply({
				embeds: [{
					description: `${emojis.error} | There is no track currently playing`,
					color: Colors.Orange
				}],
				ephemeral: true
			});
		if (permissions.clientToMember) return interaction.reply({ content: permissions.clientToMember, ephemeral: true });

		if (!queue.filters.biquad)
			return interaction.reply({
				embeds: [{
					description: `${emojis.error} | The biquad filters are unavailable for this queue`,
					color: Colors.Orange
				}],
				ephemeral: true
			});

		if (filter === 'Off') {
			queue.filters.biquad.disable();
		} else {
			if (typeof dB === 'number') queue.filters.biquad.setGain(dB);
			queue.filters.biquad.enable();
			queue.filters.biquad.setFilter(BiquadFilterType[filter]);
		}

		return interaction.reply({
			embeds: [{
				description: `${emojis.success} | The biquad filter has been set to: **${filter}**`
			}]
		});
	}
}
