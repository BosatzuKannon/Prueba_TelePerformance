const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {
        allowNull: false,
        type: String
    },
    lastname: {
        allowNull: false,
        type: String
    },
    email:{
        type: String,
        unique: false
    },
    password: {
        allowNull: false,
        type: String
    },
    role: {
        allowNull: false,
        type: String,
        default: 'user'
    },
    active: {
        allowNull: false,
        type: Boolean,
        default: true
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    avatar: {
        allowNull: false,
        type: String
    },
})

module.exports = mongoose.model('User', UserSchema)