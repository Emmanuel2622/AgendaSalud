document.getElementById('enviar').addEventListener('click', handleFormSubmit);
document.getElementById('appointmentDate').addEventListener('change', updateAvailableSlots);


let professionalWorkHours = {};

fetch('http://localhost:3000/api/get-hours')
    .then(response => response.json())
    .then(data => {
        professionalWorkHours = data.reduce((acc, { fullName, startHour, endHour }) => {
            acc[fullName] = { start: startHour, end: endHour };
            return acc;
        }, {});
    })
    .catch(error => {
        console.error('Error al obtener los horarios:', error);
    });

function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('patientName').value;
    const email = document.getElementById('email').value;
    const number = document.getElementById('number').value;
    const numberCode = document.getElementById('number-code').value;
    const selectedSlot = document.getElementById('available-slots').value;
    const date = new Date(selectedSlot);

    const eventDetails = {
        summary: `Cita con ${name}`,
        description: `Correo del paciente: ${email}, Numero de telefono: ${number}`,
        start: {
            dateTime: date.toISOString(),
            timeZone: 'America/Argentina/Buenos_Aires'
        },
        end: {
            dateTime: new Date(date.getTime() + 30 * 60000).toISOString(), // Añadir 30 minutos a la hora de inicio
            timeZone: 'America/Argentina/Buenos_Aires'
        },
        email: email, // Añadir el correo del cliente
        number: number, // Añadir el número de teléfono del cliente
        numberCode: numberCode // Añadir el area de pais del teléfono del cliente
    };

    fetch('http://localhost:3000/create-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventDetails)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('appointmentDate').value = '';
                document.getElementById('available-slots').value = '';
                // Mostrar el modal de éxito
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
            } else {
                // Mostrar el modal de error
                const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
                errorModal.show();
            }
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
            // Mostrar el modal de error en caso de fallo
            const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
            errorModal.show();
        });
}

function getAvailableSlots(occupiedSlots, selectedDate, workHours) {
    const availableSlots = [];

    const [startHour, startMinute] = workHours.start.split(':').map(Number);
    const [endHour, endMinute] = workHours.end.split(':').map(Number);

    const adjustedStartHour = (startHour + 3) % 24;
    const adjustedEndtHour = (endHour + 3) % 24;

    const timeMin = new Date(selectedDate);
    timeMin.setUTCHours(adjustedStartHour, startMinute); // Establece la hora al inicio del día
    const timeMax = new Date(selectedDate);
    timeMax.setUTCHours(adjustedEndtHour, endMinute); // Establece la hora al final del día

    let currentTime = new Date(timeMin);
    // Recorrer cada franja de 30 minutos
    while (currentTime < timeMax) {
        const nextSlot = new Date(currentTime.getTime() + 30 * 60000);
        const currentSlot = currentTime.toISOString();

        // Comprobar si el slot está ocupado
        const isSlotnotOccupied = occupiedSlots.includes(currentSlot);

        // Si no está ocupado, añadir a los slots disponibles
        if (isSlotnotOccupied) {
            availableSlots.push(currentTime.toISOString()); // Devuelve en formato UTC
        }
        // Avanzar al siguiente slot
        currentTime = nextSlot;
    }

    return availableSlots;
}

// Función para encontrar el turno más cercano, incluso si es en una fecha futura
function findNearestSlot(availableSlots) {
    const now = new Date(); // Hora actual
    let nearestSlot = null;

    for (const slot of availableSlots) {
        const slotDate = new Date(slot);

        // Si el slot es posterior a la hora actual
        if (slotDate > now) {
            if (!nearestSlot || slotDate < new Date(nearestSlot)) {
                nearestSlot = slot;
            }
        }
    }

    return nearestSlot;
}

// Función para buscar turnos en fechas futuras si no hay en la fecha seleccionada
function searchForNearestSlot(professionalName) {
    const workHours = professionalWorkHours[professionalName];
    let currentDate = new Date();

    // Buscar hasta encontrar el turno más cercano, avanzando un día cada vez
    const fetchNearestSlot = () => {
        const formattedDate = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        // Verificar si es sábado o domingo
        const dayOfWeek = currentDate.getDay();  // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Si es domingo (0) o sábado (6)
            currentDate.setDate(currentDate.getDate() + 1); // Avanzar al siguiente día
            fetchNearestSlot(); // Volver a intentar
            return; // Salir de la función
        }

        fetch(`http://localhost:3000/available-slots?date=${encodeURIComponent(formattedDate)}`)
            .then(response => response.json())
            .then(occupiedSlots => {
                const availableSlots = getAvailableSlots(occupiedSlots, formattedDate, workHours);

                if (availableSlots.length > 0) {
                    const nearestSlot = findNearestSlot(availableSlots);

                    if (nearestSlot) {
                        const nearestSlotDate = new Date(nearestSlot).toLocaleString('es-AR', {
                            timeZone: 'America/Argentina/Mendoza',
                            hour12: false,
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        });
                        document.getElementById('nearest-slot').textContent = `El turno más cercano es: ${nearestSlotDate}hs`;
                    }
                } else {
                    document.getElementById('nearest-slot').textContent = `Buscando turno mas cercano...`;
                    // Si no hay turnos en el día actual, buscar en el siguiente día
                    currentDate.setDate(currentDate.getDate() + 1);
                    fetchNearestSlot();
                }
            })
            .catch(error => {
                console.error('Error al obtener los horarios disponibles:', error);
            });
    };

    fetchNearestSlot();
}


