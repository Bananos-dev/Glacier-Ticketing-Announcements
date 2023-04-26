const mongoose = require("mongoose");

module.exports = mongoose.model("Tickets", new mongoose.Schema({
        MemberID: Number,
        TicketID: Number,
        ChannelID: Number,
        Closed: Boolean,
        Interaction: Object,
    })
);