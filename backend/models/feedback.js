const mongoose = require('mongoose');

const feedbackschema = new mongoose.Schema({
    clientID: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    clientEmail: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    context: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },

});

module.exports = Feedback = mongoose.model("feedback", feedbackschema);