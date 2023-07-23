const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    shortID: { type: String, required: true},
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    role: { type: String, required: true},
    class: { type: Number, required: true},
    project: {
        favs: {type: Array, required: true},
        first: {type: ObjectId, required: true},
        second: {type: ObjectId, required: true},
        third: {type: ObjectId, required: true},
        final: {type: ObjectId, required: true}
    },
    ownProject: {
        hasProject: {type: Boolean, required: true},
        project: {type: ObjectId, required: true},
    }
});

module.exports = mongoose.model('User', userSchema);