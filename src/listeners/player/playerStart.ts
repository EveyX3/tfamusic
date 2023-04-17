import { container, Listener } from '@sapphire/framework';
import type { GuildQueue, Track } from 'discord-player';
import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, Colors, ComponentBuilder, GuildTextBasedChannel, MessageComponentInteraction } from 'discord.js';

export class PlayerEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			emitter: container.client.player.events,
			event: 'playerStart'
		});
	}

	public run(queue: GuildQueue<{ channel: GuildTextBasedChannel }>, track: Track) {
		const { voice } = container.client.utils;
		const permissions = voice(queue.metadata.channel);
		if (permissions.events) return;
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('resume')
					.setEmoji(`▶️`)
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('pause')
					.setEmoji(`⏸️`)
					.setStyle(ButtonStyle.Primary)
			)
		const i = queue.metadata.channel
			.send({
				embeds: [{
					title: `💿 Now Playing`,
					description: `[${track.title} | ${track.author}](${track.url})`,
					fields: [
						{
							name: `Author`,
							value: `${track.author}`,
							inline: true
						},
						{
							name: `Duration`,
							value: `${track.duration}`,
							inline: true
						},
						{
							name: `Requested By`,
							value: `${track.requestedBy}`,
							inline: true
						}
					],
					thumbnail: {
						url: `${track.thumbnail}`
					},
					color: Colors.Blurple
				}],
			})
		const collector = queue.metadata.channel.createMessageComponentCollector({ time: track.durationMS, max: 1 });

		collector.on('collect', (i) => {
			i.deferUpdate()
			console.log(`${i} has been clicked`)
		})
		collector.on('end', (i) => {
			(m: { delete: () => void }) => m.delete();
		})

	}
}
