const mongoose = require("mongoose");


const ChatSchema = new mongoose.Schema(
  {
    room: {
      type: Array,
    },
      senderId: {
          type: String,
          require: true,
      },

      receiverId: {
          type: String,
          require: true,
      },
      msg: {
        type: Object
      },
      time: {
        type:String,
      }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);

