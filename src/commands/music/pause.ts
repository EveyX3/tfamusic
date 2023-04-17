import { Command } from '@sapphire/framework';
import { useQueue, useTimeline } from 'discord-player';
import { Colors } from 'discord.js';

export class PauseCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'Pauses or resumes the current track'
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder //
				.setName(this.name)
				.setDescription(this.description);
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { emojis, voice } = this.container.client.utils;
		const queue = useQueue(interaction.guild!.id);
		const timeline = useTimeline(interaction.guild!.id)!;
		const permissions = voice(interaction);

		if (!queue) return interaction.reply({
			embeds: [{
				description: `${emojis.error} | I must be in the voice channel`,
				color: Colors.Orange
			}], ephemeral: true
		}); if (!queue.currentTrack)
			return interaction.reply({
				embeds: [{
					description: `${emojis.error} | There is no track playing`,
					color: Colors.Orange
				}],
				ephemeral: true
			});
		if (permissions.clientToMember) return interaction.reply({ content: permissions.clientToMember, ephemeral: true });

		timeline.paused ? timeline.resume() : timeline.pause();
		const state = timeline.paused;
		return interaction.reply({
			embeds: [{
				description: `${emojis.success} | Playback has been ${state ? "paused" : "resumed"}`,
				color: Colors.Blurple
			}]
		});
	}
}
