const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            unique: true,
        },

        nickname: {
            type: String,
            require: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },

        picture: {
            type: String,
            default: "",
        },

    },
    {timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);
