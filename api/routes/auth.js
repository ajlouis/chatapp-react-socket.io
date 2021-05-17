const router = require("express").Router();
const userService = require("../services/user.service")
const axios = require("axios")


//LOGIN
router.get("/register", async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userInfo = await userService.getUserInfo(token);
        const savedUser = await userService.findAndSaveUser(userInfo)
        res.status(200).json(savedUser)
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/index', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        console.log('accessToken', token);
        const response = await axios.get(
                'https://aljinteractive.us.auth0.com/userinfo',
            {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

        const userinfo = response.data;
        console.log('userinfo:', userinfo);
        res.send(userinfo);

    }catch (error) {
        res.send(error);
    }
});

module.exports = router;
