import { container, Listener } from '@sapphire/framework';
import type { GuildQueue } from 'discord-player';
import { Colors, GuildTextBasedChannel } from 'discord.js';

export class PlayerEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			emitter: container.client.player.events,
			event: 'emptyChannel'
		});
	}

	public run(queue: GuildQueue<{ channel: GuildTextBasedChannel }>) {
		const { voice, options } = container.client.utils;
		const timeout = options
		const permissions = voice(queue.metadata.channel);
		if (permissions.events) return;

		return queue.metadata.channel
			.send({
				embeds: [{
					description: `I left ${queue.channel} due to inactivty for 5 minutes`,
					color: Colors.Orange
				}]
			})
	}
}
