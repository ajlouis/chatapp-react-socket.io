const router = require("express").Router();
const chatUserService = require("../services/chat-user.service")
const axios = require("axios")

//LOGIN
router.get("/auth/login", async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userInfo = await chatUserService.getUserInfoFromAuth0(token);
        const savedUser = await chatUserService.findAndSaveUser(userInfo);
        res.status(200).json(savedUser);
    } catch (err) {
        res.status(500).json(err)
    }
});

//Get User List
router.get("/users-list/:id", async (req, res) => {
    try {
        const userLists = await chatUserService.getUsersList(req.params.id);
        let userListObj = {};
        if (userLists.length) {
            for (let i = 0; i < userLists.length; i++) {
                userListObj[userLists[i].sessionId] = userLists[i];
            }
        }
        res.status(200).send(userListObj);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get Chat User Information
router.get("/user/:id", async (req, res) => {
    try {
        const userInfo = await chatUserService.getUserInfo(req.params.id);
        res.status(200).send(userInfo);
    } catch (err) {
        res.status(500).json(err);
    }
});


//get User Chats
router.post("/chats", async (req, res) => {
    try {
        const {senderId, receiverId} = req.body;
        const userChats = await chatUserService.getUserChats(senderId, receiverId);
        res.status(200).send(userChats);
    } catch (err) {
        res.status(500).json(err);
    }
});


//check if user is online from redis
router.get("/user/is-offline/:id", async (req, res) => {
    try {
        await chatUserService.getOfflineUserInfo("WC:user:OFF", req.params.id, (e, r) => {
            console.log("useroff response", r);
            res.status(200).send(r ? r : false);
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
