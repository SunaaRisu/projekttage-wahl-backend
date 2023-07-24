const { text } = require('body-parser');
const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    aprooved: { type: Boolean, required: true},
    projectDetails: {
        name: {type: String, required: true},
        category: {type: String, required: true},
        description: {type: String, required: true},
        projectManagment: {type: Array, required: true},
        cost: {type: Array, required: true},
        room: {type: Number, required: true},
        media: {
            mainImage: {type: String, required: true},
            banner: {type: String, required: true},
            video: {type: String, required: true},
            images: {type: Array, required: true}
        }
    },
    creator: {type: String, required: true},
});

module.exports = mongoose.model('Project', projectSchema);