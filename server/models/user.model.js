const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = ({
    name: { type: String },
    surname: { type: String },
    email: { type: String }, 
    password: { type: String},
});

module.exports = mongoose.model('User', userSchema);