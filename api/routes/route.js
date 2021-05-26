const router = require("express").Router();
const userService = require("../services/user.service")
const axios = require("axios")

//LOGIN
router.get("/auth/login", async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userInfo = await userService.getUserInfoFromAuth0(token);
        const savedUser = await userService.findAndSaveUser(userInfo);
        res.status(200).json(savedUser);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get("/users-list/:id", async (req, res) => {
    try {
        const userLists = await userService.getUsersList(req.params.id);
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

router.get("/user/:id", async (req, res) => {
    try {
        const userInfo = await userService.getUserInfo(req.params.id);
        res.status(200).send(userInfo);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/chats", async (req, res) => {
    try {
        const {senderId, receiverId} = req.body;
        const userChats = await userService.getUserChats(senderId, receiverId);
        res.status(200).send(userChats);
    } catch (err) {
        res.status(500).json(err);
    }
});

//
// router.get('/index', async (req, res) => {
//     const token = req.headers.authorization.split(' ')[1];
//     try {
//         console.log('accessToken', token);
//         const response = await axios.get(
//             'https://aljinteractive.us.auth0.com/userinfo',
//             {
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 }
//             });
//
//         const userinfo = response.data;
//         console.log('userinfo:', userinfo);
//         res.send(userinfo);
//
//     } catch (error) {
//         res.send(error);
//     }
// });

module.exports = router;
