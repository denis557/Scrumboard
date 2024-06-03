const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = ({
    name: { type: String, require: true },
    members: { type: [String], default: [] },
    blocks: { type: [String], default: ["TODO"] }
});