const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// model
const UserModel = require('../models/user');
const TweetModel = require('../models/tweet');

require('dotenv').config()
const salt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

mongoose.connect(process.env.DB_PATH);

router.get('/', (req, res) => {
    res.json({
        message: 'hello world'
    })
})

// router.get('/profile', (req, res) => {
//     const { token } = req.cookies;
//     const { id } = req.body;
    
    
//     jwt.verify(token, jwtSecret, {}, (err, info) => {
//         if(err) throw err;
//         // res.json(info);
        
//         UserModel.findOne({_id:info.id})
//         .select(['username', 'email'])
//         .then(result => {
//             res.status(200).json(result);
//         })


//     });

    
// })


router.get('/profile', (req, res) => {
    const { token } = req.cookies;
    
    
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, info) => {
            if(err) throw err;
            res.json(info);
        });
    } else {
        res.json(null);
    }

    
})

router.get('/profile/:username', (req, res) => {
    const { token } = req.cookies;
    const { username } = req.params;
    
    
     
    UserModel.findOne({username})
    .then((result) => {
        
        
        TweetModel.find({author:result._id})
        .populate('author', 'username')
        .then((result) => {
            res.json(result);
            
        })
        
        
    }).catch(err => console.log(err))
            
       
    

    
})

router.get('/account', (req, res) => {
    const { token } = req.cookies;
    const { id } = req.body;
    
    // jwt.verify(token, jwtSecret, {}, (err, info) => {
    //     if(err) throw err;
    //     res.json(info);


    // });
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, info) => {
            if(err) throw err;
            res.json(info);
        });
    } else {
        res.json(null);
    }

    
})



router.post('/register', (req, res) => {
    const {username, email, password} = req.body;
    
    UserModel.create({
        username,
        email,
        password: bcrypt.hashSync(password, salt)
    }).then(result =>{
        res.status(200).json({
            message: "successful create a new user."
        })

    }).catch(err => res.json({
        message: `${err}`
    }))


})

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await UserModel.findOne({username})
    const passOK = bcrypt.compareSync(password, userDoc.password)
    
    if(passOK){
        jwt.sign({username,id: userDoc._id}, jwtSecret, {}, (err, token) => {
            if (err) throw err;
                
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                    
                });   
        })
    } else {
        res.status(400).json('wrong credentials');
    }
}); 

router.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

module.exports = router