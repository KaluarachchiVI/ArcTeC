const express = require('express');
const router = express.Router();

const {
    addNewProject,
    getProjects,
    getProjectWithID,
    updateProjec,
    deleteProjec,
    addNewTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
} = require('../controllers/projectController');

router.route('/Project')
    .get(getProjects)
    .post(addNewProject);

router.route('/Project/:ProjectId')
    .get(getProjectWithID)
    .put(updateProjec)
    .delete(deleteProjec);

router.route('/Project/:ProjectId/Tasks')
    .get(getTasks)
    .post(addNewTask);

router.route('/Project/:ProjectId/Tasks/:TaskId')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;