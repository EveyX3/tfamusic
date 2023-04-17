"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AvatarCommand", {
    enumerable: true,
    get: ()=>AvatarCommand
});
const _framework = require("@sapphire/framework");
const _discord = require("discord.js");
class AvatarCommand extends _framework.Command {
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder)=>{
            builder.setName(this.name).setDescription(this.description).addUserOption((option)=>option.setName('user').setDescription(`The user to retrieve Avatar from`));
        });
    }
    async chatInputRun(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        return interaction.reply({
            embeds: [
                {
                    author: {
                        icon_url: user.displayAvatarURL(),
                        name: user.username + " | Avatar"
                    },
                    image: {
                        url: user.displayAvatarURL({
                            size: 2048
                        })
                    },
                    color: _discord.Colors.Blurple
                }
            ]
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: `Display the avatar of a user`
        });
    }
}
