const Patient = require('../models/Paciente');

exports.regisPacient = async (req, res) => {
    const { fullName, email, password, dni, telefono, sexo, direccion, fechaNacimiento, edad, obraSocial, fechaApertura, sintomas, diagnostico, tratamiento, fecha, area, profesional } = req.body;

    try {
      let fechaApertura = new Date(fecha).toLocaleString("es-AR", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric"
      });

        const newPatients = new Patient({
            fullName,
            email,
            password,
            dni,
            telefono,
            sexo,
            direccion,
            fechaNacimiento,
            edad,
            obraSocial,
            fechaApertura,
            sintomas,
            diagnostico,
            tratamiento,
            fecha,
            area,
            profesional
        });

        await newPatients.save();
        res.status(201).json({ message: 'Datos del paciente cargados con exito' });

    } catch (error) {
        res.status(500).json({ error: 'Error al cargar los datos del paciente' });
    }
};

exports.saveData = async (req, res) => {
    const { dni, sintomas, diagnostico, tratamiento, area, fecha } = req.body;

    try {
        // Buscar paciente por DNI
        const pacient = await Patient.findOne({ dni });
        if (!pacient) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        // Agregar los nuevos datos a los arreglos
        pacient.sintomas.push(sintomas);
        pacient.diagnostico.push(diagnostico);
        pacient.tratamiento.push(tratamiento);
        pacient.area.push(area);
        pacient.fecha.push(fecha);

        // Guardar los cambios
        await pacient.save();
        res.status(200).json({ message: 'Datos del paciente actualizados con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar los datos del paciente' });
    }
};

exports.data = async (req, res) => {
    const { dni, password } = req.body;

    console.log("DNI recibido:", dni); // Debug: Verificar DNI recibido

    try {
        const pacient = await Patient.findOne({ dni });
        if (!pacient) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        if (password != pacient.password) {
            return res.status(404).json({ error: 'Contraseña incorrecta' });
        }

        // Formatear las fechas en el backend
        const formattedHistory = pacient.fecha.map((fecha, index) => ({
            fecha: new Date(fecha).toLocaleString("es-AR", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric"
            }),
            sintomas: pacient.sintomas[index],
            diagnostico: pacient.diagnostico[index],
            tratamiento: pacient.tratamiento[index],
            area: pacient.area[index],
            profesional: pacient.profesional[index]
        }));

        res.status(200).json({
            fullName: pacient.fullName,
            dni: pacient.dni,
            telefono: pacient.telefono,
            email: pacient.email,
            telefono: pacient.telefono,
            direccion: pacient.direccion,
            fechaNacimiento: pacient.fechaNacimiento,
            edad: pacient.edad,
            obraSocial: pacient.obraSocial,
            fechaApertura: pacient.fechaApertura,
            history: formattedHistory
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar los datos del paciente' });
    }
};
