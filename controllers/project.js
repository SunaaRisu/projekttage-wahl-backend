const mongoose = require('mongoose');

const Project = require('../models/project');

exports.project_create = (req, res, next) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        aprooved: true,
        projectDetails: {
            name: req.body.name,
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
};

exports.project_get_all = (req, res, next) => {
    
    Project.find({aprooved: true})
        .exec()
        .then(result => {
            if (result < 1) {
                return res.status(404).json({
                    message: 'no projects found'
                });
            };

            return res.status(200).json({
                results: result.length,
                objects: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Internal server error'
            });
        });
};

exports.project_get_specific = (req, res, next) => {
    Project.find({_id: req.body._id})
        .exec()
        .then(result => {
            if (result < 1) {
                return res.status(404).json({
                    error: 'project not found'
                });
            };

            return res.status(200).json({
                object: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Internal server error'
            });
        });
};