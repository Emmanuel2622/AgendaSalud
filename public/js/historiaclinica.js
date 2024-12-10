// Buscar paciente
async function searchPaciente() {
    const dni = document.getElementById("indni").value;
    const password = document.getElementById("passwd").value;
    try {
      const response = await fetch('/pacient/get-data-pacient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, password})
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos del paciente');
      }
      const data = await response.json();
      console.log('Datos del paciente:', data);

      document.getElementById('windowsHistoriaClinica').style.display = 'block';
      document.getElementById('windowSearchHC').style.display = 'none';

      document.getElementById('nombrePaciente').innerText = data.fullName;
      document.getElementById('telefonoPaciente').innerText = data.telefono;
      document.getElementById('emailPaciente').innerText = data.email;
      document.getElementById('dniPaciente').innerText = data.dni;

      const info = document.getElementById("info");

      // Limpiar el contenido previo
      info.innerHTML = '';

      // Renderizar el historial por fecha
      data.history.forEach((entry) => {
        info.innerHTML += `
                <div class="historial-entry">
                    <p><strong class="text-black">Fecha:</strong> ${entry.fecha}</p>
                    <p><strong class="text-black">Síntomas:</strong> ${entry.sintomas}</p>
                    <p><strong class="text-black">Diagnóstico:</strong> ${entry.diagnostico}</p>
                    <p><strong class="text-black">Tratamiento:</strong> ${entry.tratamiento}</p>
                    <hr>
                </div>
            `;
      });
    } catch (error) {
      alert("No hay paciente");
      console.error(error.message);
    }
  }
