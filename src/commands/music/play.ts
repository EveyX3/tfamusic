import { Command } from '@sapphire/framework';
import { useMasterPlayer, useQueue } from 'discord-player';
import { Colors, GuildMember } from 'discord.js';

export class PlayCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			description: 'Plays and enqueues track(s) of the query provided'
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) => {
					return option.setName('query').setDescription('A query of your choice').setRequired(true).setAutocomplete(true);
				});
		});
	}

	public override async autocompleteRun(interaction: Command.AutocompleteInteraction) {
		const player = useMasterPlayer()!;
		const query = interaction.options.getString('query');
		const results = await player.search(query!);

		let tracks;
		tracks = results.tracks
			.map((t) => ({
				name: t.title,
				value: t.url
			}))
			.slice(0, 5);

		if (results.playlist) {
			tracks = results.tracks
				.map(() => ({
					name: `${results.playlist!.title} [playlist]`,
					value: results.playlist!.url
				}))
				.slice(0, 1);
		}

		return interaction.respond(tracks);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { emojis, voice, options } = this.container.client.utils;
		const player = useMasterPlayer()!;
		const permissions = voice(interaction);
		const query = interaction.options.getString('query')!;
		const member = interaction.member as GuildMember;

		if (permissions.member) return interaction.reply({ content: permissions.member, ephemeral: true });
		if (permissions.client) return interaction.reply({ content: permissions.client, ephemeral: true });
		if (permissions.clientToMember) return interaction.reply({ content: permissions.clientToMember, ephemeral: true });

		const results = await player.search(query, { requestedBy: interaction.user });
		if (!results.hasTracks())
			return interaction.reply({
				embeds: [{
					description: `I could not find a track matching **${query}**`,
					color: Colors.Orange
				}],
				ephemeral: true
			});

		await interaction.deferReply();
		let queue = useQueue(interaction.guild!.id)
		try {
			const res = await player.play(member.voice.channel!.id, results, { nodeOptions: options(interaction) });
			interaction.options
			return interaction.editReply({
				embeds: [{
					title: `Added To Queue`,
					description: `
					Added ${res.track.playlist ? `**track(s) from: [**${res.track.playlist.title}**](${res.track.playlist.url})` : `[**${res.track.title}**](${res.track.url})`} to the queue
					`,
					fields: [
						{
							name: `Author`,
							value: `${res.track.playlist ? `${res.track.playlist.author}` : `${res.track.author}`} `,
							inline: true
						},
						{
							name: `Duration`,
							value: `${res.track.playlist ? `${res.track.playlist.durationFormatted}` : `${res.track.duration}`} `,
							inline: true
						},
						{
							name: `Requested By`,
							value: `${res.track.requestedBy} `,
							inline: true
						}
					],
					thumbnail: {
						url: `${res.track.playlist ? res.track.playlist.thumbnail : res.track.thumbnail} `
					},
					color: Colors.Blurple
				}]
			})
		} catch (error: any) {
			await interaction.editReply({ content: `An ** error ** has occurred` });
			return console.log(error);
		}
	}
}
