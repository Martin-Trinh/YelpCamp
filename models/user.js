const mongoose = require('mongoose')
const passportLocalPassport = require('passport-local-mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema ({
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true
    }
})
UserSchema.plugin(passportLocalPassport)

module.exports = mongoose.model('User', UserSchema)