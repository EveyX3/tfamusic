"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "E621Command", {
    enumerable: true,
    get: ()=>E621Command
});
const _utils = require("../../lib/utils");
const _framework = require("@sapphire/framework");
const _discord = require("discord.js");
const _e621api = /*#__PURE__*/ _interop_require_default(require("e621-api"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const pkg = require('../../../package.json');
class E621Command extends _framework.Command {
    async registerApplicationCommands(registery) {
        registery.registerChatInputCommand((builder)=>{
            builder.setNSFW(true).setName(this.name).setDescription(this.description).addStringOption((option)=>option.setName(`query`).setDescription(`The query to search`).setRequired(true));
        });
    }
    async chatInputRun(interaction) {
        let wrapper = new _e621api.default(`MaidBoye/${pkg.version} (https://github.com/DonovanDMC/MaidBoye)`, "EveyXD", 'VfeqUJfc6gxpHaz1djyLTk1M');
        wrapper.posts.getIndexPaginate(interaction.options.getString('query'), 1, 35, 3).then((data)=>{
            let img = data[0][0].file_url;
            let score = data[0][0].score;
            let embed = new _discord.EmbedBuilder().setTitle(`Tags: ${interaction.options.getString('query')}`).setImage(img).setColor(`Random`);
            return interaction.reply({
                embeds: [
                    embed
                ]
            });
        }).catch((err)=>{
            console.log(err);
            return interaction.reply({
                embeds: [
                    {
                        description: `${_utils.emojis.error} | Sorry, there was an error running this`,
                        color: _discord.Colors.Orange
                    }
                ]
            });
        });
    }
    constructor(context, options){
        super(context, {
            ...options,
            description: `Search E621 for a query`
        });
    }
}
