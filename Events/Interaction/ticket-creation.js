const { Client, CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const config = require("../../config.json");
const ticketschema = require("../../Schemas/ticketing");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(!interaction.isButton()) return;

        const MemberID = interaction.member.id;
        const TicketID = Date.now()
        var closeConfirmationMessage;
        var closeButtonInteraction;

        if(interaction.customId === "support-open_ticket") {

            const greetingEmbed = new MessageEmbed()
            .setColor(config.neutral_color)
            .setTitle("Glacier Support")
            .setDescription(`<@${interaction.member.id}>, thanks for reaching out! We'll get to you shortly. In the meantime, please describe your issue.`)

            var closeButton = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId(`ticketclose-${TicketID}`)
                .setLabel("Close ticket")
                .setEmoji("🔒")
                .setStyle("DANGER")
                .setDisabled(false)
            )
            
            await interaction.guild.channels.create(`Ticket ${TicketID}`, {
                type: "GUILD_TEXT",
                permissionOverwrites: [
                    {
                        id: MemberID,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                    },
                    {
                        id: config.everyoneID,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: config.owner_role_id,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"]
                    },
                    {
                        id: config.manager_role_id,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"]
                    },
                    {
                        id: config.admin_role_id,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"]
                    },
                    {
                        id: config.mod_role_id,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "MANAGE_MESSAGES"]
                    }
                ]
            }).then(async(channel) => {
                await ticketschema.create({
                    MemberID: MemberID,
                    TicketID: TicketID,
                    ChannelID: channel.id,
                    Closed: false

                })

                await interaction.guild.channels.cache.get(channel.id).send({embeds: [greetingEmbed], components: [closeButton]})

            })

            interaction.reply({content: `Thanks for reaching out! We've created a support ticket for you.`, ephemeral: true});
        }

        if(interaction.customId.startsWith("ticketclose-")) {

            try {
                interaction.channel.delete();
                await ticketschema.updateOne({TicketID: interaction.customId.substring(13)}, {Closed: true})
            } catch(error) {
                console.log(error)
            }

            closeButtonInteraction = interaction;

            await interaction.update({components: [lockCloseButton]}).then(() => {
                closeConfirmationMessage = interaction.followUp({content: "Are you sure you want to close this ticket?", components: [closeConfirm]});
            })
        }
    }
}
