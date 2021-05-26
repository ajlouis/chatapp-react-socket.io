const axios = require('axios');
const mongoose = require('mongoose');
const {getUniqueId} = require('../helper')
const User = mongoose.model('User');
const Chat = require('../models/Chat');

exports.getUserInfoFromAuth0 = async (token) => {

    const response = await axios.get(
        'https://aljinteractive.us.auth0.com/userinfo',
        {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

    const userinfo = response.data;
    console.log('userinfo:', userinfo);
    return userinfo
};


exports.findAndSaveUser = async (userInfo) => {
    const email = userInfo.email;
    const user = await User.findOne({email});
    if (user) {
        return user;
    } else {
        userInfo['sessionId'] = getUniqueId();
        const user = await new User(userInfo).save();
        return user;
    }
};


exports.getUsersList = async (sessionId) => {
    const usersList = await User.find({sessionId: {$ne: sessionId}});
    return usersList;
}

exports.getUserInfo = async (sessionId) => {
    const user = await User.findOne({sessionId: sessionId});
    return user;
}

exports.getUserChats = async (senderId, receiverId) => {
    console.log('inside getUserChats::', senderId, receiverId);
    const chats = await Chat.find({room: {$all: [senderId, receiverId]}});
    console.log('chats retrieved:', chats);

    return chats;

}

exports.saveChats = async (payload) => {
    const chatObj = await new Chat(payload).save();
    return chatObj._id;

}









