const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//model
const TweetModel = require('../models/tweet');

require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET;
mongoose.connect(process.env.DB_PATH);

router.get('/feed', (req, res) => {
    TweetModel.find({})
    .populate('author', 'username')
    .then((result) => {
        res.status(200).json(result);
    }).catch(err => res.status(400).json(err));

    
});

router.post('/create', (req, res) => {
    const { message } = req.body;
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, (err, info) => {
        if (err) throw err;
        
        const tweetDoc = TweetModel.create({
            message,
            author: info.id,
        });

        res.json(tweetDoc);

    })

    // const tweetDoc = TweetModel.create({
    //     message,
    //     // author: info._id,
    //     author
    // });

    // res.json(tweetDoc);
})

module.exports = router