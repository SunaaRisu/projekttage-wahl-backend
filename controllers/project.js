const mongoose = require('mongoose');

const Project = require('../models/project');

exports.project_create = (req, res, next) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        aprooved: false,
        projectDetails: {
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            projectManagment: req.body.projectManagment,
            cost: req.body.cost,
            room: req.body.room,
            media: {
                mainImage: req.body.mainImage,
                banner: req.body.banner,
                video: req.body.video,
                images: req.body.images
            }
        },
        creator: 'req.userData._id'
    });

    project
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Project created'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Internal server error'
            });
        });
}