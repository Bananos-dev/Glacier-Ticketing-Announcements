const { Client, Collection, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = new Client({
	intents: [131071],
});

const config = require("./config.json");

client.commands = new Collection();
require("./Handlers/events")(client);
require("./Handlers/commands")(client);

client.on("messageCreate", async(message) => {
	if(message.content === ">setupticket" && !message.author.bot && message.member.roles.cache.get(config.manager_role_id)) {
		try {
			message.delete();
		} catch(error) {
			console.log(error)
		}
		const interfaceEmbed = new MessageEmbed()
		.setTitle("Glacier Support")
		.setColor(config.neutral_color)
		.setDescription("We're here to help.")

		const interfaceOptions = new MessageActionRow().addComponents(
			new MessageButton()
			.setCustomId("support-open_ticket")
			.setLabel("Open ticket")
			.setEmoji("🎫")
			.setStyle("PRIMARY")
		)

		message.channel.send({embeds: [interfaceEmbed], components: [interfaceOptions]});
	}
})

client.login(config.token);
