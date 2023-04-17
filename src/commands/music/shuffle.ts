import { Command } from '@sapphire/framework';
import { useQueue } from 'discord-player';
import { Colors } from 'discord.js';

export class ShuffleCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'Shuffles the tracks in the queue'
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
		const permissions = voice(interaction);

		if (!queue) return interaction.reply({
			embeds: [{
				description: `${emojis.error} | I must be in the voice channel`,
				color: Colors.Orange
			}], ephemeral: true
		});
		if (permissions.clientToMember) return interaction.reply({ content: permissions.clientToMember, ephemeral: true });

		if (queue.tracks.size < 2)
			return interaction.reply({
				embeds: [{
					description: `${emojis.error} | Not enough tracks to shuffle`,
					color: Colors.Orange
				}],
				ephemeral: true
			});

		queue.tracks.shuffle();
		return interaction.reply({
			embeds: [{
				description: `${emojis.success} | Now shuffling the queue`,
				color: Colors.Orange
			}]
		});
	}
}
