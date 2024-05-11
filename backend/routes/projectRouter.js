const express = require('express');
const prouter = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Project = require('../models/projectModel');

const {
    createProject,
    getProject,
    updateProject,
    deleteProject,
    searchProjects,
    getUserProjects
 
} = require('../controllers/projectController');


prouter.route('/create').post(protect, async (req, res) => {
    try {
        // Extract userId from request user object (assuming it's set by the protect middleware)
        const userId = req.user.id;

        // Extract required fields from the request body
        const { pName, Des, cName, architectName } = req.body; // Include architect's name from the request body

        // Check if required fields are present in the request body
        if (!pName || !Des || !cName || !architectName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Call createProject function from controller, passing userId and extracted fields
        const project = await createProject(pName, Des, cName, architectName, userId);

        // Send success response
        res.status(201).json({ project });
    } catch (error) {
        // Send error response
        res.status(500).json({ error: error.message });
    }
});



// Update project
prouter.route('/update/:projectId').put(protect, async (req, res) => {
    try {
        const { projectId } = req.params;
        const newData = req.body;
        const updatedProject = await updateProject(projectId, newData);
        res.status(200).json({ updatedProject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete project
prouter.route('/delete/:projectId').delete(protect, async (req, res) => {
    try {
        const { projectId } = req.params;
        const deletedProject = await deleteProject(projectId);
        res.status(200).json({ deletedProject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search projects
prouter.route('/search').get(protect, async (req, res) => {
    try {
        const { searchQuery } = req.query;
        const projects = await searchProjects(searchQuery);
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// View specific project
prouter.route('/view/:projectId').get(protect, async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await getProject(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



prouter.route('/user/:userId').get(protect, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const userProjects = await getUserProjects(userId); // Use getUserProjects function
        res.status(200).json({ userProjects });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

prouter.route('/architect/:architectName').get(async (req, res) => {
    try {
        const architectName = req.params.architectName;

        // Query the database to find projects associated with the provided architect's name
        const projects = await Project.find({ architectName });

        // Send success response with the projects found
        res.status(200).json({ projects });
    } catch (error) {
        // Send error response if an error occurs
        res.status(500).json({ error: error.message });
    }
});





module.exports = prouter;
