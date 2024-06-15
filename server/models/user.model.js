const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = ({
    title: { type: String, require: true },
    description: { type: String },
    date: { type: Date, default: new Date().toJSON() },
    block: { type: String, default: "TODO" },
    completed: { type: Boolean, default: false },
});

const blockSchema = ({
    name: { type: String, require: true },
    tasks: { type: [taskSchema], default: [] }
});

const personalBoardSchema = ({
    name: { type: String, default: "My board"},
    blocks: { type: [blockSchema], default:
        [
            { name: "TODO", tasks: [] },
            { name: "IN PROGRESS", tasks: [] },
            { name: "DONE", tasks: [] }
        ]
    }
});

const userSchema = ({
    name: { type: String },
    surname: { type: String },
    email: { type: String }, 
    password: { type: String },
    friends: { type: [String], default: [] },
    boards: { type: [Object], default: [] },
    personalBoardSchema,
    gradient: { type: [String], default: [] }
});

module.exports = mongoose.model('User', userSchema);