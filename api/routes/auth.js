const router = require("express").Router();
const userService = require("../services/user.service")


//LOGIN
router.get("/register", async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userInfo =  await userService.getUserInfo(token);
        const savedUser = await userService.findAndSaveUser(userInfo)
        res.status(200).json(savedUser)
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;
