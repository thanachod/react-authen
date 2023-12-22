const express = require('express');
const server = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

server.use(cors({credentials: true, origin: 'http://localhost:3000'}));
server.use(express.json());
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }))

// routes
const users = require('./routes/users');
const tweets = require('./routes/tweets');

server.use('/users', users);
server.use('/tweets', tweets);


server.listen(4000,()=> {
    console.log('api is on 4000');
    
})