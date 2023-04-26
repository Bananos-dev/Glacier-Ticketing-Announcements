const { Constants, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");

module.exports = {
	name: "announce",
	description: "Announce something to the world!",
	options: [
		{
			name: "Channel",
			description: "Channel for your announcement.",
			type: Constants.ApplicationCommandOptionTypes.CHANNEL,
			required: true,
		},
		{
			name: "Title",
			description: "Title of your announcement.",
			type: Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
		},
        {
            name: "Content",
            description: "The meat of your announcement and its main contents.",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true
        },
        {
            name: "Colour",
            description: "What coulour would you like your embed to be? (Hex/verbal)",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true
        }
	],
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
        if(!interaction.member.roles.cache.has(config.owner_role_id) && !interaction.member.roles.cache.has(config.manager_role_id)) return interaction.reply({content: "Sorry, you don't have permission to run this command.", ephemeral: true})
        const announcementEmbed = new MessageEmbed()
        .setTitle(`${interaction.options.getString("Title", true)}`)
        .setDescription(`${interaction.options.getString("Content", true)}`)
        .setColor(`${interaction.options.getString("Colour", true)}`)

        interaction.guild.channels.cache.get(interaction.options.getChannel("Channel", true)).send({embeds: [announcementEmbed]})
    }   
};
