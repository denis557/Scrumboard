const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = ({
    title: { type: String, require: true },
    description: { type: String },
    date: { type: Date, default: new Date().toJSON() },
    block: { type: String, default: "TODO" },
    completed: { type: Boolean, default: false },
    creator: { type: String },
    creatorGradient: { type: [String] }
});

module.exports = mongoose.model('Task', taskSchema)