const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: "string",
        required: true
    },
    email: {
        type: "string",
        required: true
    },
    verified: {
        type: "boolean",
        default: false
    }
}, {timestamps: true});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
const User = mongoose.model("User", UserSchema);
module.exports = User;