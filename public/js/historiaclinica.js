// Buscar paciente
async function searchPaciente() {
    const dni = document.getElementById("dniBuscar").value;
    try {
      const response = await fetch('/pacient/get-data-pacient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni })
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los datos del paciente');
      }
      const data = await response.json();
      console.log('Datos del paciente:', data);
  
  
      document.getElementById('menu').style.display = 'none';
      document.getElementById('registrarPaciente').style.display = 'none';
      document.getElementById('buscarPaciente').style.display = 'none';
      document.getElementById('saveDataPacient').style.display = 'block';
  
      document.getElementById('nombrePaciente').innerText = data.fullName;
      document.getElementById('telefonoPaciente').innerText = data.telefono;
      document.getElementById('emailPaciente').innerText = data.email;
      document.getElementById('dniPaciente').innerText = data.dni;
  
      // Cargar datos en ventana modal
      document.getElementById("namePaciente").innerText = data.fullName;
        const bodyModal = document.getElementById("bodyModal");
  
        // Limpiar el contenido previo
        bodyModal.innerHTML = '';
  
        // Renderizar el historial por fecha
        data.history.forEach((entry) => {
          bodyModal.innerHTML += `
                  <div class="historial-entry">
                      <p><strong>Fecha:</strong> ${entry.fecha}</p>
                      <p><strong>Síntomas:</strong> ${entry.sintomas}</p>
                      <p><strong>Diagnóstico:</strong> ${entry.diagnostico}</p>
                      <p><strong>Tratamiento:</strong> ${entry.tratamiento}</p>
                      <hr>
                  </div>
              `;
        });
  
    } catch (error) {
      alert("No hay paciente");
      console.error(error.message);
    }
  }
  