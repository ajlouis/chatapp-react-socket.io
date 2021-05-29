const axios = require('axios');
const {getUniqueId} = require('../helper')
const User = require("../models/User");
const Chat = require('../models/Chat');
const redisClient = require("./../redis");

exports.getUserInfoFromAuth0 = async (token) => {

    const response = await axios.get(
        'https://aljinteractive.us.auth0.com/userinfo',
        {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

    const userinfo = response.data;
    console.log('userinfo from Auth0:', userinfo);
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
    const chats = await Chat.find({room: {$all: [senderId, receiverId]}});
    return chats;

}

exports.saveChat = async (payload) => {
    const chatObj = await new Chat(payload).save();
    return chatObj._id;
}

exports.addUsersToListRedis = (key, subKey, value, cb) => {
    redisClient.HMSET(key, subKey, JSON.stringify(value), (err, res) => {
        return cb(err, res);
    });
};

exports.removeUsersFromListRedis = (key, subKey) => {
    redisClient.HDEL(key, subKey);
};

exports.getOfflineUserInfo = (key, subKey, cb) => {
    redisClient.HGET(key, subKey, (err, res) => {
        cb(err, res);
    });
};









