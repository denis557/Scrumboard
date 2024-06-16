const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = ({
    title: { type: String, require: true },
    description: { type: String },
    date: { type: Date, default: new Date().toJSON() },
    // block: { type: String, default: "TODO" },
    block: { type: String },
    completed: { type: Boolean, default: false },
    creator: { type: [String] },
    creatorGradient: { type: [String] }
});

const blockSchema = ({
    name: { type: String, require: true },
    tasks: { type: [taskSchema], default: [] }
})

const boardSchema = ({
    name: { type: String, require: true },
    members: { type: [Object] },
    blocks: { type: [blockSchema], default:
        [
            { name: "TODO", tasks: [] },
            { name: "IN PROGRESS", tasks: [] },
            { name: "DONE", tasks: [] }
        ]
    }
});

module.exports = mongoose.model('Board', boardSchema);