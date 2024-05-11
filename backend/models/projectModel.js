const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskSchema = new Schema({
    task: {
        type: String,
        required: 'Enter task details'
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

const ProjectSchema = new Schema({
    projectName: {
        type: String,
        required: true,
        unique: true
    },
    projectArchitect: {
        type: String,
        required: true
    },
    projectClient: {
        type: String,
        required: true
    },
    projectDueDate: {
        type: Date,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    Tasks: {
        type: [TaskSchema],
        default: []
    }
});


// Exporting using module.exports in CommonJS syntax
module.exports = { TaskSchema, ProjectSchema };