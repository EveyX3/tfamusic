import { Command } from '@sapphire/framework';
import { useQueue, useTimeline } from 'discord-player';
import { Colors } from 'discord.js';

export class VolumeCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'Changes the volume of the track and entire queue'
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption((option) =>
					option.setName('amount').setDescription('The amount of volume you want to change to').setMinValue(0).setMaxValue(100)
				);
		});
	}
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { emojis, voice } = this.container.client.utils;
		const queue = useQueue(interaction.guild!.id);
		const timeline = useTimeline(interaction.guild!.id)!;
		const permissions = voice(interaction);
		const volume = interaction.options.getInteger('amount');

		if (!queue) return interaction.reply({
			embeds: [{
				description: `${emojis.error} | I must be in the voice channel`,
				color: Colors.Orange
			}], ephemeral: true
		});
		if (!queue.currentTrack)
			return interaction.reply({
				embeds: [{
					description: `${emojis.error} | No track is playing`
				}],
				ephemeral: true
			});

		if (!volume) return interaction.reply({ embeds: [{ description: `🔊 Volume is: **${timeline.volume}**`, color: Colors.Blurple }] });
		if (permissions.clientToMember) return interaction.reply({ content: permissions.clientToMember, ephemeral: true });

		timeline.setVolume(volume!);
		return interaction.reply({
			embeds: [{
				description: `${emojis.success} | Volume has been set to: \`${timeline.volume}%\``,
				color: Colors.Blurple
			}]
		});
	}
}
