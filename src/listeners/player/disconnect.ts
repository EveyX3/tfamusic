import { emojis } from '#lib/utils';
import { container, Listener } from '@sapphire/framework';
import type { GuildQueue } from 'discord-player';
import { Colors, GuildTextBasedChannel } from 'discord.js';

export class PlayerEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			emitter: container.client.player.events,
			event: 'disconnect'
		});
	}

	public run(queue: GuildQueue<{ channel: GuildTextBasedChannel }>) {
		const { voice } = container.client.utils;
		const permissions = voice(queue.metadata.channel);
		if (permissions.events) return;

		return queue.metadata.channel
			.send({
				embeds: [{
					description: `${emojis.success} | I was manually disconnected from ${queue.channel}`,
					color: Colors.Blurple
				}]
			})
			.then((m: { delete: () => void }) => setTimeout(() => m.delete(), 15000));
	}
}
