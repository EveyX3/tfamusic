import { Command } from "@sapphire/framework";
import { Colors } from "discord.js";

export class AvatarCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: `Display the avatar of a user`
        })
    }
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption((option) => option.setName('user').setDescription(`The user to retrieve Avatar from`))
        })
    }
    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user') || interaction.user
        return interaction.reply({
            embeds: [{
                author: {
                    icon_url: user.displayAvatarURL(),
                    name: user.username + " | Avatar"
                },
                image: {
                    url: user.displayAvatarURL({ size: 2048 })
                },
                color: Colors.Blurple
            }]
        })
    }
}