const io = require('./../index').io;
const {getTime} = require('./../helper');
const {saveChats} = require('./../services/user.service')

module.exports = (socket) => {
    try {
        console.log("connected");
        socket.on("join-user", (data, callback) => {
            const {createdAt, name, picture, sessionId, updatedAt, _id} = data;
            const currentTime = getTime();
            const newUser = {
                createdAt,
                name,
                picture,
                sessionId,
                updatedAt: currentTime,
                _id
            }

            console.log('new user joined');
            socket.sessionId = sessionId;
            socket.join(sessionId);
            socket.broadcast.emit("new-online-user", newUser);
            callback();

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
            await saveChats(chatObj);
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

                const offlineUser = {
                    time: getTime(),
                    sessionId
                }

                socket.broadcast.emit("new-offline-user", offlineUser);
            }
        })


    } catch (e) {

    }
}

