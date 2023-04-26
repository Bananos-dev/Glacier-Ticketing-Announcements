const { Client, CommandInteraction, MessageEmbed, Message, } = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            try {
                command.execute(interaction, client);
            } catch(error) {
                console.error(error)
                const commandExecutionErrorEmbed = new MessageEmbed()
                .setTitle("Error")
                .setColor(config.error_color)
                .setDescription("There was an error while executing this command.")
                .setFooter("Coded by Bananos#1874.")

                client.guilds.cache.get(config.guild_id).channels.cache.get(config.error_log_channel_id).send({
                    embeds: {
                        commandExecutionErrorEmbed
                    }
                });
            }
        }
    }
}