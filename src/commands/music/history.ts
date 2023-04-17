import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { useHistory, useQueue } from 'discord-player';
import { Colors } from 'discord.js';

export class HistoryCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'Displays the queue history in an embed'
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
		const { emojis } = this.container.client.utils;
		const queue = useQueue(interaction.guild!.id);
		const history = useHistory(interaction.guild!.id);

		if (!queue) return interaction.reply({
			embeds: [{
				description: `${emojis.error} | I must be in the voice channel`,
				color: Colors.Orange
			}], ephemeral: true
		});
		if (!history?.tracks)
			return interaction.reply({
				embeds: [{
					description: `${emojis.error} | There is no queue history to show`,
					color: Colors.Orange
				}],
				ephemeral: true
			});

		let pagesNum = Math.ceil(queue.tracks.size / 5);

		if (pagesNum <= 0) {
			pagesNum = 1;
		}

		const tracks = history.tracks.map((track, idx) => `**${++idx})** [${track.title}](${track.url})`);

		const paginatedMessage = new PaginatedMessage();

		if (pagesNum > 25) pagesNum = 25;

		for (let i = 0; i < pagesNum; i++) {
			const list = tracks.slice(i * 5, i * 5 + 5).join('\n');

			paginatedMessage.addPageEmbed((embed) =>
				embed
					.setColor('Blurple')
					.setDescription(
						`Queue in: ${queue?.channel} \n${list === '' ? '\n*• No more queued tracks*' : `\n${list}`
						}
						\n`
					)
					.setFooter({
						text: `${queue.tracks.size} track(s) in queue`
					})
			);
		}

		return paginatedMessage.run(interaction);
	}
}
