process.env.ACCESS_TOKEN_SECRET = '68543ffbb6881209c51c26d66471eac9181f3e0d9692079c7cb412fc61c97b2e';
require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.model.js');
const Board = require('./models/board.model.js');

const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const { authentificateToken } = require('./utilities.js');
const { gradients } = require('../src/helpers/gradients.js');

app.use(express.json());

app.use(
    cors({
        origin: '*',
    })
);

app.post('/create-account', async (req, res) => {

    const { name, surname, email, password } = req.body;
    const gradient = gradients[Math.floor(Math.random() * gradients.length)];

    if(!name) {
        return res
        .status(400)
        .json({ error: true, message: 'Name is required'});
    }

    if(!email) {
        return res
        .status(400)
        .json({ error: true, message: 'Email is required'});
    }

    if(!password) {
        return res
        .status(400)
        .json({ error: true, message: 'password is required'});
    }

    const isUser = await User.findOne({ email: email });

    if(isUser) {
        return res.json({
            error: true,
            message: 'User already exist',
        });
    }

    const user = new User({
        name,
        surname,
        email,
        password,
        gradient,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: 'User registered',
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    if(!password) {
        return res.status(400).json({ message: 'Password is required'});
    }

    const userInfo = await User.findOne({ email: email });

    if(!userInfo) {
        return res.status(400).json({ message: 'User not found'});
    }

    if(userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m"
        });

        return res.json({
            error: false,
            message: 'Login successful',
            email,
            accessToken
        })

    } else {
        return res.status(400).json({
            error: true,
            message: 'Invalid Credentials'
        })
    }
});

app.get('/get-user', authentificateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if(!isUser) {
        return res.sendStatus(400);
    }

    return res.json({
        user: isUser,
        message: ''
    });
});

app.delete('/delete-user', authentificateToken, async(req, res) => {
    const { user } = req.user;

    const userInfo = await User.findOne({ _id: user._id });

    if(!userInfo) {
        return res.status(400).json({ message: 'User not found' });
    }

    const friends = userInfo.friends;
    const friendsInfo = await User.find({ email: { $in: friends } });

    await Promise.all(friendsInfo.map(async (friend) => {
        friend.friends = friend.friends.filter(email => email !== userInfo.email);
        await friend.save();
    }));

    await User.findOneAndDelete({ _id: user._id });

    return res.json({
        error: false,
        message: 'User deleted successfully',
        friends: friendsInfo
    })
})

app.put('/edit-user', authentificateToken, async(req, res) => {
    const { user } = req.user;
    const { name, surname } = req.body;

    if(!name && !surname) {
        return res.status(400).json({error: true, message: 'No changed provided'})
    }

    try{
        const userInfo = await User.findOne({ _id: user._id });

        if(!userInfo) {
            return res.status(404).json({ error: true, message: 'User not found'});
        }

        if(name) userInfo.name = name;
        if(surname) userInfo.surname = surname;

        await userInfo.save();

        return res.json({ error: false, message: 'User info changed successfully', userInfo});
    } catch(error) {
        return res.status(500).json({error: true, message: 'Internal server error'});
    }
})

app.post('/add-friend', authentificateToken, async (req, res) => {
    const { email } = req.body;
    const { user } = req.user;

    if(!email) {
        return res.status(400).json({ message: 'Email is required' });
    };

    const friendInfo = await User.findOne({ email: email });
    const userInfo = await User.findOne({ _id: user._id });

    if(!friendInfo) {
        return res.status(400).json({ message: 'User not found' });
    }

    if(friendInfo.email == userInfo.email) {
        return res.status(400).json({ message: 'This is your email' });
    }

    if(userInfo.friends.includes(friendInfo.email)) {
        return res.status(400).json({ message: 'Already friends' });
    }

    userInfo.friends.push(friendInfo.email);
    friendInfo.friends.push(userInfo.email);

    await userInfo.save();
    await friendInfo.save();

    res.json({
        error: false,
        message: 'Friend added successful',
        friends: userInfo.friends
    });
});

