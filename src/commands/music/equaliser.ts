import { Command } from '@sapphire/framework';
import { EqualizerConfigurationPreset, useQueue } from 'discord-player';
import { Colors } from 'discord.js';

export class EqualizerCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'The equaliser filter that can be applied to tracks'
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option
						.setName('preset')
						.setDescription('The equaliser filter to use')
						.addChoices(
							...Object.keys(EqualizerConfigurationPreset).map((m) => ({
								name: m,
								value: m
							}))
						)
						.setRequired(true)
				);
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { emojis, voice } = this.container.client.utils;
		const queue = useQueue(interaction.guild!.id);
		const permissions = voice(interaction);
		const preset = interaction.options.getString('preset') as string;

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

		if (!queue.filters.equalizer)
			return interaction.reply({
				embeds: [{
					description: `${emojis.error} | The equaliser is not available for this queue`,
					color: Colors.Orange
				}],
				ephemeral: true
			});

		queue.filters.equalizer.setEQ(EqualizerConfigurationPreset[preset]);
		queue.filters.equalizer.enable();

		return interaction.reply({
			embeds: [{
				description: `${emojis.success} | The equaliser filter has been set to \`${preset}\``,
				color: Colors.Blurple
			}]
		});
	}
}
