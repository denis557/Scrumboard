process.env.ACCESS_TOKEN_SECRET = '68543ffbb6881209c51c26d66471eac9181f3e0d9692079c7cb412fc61c97b2e';
require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.model.js');

const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const { authentificateToken } = require('./utilities.js');

app.use(express.json());

app.use(
    cors({
        origin: '*',
    })
);

// app.get('/', (req, res) => {
//     res.json({ data: 'hello'});
// });

app.post('/create-account', async (req, res) => {

    const { name, surname, email, password } = req.body;

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

    const isUser = await User.findOne({ email: email});

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
    const { email, password} = req.body;

    if(!email) {
        return res.status(400).json({ message: 'Email is requiired' });
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
})

app.

app.listen(8000);

module.exports = app;