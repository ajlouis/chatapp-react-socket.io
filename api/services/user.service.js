const axios = require('axios');
const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.getUserInfo = async (token) => {
    const response = await axios.get(
        'https://aljinteractive.auth0.com/userinfo',
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
    const userEmail = userInfo.email;
    const user = await User.findOne({userEmail});
    if (user) {
        return user;
    } else {
        const user = await new User({userInfo}).save();
        return user;
    }
};