app.get('/get-all-friends', authentificateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const userInfo = await User.findOne({ _id: user._id });

        if(!userInfo) {
            return res.status(400).json({ message: 'User not found' });
        }

        const friends = userInfo.friends;
        const friendsInfo = await User.find({ email: { $in: friends } });

        return res.json({
            error: false,
            message: 'Got friends successfully',
            friends: friendsInfo
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
});

app.delete('/delete-friend/:email', authentificateToken, async (req, res) => {
    const friend = req.params.email;
    const { user } = req.user;

    try {
        const userInfo = await User.findOne({ _id: user._id });
        const friendInfo = await User.findOne({ email: friend });

        if(!userInfo) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        if(!friendInfo) {
            return res.status(404).json({ error: true, message: 'Friend not found' });
        }

        if(!userInfo.friends.includes(friend));

        userInfo.friends = userInfo.friends.filter(email => email !== friend);
        friendInfo.friends = friendInfo.friends.filter(email => email !== userInfo.email);

        await userInfo.save();
        await friendInfo.save();

        res.json({
            error: false,
            message: 'Friend removed successfully',
            friends: userInfo.friends
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Internal server error',
        });
    }
})

app.post('/create-board', authentificateToken, async (req, res) => {
    const { user } = req.user;
    const { name } = req.body;

    if(!name) {
        return res.status(400).json({ error: true, message: 'Name is required'});
    }

    const userInfo = await User.findOne({ _id: user._id });

    const board = new Board({
        name,
        members: [{ email: userInfo.email, role: 'creator'}]
    })

    userInfo.boards.push({ board: board._id, role: 'creator'})

    await board.save();
    await userInfo.save();

    return res.json({
        error: false,
        board,
        message: 'Board created successfully'
    });
});

app.post('/join-board', authentificateToken, async (req, res) => {
    const { user } = req.user;
    const { boardId } = req.body;

    if(!boardId) {
        return res.status(400).json({ error: true, message: 'Id of board is required'});
    }

    const userInfo = await User.findOne({ _id: user._id });
    const boardInfo = await Board.findOne({ _id: boardId });

    if(!boardInfo) {
        return res.status(400).json({ error: true, message: "Board not found"});
    }

    const isUserAlreadyInBoard = userInfo.boards.some(board => board.board.toString() === boardId);

    if(isUserAlreadyInBoard) {
        return res.status(400).json({ error: true, message: 'You are already in this board' })
    }

    userInfo.boards.push({ board: boardInfo._id, role: 'member'});
    boardInfo.members.push({ email: userInfo.email, role: 'member' });

    await userInfo.save();
    await boardInfo.save();

    return res.json({
        error: false,
        userInfo,
        message: 'Joined board successfully'
    });
});

app.get('/get-all-boards', authentificateToken, async (req, res) => {
    const { user } = req.user;

    const userInfo = await User.findOne({ _id: user._id });

    const boardIds = userInfo.boards.map(board => board.board);
    const boardsInfo = await Board.find({ _id: { $in: boardIds } });
    
    if(!boardsInfo) {
        return res.status(400).json({ error: true, message: 'Internal server error' });
    }

    return res.json({ error: false, boards: boardsInfo, message: 'Got boards successfully'});
});

app.get('/get-all-members/:id', authentificateToken, async (req, res) => {
    const board = req.params.id;

    const boardInfo = await Board.findOne({ _id: board});

    const members = boardInfo.members.map(member => member.email);
    const membersInfo = await User.find({ email: { $in: members } });

    return res.json({
        error: false,
        membersInfo: membersInfo,
        messsage: 'Got all members successfully'
    })
})

app.put('/edit-board/:id', authentificateToken, async (req, res) => {
    const { name } = req.body;
    // if(isTeamBoard) {
        const board = req.params.id;
    
        if(!name) {
            return res.status(400).json({ error: true, message: 'No changes provided'});
        }
    
        const boardInfo = await Board.findOne({ _id: board });
    
        if(name) boardInfo.name = name;
    
        await boardInfo.save();
    
        return res.json({ error: false, boardInfo, message: 'Name changed successfully'});
    // } else {
    //     const { user } = req.user;
    //     if(!name) {
    //         return res.status(400).json({ error: true, message: 'No changes provided'});
    //     }

    //     const userInfo = await User.findOne({ _id: user._id });

    //     if(name) userInfo.personalBoardSchema.name = name;

    //     await userInfo.save();
    
    //     return res.json({ error: false, userInfo, message: 'Name changed successfully'});
    // }
})

app.delete('/delete-board/:id', authentificateToken, async (req, res) => {
    const board = req.params.id;

    const boardInfo = await Board.findOne({ _id: board });

    const members = boardInfo.members.map(member => member.email);
    const membersInfo = await User.find({ email: { $in: members} });

    await Promise.all(membersInfo.map(async (member) => {
        member.boards = member.boards.filter(board => board.board.toString() !== boardInfo._id.toString());
        await member.save();
    }));

    await Board.findOneAndDelete({ _id: board });
    
    return res.json({
        error: false,
        message: 'Board deleted successfully',
        membersInfo
    })
})

app.delete('/leave-board/:id', authentificateToken, async (req, res) => {
    const { user } = req.user;
    const board = req.params.id;

    const userInfo = await User.findOne({ _id: user._id});
    const boardInfo = await Board.findOne({ _id: board});
    userInfo.boards = userInfo.boards.filter(board => board.board.toString() !== boardInfo._id.toString());
    boardInfo.members = boardInfo.members.filter(member => member.email !== userInfo.email);

    await userInfo.save();
    await boardInfo.save();

    return res.json({
        error: false, 
        userInfo,
        boardInfo,
        message: 'Leaved board successfully'
    });
});

app.post('/add-block/:id', authentificateToken, async(req, res) => {
    const { name, isTeamBoard } = req.body;

    if(isTeamBoard) {
        const board = req.params.id;

        const boardInfo = await Board.findOne({ _id: board });
    
        if(!name) {
            return res.status(400).json({ error: true, message: 'Name is required'})
        }
    
        boardInfo.blocks.push({ name, tasks: [] });
        await boardInfo.save();
    
        return res.json({
            error: false,
            boardInfo,
            message: 'Block added successfully'
        });
    } else {
        const { user } = req.user;
        const userInfo = await User.findOne({ _id: user._id });
    
        if(!name) {
            return res.status(400).json({ error: true, message: 'Name is required'})
        }
    
        userInfo.personalBoardSchema.blocks.push({ name, tasks: [] });
        await userInfo.save();
    
        return res.json({
            error: false,
            userInfo,
            message: 'Block added successfully'
        });
    }
});

app.put('/edit-block/:id/:block_id', authentificateToken, async (req, res) => {
    const block = req.params['block_id'];
    const { name, isTeamBoard } = req.body;

    if(isTeamBoard) {
        const board = req.params.id

        if(!name) {
            return res.status(400).json({ error: false, message: 'No changed provided'});
        }
    
        const boardInfo = await Board.findOne({ _id: board });
        const blockInfo = boardInfo.blocks.find(el => el._id.toString() === block.toString());
    
        if(name) blockInfo.name = name;
    
        boardInfo.save();
    
        return res.json({
            error: false,
            boardInfo,
            message: 'Changed block name successufully'
        });
    } else {
        const { user } = req.user;

        if(!name) {
            return res.status(400).json({ error: false, message: 'No changed provided'});
        }
    
        const userInfo = await User.findOne({ _id: user._id });
        const blockInfo = userInfo.personalBoardSchema.blocks.find(el => el._id.toString() === block.toString());
    
        if(name) blockInfo.name = name;
    
        userInfo.save();
    
        return res.json({
            error: false,
            userInfo,
            message: 'Changed block name successufully'
        });
    }
});

app.delete('/delete-block/:id/:block_id', authentificateToken, async (req, res) => {
    const block = req.params['block_id'];
    // const { isTeamBoard } = req.body;
    const isTeamBoard = req.query.isTeamBoard === 'true';

    if(isTeamBoard) {
        const board = req.params.id
        const boardInfo = await Board.findOne({ _id: board });
        const blockInfo = boardInfo.blocks.find(el => el._id.toString() === block.toString());
    
        blockInfo.deleteOne();
    
        boardInfo.save();
    
        return res.json({
            error: false,
            boardInfo,
            message: 'Deleted block name successufully'
        });
    } else {
        const { user } = req.user
        const userInfo = await User.findOne({ _id: user._id });
        const blockInfo = userInfo.personalBoardSchema.blocks.find(el => el._id.toString() === block.toString());
    
        blockInfo.deleteOne();
    
        userInfo.save();
    
        return res.json({
            error: false,
            userInfo,
            message: 'Deleted block name successufully'
        });
    }
});

app.post('/add-task/:id/:block_id', authentificateToken, async(req, res) => {
    const { user } = req.user;
    const block = req.params['block_id'];
    const { title, isTeamBoard } = req.body;

    if(isTeamBoard) {
        const board = req.params.id;

        if(!title) {
            return res.status(400).json({ error: true, message: 'Name is required'});
        }
    
        const userInfo = await User.findOne({ _id: user._id});
        const boardInfo = await Board.findOne({ _id: board});
        const blockInfo = boardInfo.blocks.find(el => el._id.toString() === block.toString());
    
        blockInfo.tasks.push({ title, block: block, creator: userInfo.name, creatorGradient: userInfo.gradient });
        await boardInfo.save();
    
        return res.json({
            error: false,
            blockInfo,
            message: 'Added task successfully'
        });
    } else {
        if(!title) {
            return res.status(400).json({ error: true, message: 'Name is required'});
        }
    
        const userInfo = await User.findOne({ _id: user._id});
        const blockInfo = userInfo.personalBoardSchema.blocks.find(el => el._id.toString() === block.toString());
    
        blockInfo.tasks.push({ title, block: block });
        await userInfo.save();
    
        return res.json({
            error: false,
            userInfo,
            message: 'Added task successfully'
        });
    }
});

app.put('/edit-task/:id/:block_id/:task_id', authentificateToken, async(req, res) => {
    const blockParam = req.params.block_id;
    const task = req.params.task_id;
    const { title, description, date, block, completed, isTeamBoard } = req.body;

    if(isTeamBoard) {
        const board = req.params.id;
        if(!title && !description && !date && !block && !completed) {
            return res.status(400).json({ error: true, message: 'No changed provided' });
        }
    
        const boardInfo = await Board.findOne({ _id: board});
        const blockInfo = boardInfo.blocks.find(el => el._id.toString() === blockParam.toString());
        const taskInfo = blockInfo.tasks.find(el => el._id.toString() === task.toString());
    
        if(title) taskInfo.title = title;
        if(description) taskInfo.description = description;
        if(date) taskInfo.date = date;
        taskInfo.completed = completed
        if(block && block !== taskInfo.block) {
            taskInfo.block = block;
            const newBlock = boardInfo.blocks.find(el => el._id.toString() === block.toString());
            newBlock.tasks.push(taskInfo);
            blockInfo.tasks = blockInfo.tasks.filter(task => task._id.toString() !== taskInfo._id.toString());
        }
    
        await boardInfo.save();
    
        return res.json({
            error: false,
            taskInfo, 
            message: 'Task changed successfully'
        });
    } else {
        const { user } = req.user;
        if(!title && !description && !date && !block && !completed) {
            return res.status(400).json({ error: true, message: 'No changed provided' });
        }
    
        const userInfo = await User.findOne({ _id: user._id});
        const blockInfo = userInfo.personalBoardSchema.blocks.find(el => el._id.toString() === blockParam.toString());
        const taskInfo = blockInfo.tasks.find(el => el._id.toString() === task.toString());
    
        if(title) taskInfo.title = title;
        if(description) taskInfo.description = description;
        if(date) taskInfo.date = date;
        taskInfo.completed = completed
        if(block && block !== taskInfo.block) {
            taskInfo.block = block;
            const newBlock = userInfo.personalBoardSchema.blocks.find(el => el._id.toString() === block.toString());
            newBlock.tasks.push(taskInfo);
            blockInfo.tasks = blockInfo.tasks.filter(task => task._id.toString() !== taskInfo._id.toString());
        }
    
        await userInfo.save();
    
        return res.json({
            error: false,
            taskInfo, 
            message: 'Task changed successfully'
        });
    }
});

app.delete('/delete-task/:id/:block_id/:task_id', authentificateToken, async(req, res) => {
    const blockParam = req.params.block_id;
    const task = req.params.task_id;
    // const { isTeamBoard } = req.body;
    const isTeamBoard = req.query.isTeamBoard === 'true';

    if(isTeamBoard) {
        const board = req.params.id;
        const boardInfo = await Board.findOne({ _id: board});
        const blockInfo = boardInfo.blocks.find(el => el._id.toString() === blockParam.toString());
        const taskInfo = blockInfo.tasks.find(el => el._id.toString() === task.toString());
    
        taskInfo.deleteOne();
    
        boardInfo.save();
        blockInfo.save();
    
        return res.json({
            error: false,
            blockInfo,
            message: 'Task deleted successfully'
        });
    } else {
        const { user } = req.user;
        const userInfo = await User.findOne({ _id: user._id});
        const blockInfo = userInfo.personalBoardSchema.blocks.find(el => el._id.toString() === blockParam.toString());
        const taskInfo = blockInfo.tasks.find(el => el._id.toString() === task.toString());
    
        taskInfo.deleteOne();
    
        userInfo.save();
    
        return res.json({
            error: false,
            userInfo,
            message: 'Task deleted successfully'
        });
    }
});

app.listen(8000);

module.exports = app