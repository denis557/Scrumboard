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

app.get('/', (req, res) => {
    res.json({ data: 'hello'});
});

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

app.listen(8000);

module.exports = app;