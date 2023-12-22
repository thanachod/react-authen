const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const TweetSchema = new Schema({
    message: { type: String}, 
    author: { 
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    userTag: { type: Schema.Types.ObjectId, ref: 'User' },
    
    
},
{ timestamps: true }
);

const TweetModel = model('Tweet', TweetSchema);

module.exports = TweetModel;