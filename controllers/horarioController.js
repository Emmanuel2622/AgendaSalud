const UsersHorario = require('../models/User');

exports.saveHours = async (req, res) => {
    const { fullName, startHour, endHour } = req.body;

    if (!fullName || !startHour || !endHour) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        let UsersHorarios = await UsersHorario.findOne({ fullName });

        if (UsersHorarios) {
            UsersHorarios.startHour = startHour;
            UsersHorarios.endHour = endHour;
        } else {
            UsersHorarios = new UsersHorarios({ fullName, startHour, endHour });
        }

        await UsersHorarios.save();
        res.json({ success: true, message: 'Horarios guardados correctamente.' });
    } catch (err) {
        console.error('Error al guardar los horarios:', err);
        res.status(500).json({ error: 'Error al guardar los horarios.' });
    }
};

exports.getHours = async (req, res) => {
    try {
        console.log('Intentando obtener los horarios...');
        // Seleccionar solo startHour y endHour
        const UsersHorarios = await UsersHorario.find().select('fullName startHour endHour');
        console.log('Horarios obtenidos:', UsersHorarios);
        res.json(UsersHorarios);
    } catch (err) {
        console.error('Error al obtener los horarios:', err);
        res.status(500).json({ error: 'Error al obtener los horarios.' });
    }
};


exports.getHoursByProfessional = async (req, res) => {
    const { fullName } = req.query;

    if (!fullName) {
        return res.status(400).json({ error: 'Nombre del profesional no proporcionado' });
    }

    try {
        const UsersHorarios = await UsersHorario.find({ fullName }).select('startHour endHour');
        res.json(UsersHorarios);
    } catch (err) {
        console.error('Error al obtener los horarios:', err);
        res.status(500).json({ error: 'Error al obtener los horarios.' });
    }
};
