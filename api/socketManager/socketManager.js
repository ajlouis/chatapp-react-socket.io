const io = require('./../index').io;
const {getTime} = require('./../helper');
const {saveChat, addUsersToListRedis, removeUsersFromListRedis} = require('../services/chat-user.service');


module.exports = (socket) => {
    try {
        console.log("connected");
        socket.on("join-user", (data, callback) => {
            const {createdAt, name, picture, sessionId, updatedAt, _id} = data;
            console.log("logged in sessionId", sessionId);
            const currentTime = getTime();
            const newUser = {
                createdAt,
                name,
                picture,
                sessionId,
                updatedAt: currentTime,
                _id
            };

            // WC:user:OFF (delete the user from here)
            // removeUsersFromListRedis(`WC:user:OFF`, sessionId);
            // WC:user:ON (add user here)
            // addUsersToListRedis(
            //     `WC:user:ON`,
            //     sessionId,
            //     {time: currentTime},
            //     (e, r) => {
            //         if (e) return callback(e);
            //         socket.sessionId = sessionId;
            //         socket.join(sessionId);
            //         socket.broadcast.emit("new-online-user", newUser);
            //         console.log("new user joined", r);
            //         callback();
            //     }
            // );

            socket.sessionId = sessionId;
            socket.join(sessionId);
            socket.broadcast.emit("new-online-user", newUser);
                    callback();
            console.log("new user joined");
        });


        socket.on("send-msg", async (data, callback) => {
            const {senderId, receiverId, msg} = data;
            const chatObj = {
                room: [receiverId, senderId],
                senderId,
                receiverId,
                msg,
                time: getTime()
            }
            await saveChat(chatObj);
            io.to(receiverId).emit("receive-msg", chatObj);
            callback(chatObj);
        });


        socket.on("user-typing", async (data, callback) => {
            const {senderId, receiverId, msg} = data;
            const chatObj = {
                room: [receiverId, senderId],
                senderId,
                receiverId,
                msg,
                time: getTime()
            }
            io.to(receiverId).emit("user-typing", chatObj);
            callback(data);
        });


        socket.on("disconnect", () => {
            const {sessionId} = socket;
            if (sessionId) {
                // removeUsersFromListRedis(`WC:user:ON`, sessionId);
                const offlineUser = {
                    time: getTime(),
                    sessionId
                }

                // addUsersToListRedis(`WC:user:OFF`, sessionId, offlineUser, (e, r) => {
                //     console.log("user left", r);
                // });

                socket.broadcast.emit("new-offline-user", offlineUser);
            }
        })


    } catch (e) {

    }
}

