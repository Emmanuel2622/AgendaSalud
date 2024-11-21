const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dni: {
        type: Number,
        required: true,
        unique: true,
    },
    telefono: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    activationCode: {
        type: String,
        required: true,
    },
    startHour: {
        type: String,
        required: false
    },
    endHour: {
        type: String,
        required: false
    },
    area:{
        type: String,
        require: true
    },
    descripcion:{
        type: String,
        require: false
    },
    precio:{
        type: String,
        require: false
    },
    direccion:{
        type: String,
        require: false
    },
    calendarid:{
        type: String,
        require: false
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
