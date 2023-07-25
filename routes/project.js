const express = require('express');
const router = express.Router();
const aagd = require('../middleware/authAndGetData');

const ProjectController = require('../controllers/project');

router.post("/create", aagd, ProjectController.project_create);

module.exports = router;