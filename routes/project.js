const express = require('express');
const router = express.Router();
const aagd = require('../middleware/authAndGetData');

const ProjectController = require('../controllers/project');

router.post("/create", aagd, ProjectController.project_create);

router.get("/get", aagd, ProjectController.project_get_all);

router.post("/get-specific", aagd, ProjectController.project_get_specific);

module.exports = router;