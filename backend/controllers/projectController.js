const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const asyncHandler = require('express-async-handler');
const { ProjectSchema, TaskSchema, Pj } = require('../models/projectModel');
const pros = require('../models/NpM');
const Project = mongoose.model('Project', ProjectSchema, Pj);
const Task = mongoose.model('Task', TaskSchema);

//Senudi 
// Project Routes

const addNewProject = (req, res) => { //creating project
    let newProject = new Project(req.body);

    newProject.save()
        .then(Project => {
            res.json(Project);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

const getProjects = (req, res) => { //getting all projects
    Project.find({})
        .then(Project => {
            res.json(Project);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}

const getProjectWithID = (req, res) => {  //getting created project using the project ID
    Project.findById(req.params.ProjectId)
        .then(Project => {
            res.json(Project);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}

const updateProjec = (req, res) => { //updating project using the project ID and ...
    Project.findOneAndUpdate({ _id: req.params.ProjectId }, req.body, {new : true})
        .then(Project => {
            res.json(Project);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}

const deleteProjec = (req, res) => { //deleting project       , "i have to implement a confirmation project"
    Project.deleteOne({ _id: req.params.ProjectId })
        .then(Project => {
            res.json({ message: 'Project deleted' });
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
}


// Task routes

const addNewTask = (req, res) => {
    console.log(req.params.ProjectId);
    Project.findById(req.params.ProjectId)
        .then(Project => {
            if (!Project) {
                res.status(404).send({ message: 'No project found with the provided ID.' });
                return;
            }
            const newTask = new Task(req.body);
            Project.Tasks.push(newTask);
            return Project.save();
        })
        .then(Project => {
            res.json(Project);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

const getTasks = (req, res) => {
    const { ProjectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(ProjectId)) {
        return res.status(400).send({ message: 'Invalid ProjectId.' });
    }

    Project.findById(ProjectId)
        .then(Project => {
            if (!Project) {
                res.status(404).send({ message: 'No project found with the provided ID.' });
                return;
            }
            res.json(Project.Tasks);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: error.message });
        });
};

const getTask = (req, res) => {
    Project.findById(req.params.ProjectId)
        .then(Project => {
            if (!Project) {
                res.status(404).send({ message: 'No project found with the provided ID.' });
                return;
            }
            res.json(Project.Tasks.id(req.params.TaskId));
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

const updateTask = (req, res) => {
    Project.findById(req.params.ProjectId)
        .then(Project => {
            if (!Project) {
                res.status(404).send({ message: 'No project found with the provided ID.' });
                return;
            }
            let Task = Project.Tasks.id(req.params.TaskId);
            Task.set(req.body);
            return Project.save();
        })
        .then(Project => {
            res.json(Project);
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

const deleteTask = (req, res) => {
    Project.findById(req.params.ProjectId)
        .then(Project => {
            if (!Project) {
                res.status(404).send({ message: 'No project found with the provided ID.' });
                return;
            }
            const task = Project.Tasks.id(req.params.TaskId);
            if (!task) {
                res.status(404).send({ message: 'No task found with the provided ID.' });
                return;
            }
            Project.Tasks.pull(task);
            return Project.save();
        })
        .then(Project => {
            res.json({ message: 'Task deleted' });
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

//module.exports = {
//    addNewProject,
//    getProjects,
//    getProjectWithID,
//    updateTask,
//    deleteTask,
//    addNewTask,
//    getTasks,
//    getTask,
//};





// vihandu
const createProject = async (pName, Des, cName, architectName, userId) => {
    try {
        if (!userId || !pName || !Des || !cName || !architectName) {
            throw new Error("Invalid project data provided");
        }
        // Create project data object
        const Data = {
            pName: pName,
            Des: Des,
            cName: cName,
            architectName: architectName, // Include architect's name in the project data
            userId: userId // Set user ID extracted from the parameter
        };
        // Create the project
        const project = new pros(Data);
        await project.save();
        return project;
    } catch (error) {
        throw new Error("Could not create project: " + error.message);
    }
};



const getProject = async (projectId) => {
    try {
        // You can directly query the Project database using the projectId
        const project = await pros.findById(projectId);
        return project;
    } catch (error) {
        throw new Error("Could not fetch project: " + error.message);
    }
};

const updateProject = async (projectId, newData) => {
    try {
        // Update the project
        const updatedProject = await pros.findByIdAndUpdate(projectId, newData, { new: true });
        return updatedProject;
    } catch (error) {
        throw new Error("Could not update project: " + error.message);
    }
};

const deleteProject = async (projectId) => {
    try {
        // Delete the project
        const deletedProject = await pros.findByIdAndDelete(projectId);
        return deletedProject;
    } catch (error) {
        throw new Error("Could not delete project: " + error.message);
    }
};

const searchProjects = async (searchQuery) => {
    try {
        // Perform a search query based on the searchQuery
        const projects = await pros.find({ pName: { $regex: searchQuery, $options: "i" } });
        return projects;
    } catch (error) {
        throw new Error("Could not search projects: " + error.message);
    }
};

const getUserProjects = async (userId) => {
    try {
        // Retrieve all projects associated with the specified userId
        const projects = await pros.find({ userId });
        return projects;
    } catch (error) {
        throw new Error("Could not fetch user projects: " + error.message);
    }
};

const getProjectsByArchitect = async (req, res) => {
    try {
        const architectName = req.params.architectName;

        // Query the database to find projects associated with the provided architect's name
        const projects = await pros.find({ architectName });

        // Send success response with the projects found
        res.status(200).json({ projects });
    } catch (error) {
        // Send error response if an error occurs
        res.status(500).json({ error: error.message });
    }
};









module.exports = { 
    //Senudi 
    addNewProject,
    updateProjec,
    deleteProjec,
    getProjects,
    getProjectWithID,
    updateTask,
    deleteTask,
    addNewTask,
    getTasks,
    getTask,




// vihandu
    createProject, 
    getProject, 
    updateProject, 
    deleteProject, 
    searchProjects, 
    getUserProjects, 
    getProjectsByArchitect
};