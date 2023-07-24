const express = require('express');
const router = express.Router();

const ProjectController = require('../controllers/project');

router.post("/create", ProjectController.project_create);

module.exports = router;