function updateAvailableSlots() {
    const selectedDate = document.getElementById('appointmentDate').value;
    const professionalName = document.getElementById('profName').value;

    if (selectedDate && professionalName) {
        const workHours = professionalWorkHours[professionalName];

        if (!workHours) {
            console.error('No se encontraron horarios de trabajo para el profesional seleccionado');
            return;
        }

        // Crear un objeto Date a partir de la fecha seleccionada
        const date = new Date(selectedDate);
        const dayOfWeek = date.getDay();  // Obtener el día de la semana (0 = Domingo, 6 = Sábado)

        // Si es sábado o domingo, mostrar mensaje de que no se trabaja
        if (dayOfWeek === 6 || dayOfWeek === 5) {  // 0 = Domingo, 6 = Sábado
            document.getElementById('nearest-slot').textContent = 'No se trabaja los sábados ni los domingos.';
            document.getElementById('available-slots').innerHTML = '<option value="">Selecciona un horario</option>';
            return; // Salir de la función
        }

        // Hacer la petición al servidor para obtener los horarios disponibles
        fetch(`http://localhost:3000/available-slots?date=${encodeURIComponent(selectedDate)}`)
            .then(response => response.json())
            .then(occupiedSlots => {
                const availableSlots = getAvailableSlots(occupiedSlots, selectedDate, workHours);
                const selectElement = document.getElementById('available-slots');
                selectElement.innerHTML = '<option value="">Selecciona un horario</option>';

                availableSlots.forEach(slot => {
                    // Convertir el horario a la zona horaria de Argentina/Mendoza
                    const localSlot = new Date(slot).toLocaleString('es-AR', {
                        timeZone: 'America/Argentina/Mendoza',
                        hour12: false,
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    const option = document.createElement('option');
                    option.value = slot; // Mantener el valor en UTC para enviar al servidor
                    option.textContent = localSlot; // Mostrar en la zona horaria local
                    selectElement.appendChild(option);
                });

                // Buscar el turno más cercano en caso de que no haya en el día seleccionado
                if (availableSlots.length > 0) {
                    const nearestSlot = findNearestSlot(availableSlots);
                    const nearestSlotDate = new Date(nearestSlot).toLocaleString('es-AR', {
                        timeZone: 'America/Argentina/Mendoza',
                        hour12: false,
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    document.getElementById('nearest-slot').textContent = `El turno más cercano es: ${nearestSlotDate}hs`;
                } else {
                    // Si no hay turnos en la fecha seleccionada, buscar en fechas futuras
                    searchForNearestSlot(professionalName);
                }
            })
            .catch(error => {
                console.error('Error al obtener los horarios disponibles:', error);
            });
    }
}

document.getElementById('searchAppointmentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('searchEmail').value;

    // Asegurarse de que el email no esté vacío
    if (!email) {
        alert('Por favor, introduce un correo electrónico para buscar los turnos.');
        return;
    }

    // Realizar la búsqueda solo con el email
    fetch(`http://localhost:3000/search-appointment?email=${email}`)
        .then(response => response.json())
        .then(data => {
            const appointmentsDiv = document.getElementById('appointments');
            appointmentsDiv.innerHTML = '';

            if (data.length > 0) {
                data.forEach(appointment => {
                    const appointmentDiv = document.createElement('div');
                    appointmentDiv.innerHTML = `
                        <p class="mt-4">Turno: ${appointment.summary} (${appointment.start.dateTime})</p>
                        <button class="btn btn-celeste text-white" onclick="deleteAppointment('${appointment.id}')">Eliminar Turno</button>
                    `;
                    appointmentsDiv.appendChild(appointmentDiv);
                });
            } else {
                appointmentsDiv.innerHTML =
                    '<p class="mt-4">No se encontraron turnos disponibles.</p>' +
                    '<p class="mt-4">Recuerde que únicamente aparecerán los turnos solicitados a través de nuestro sistema. Si ha solicitado un turno de manera presencial, le recomendamos que se comunique directamente con el centro médico donde realizó la solicitud.</p>';
            }
        })
        .catch(error => console.error('Error al buscar turnos:', error));
});

function deleteAppointment(eventId) {
    fetch(`http://localhost:3000/delete-appointment/${eventId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            alert('Turno eliminado');
            location.reload(); // Recargar la página para actualizar la lista de turnos
        })
        .catch(error => console.error('Error al eliminar turno:', error));
}
