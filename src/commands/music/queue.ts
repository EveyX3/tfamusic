import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { useQueue } from 'discord-player';
import { Colors } from 'discord.js';

export class QueueCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'Displays the queue in an embed'
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
		const { emojis } = this.container.client.utils;
		const queue = useQueue(interaction.guild!.id);

		if (!queue) return interaction.reply({
			embeds: [{
				description: `${emojis.error} | I must be in the voice channel`,
				color: Colors.Orange
			}], ephemeral: true
		});
		if (!queue.tracks || !queue.currentTrack)
			return interaction.reply({
				embeds: [{
					description: `${emojis.error} | There is no queue to show`,
					color: Colors.Orange
				}],
				ephemeral: true
			});

		let pagesNum = Math.ceil(queue.tracks.size / 5);
		if (pagesNum <= 0) pagesNum = 1;

		const tracks = queue.tracks.map((track, idx) => `**${++idx})** [${track.title}](${track.url})`);
		const paginatedMessage = new PaginatedMessage();

		if (pagesNum > 25) pagesNum = 25;
		for (let i = 0; i < pagesNum; i++) {
			const list = tracks.slice(i * 5, i * 5 + 5).join('\n');

			paginatedMessage.addPageEmbed((embed) =>
				embed
					.setColor('Blurple')
					.setDescription(
						`Queue in: **${queue?.channel}**\n${list === '' ? '\n*• No more queued tracks*' : `\n${list}`}
						\n${emojis.sparkspin} **Now Playing:** [${queue.currentTrack?.title}](${queue.currentTrack?.url})\n`
					)
					.setFooter({
						text: `${queue.tracks.size} track(s) in queue`
					})
			);
		}

		return paginatedMessage.run(interaction);
	}
}
