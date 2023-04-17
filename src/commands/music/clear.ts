import { Command } from '@sapphire/framework';
import { useQueue } from 'discord-player';
import { Colors } from 'discord.js';

export class ClearCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'Clears the current queue and removes all enqueued tracks'
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addBooleanOption((option) => option.setName('history').setDescription('Clear the queue history'));
		});
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { emojis, voice } = this.container.client.utils;
		const queue = useQueue(interaction.guild!.id);
		const permissions = voice(interaction);
		const history = interaction.options.getBoolean('history');

		if (!queue) return interaction.reply({
			embeds: [{
				description: `${emojis.error} | I must be in the voice channel`,
				color: Colors.Orange
			}], ephemeral: true
		});
		if (!queue.tracks) return interaction.reply({ embeds: [{ description: `${emojis.error} | There is no tracks to remove`, color: Colors.Orange }], ephemeral: true });
		if (permissions.clientToMember) return interaction.reply({ content: permissions.clientToMember, ephemeral: true });

		queue.tracks.clear();
		if (history) queue.history.clear();
		return interaction.reply({
			embeds: [{
				description: `${emojis.success} | The queue has been cleared of ${queue.tracks.map(q => q).length} track(s)`,
				color: Colors.Blurple
			}]
		});
	}
}
