import { Command } from '@sapphire/framework';
import { useQueue } from 'discord-player';
import { Colors } from 'discord.js';

export class SkipCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'Skips the current track and automatically plays the next'
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName(this.name)
				.setDescription(this.description);
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { emojis, voice } = this.container.client.utils;
		const queue = useQueue(interaction.guild!.id);
		const permissions = voice(interaction);

		if (!queue) return interaction.reply({
			embeds: [{
				description: `${emojis.error} | I must be in the voice channel`,
				color: Colors.Orange
			}], ephemeral: true
		});
		if (!queue.currentTrack)
			return interaction.reply({
				content: `${emojis.error} | There is no track **currently** playing`,
				ephemeral: true
			});

		if (permissions.clientToMember) return interaction.reply({ content: permissions.clientToMember, ephemeral: true });

		queue.node.skip();
		return interaction.reply({
			embeds: [{
				description: `⏩ | Skipped to next track!`,
				color: Colors.Blurple
			}]
		});
	}
}
