import { Command } from '@sapphire/framework';
import { useMasterPlayer, useQueue } from 'discord-player';
import { Colors, GuildMember } from 'discord.js';

export class DisconnectCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'Connects the bot to the voice channel while also creating a new queue'
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
		if (interaction.member instanceof GuildMember) {
			const { emojis, voice, options } = this.container.client.utils;
			const permissions = voice(interaction);

			if (permissions.member) return interaction.reply({ content: permissions.member, ephemeral: true });
			if (permissions.client) return interaction.reply({ content: permissions.client, ephemeral: true });
			const queue = useQueue(interaction.guild!.id);
			const player = useMasterPlayer();

			if (queue)
				return interaction.reply({
					embeds: [{
						description: `${emojis.error} | I'm currently in a voice channel`,
						color: Colors.Orange
					}],
					ephemeral: true
				});

			const newQueue = player?.queues.create(interaction.guild!.id, options(interaction));
			await newQueue?.connect(interaction.member.voice.channel!.id);
			return interaction.reply({
				embeds: [{
					description: `${emojis.success} | I have connected to ${interaction.member.voice.channel}`,
					color: Colors.Blurple
				}]
			});
		}
	}
}
