const User = require("../models/User");
const router = require("express").Router();


//get friends
// router.get("/friends", async (req, res) => {
//     try {
//         const users = await User.find({});
//         let friendList = [];
//         users.map((friend) => {
//             const {name, picture} = friend;
//             friendList.push({name, picture});
//         });
//         res.status(200).json(friendList)
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

module.exports = router;
