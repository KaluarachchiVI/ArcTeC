const mongoose = require("mongoose");

const { Schema } = mongoose;

const Pj = new Schema({
    pName: { type: String, required: true }, // project name
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // foreign key referencing User
    pid: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskWorkflow' }, // foreign key referencing TaskWorkflow database
    Des: { type: String, required: true }, // description
    cName: { type: String, required: true} ,// referencing displayName from User schema
    architectName: { type: String, required: true } // name of the architect associated with the project
}, {
    timestamps: true
});

const Project = mongoose.model("Project", Pj);

module.exports = Project;
