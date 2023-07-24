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
        first: {type: String, required: true},
        second: {type: String, required: true},
        third: {type: String, required: true},
        final: {type: String, required: true}
    },
    ownProject: {
        hasProject: {type: Boolean, required: true},
        project: {type: String, required: true},
    }
});

module.exports = mongoose.model('User', userSchema);