import { Command } from '@sapphire/framework';
import { useHistory, useQueue } from 'discord-player';
import { Colors } from 'discord.js';

export class PreviousCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'Plays the previous track'
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
		const history = useHistory(interaction.guild!.id);
		const permissions = voice(interaction);

		if (!queue) return interaction.reply({
			embeds: [{
				description: `${emojis.error} | I must be in the voice channel`,
				color: Colors.Orange
			}], ephemeral: true
		});
		if (permissions.clientToMember) return interaction.reply({ content: permissions.clientToMember, ephemeral: true });

		if (!history?.previousTrack)
			return interaction.reply({
				embeds: [{
					description: `${emojis.error} | No tracks in history`,
					color: Colors.Blurple
				}],
				ephemeral: true
			});

		await history.previous();
		return interaction.reply({
			embeds: [{
				description: `${emojis.success} | Replaying last track`,
				color: Colors.Blurple
			}]
		});
	}
}
