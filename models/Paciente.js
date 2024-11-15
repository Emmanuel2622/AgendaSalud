const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dni: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String,
        required: true
    },
    sintomas: {
        type: [String],
        required: true
    },
    diagnostico: {
        type: [String],
        required: true
    },
    tratamiento: {
        type: [String],
        required: true
    },
    fecha: {
        type: [String], 
        required: true
    },
    area: {
        type: [String],
        required: true
    }
});

const Paciente = mongoose.model('Paciente', pacienteSchema);
module.exports = Paciente;
