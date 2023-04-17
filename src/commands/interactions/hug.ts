import { emojis } from "#lib/utils";
import { Command } from "@sapphire/framework";
import { Colors } from "discord.js";

export class HugCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: `Hug a friend of yours!`
        })
    }
    public override async registerApplicationCommands(registery: Command.Registry) {
        registery.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption(option => option.setName(`user`).setDescription(`The user to hug`).setRequired(true))
        })
    }
    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        return interaction.reply({
            embeds: [{
                description: `${emojis.sparkspin} | Currently being worked on`,
                color: Colors.Red
            }]
        })
    }
}