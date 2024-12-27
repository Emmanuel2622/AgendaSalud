document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('volver').addEventListener('click', function() {
    location.reload();
  });
});

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
      document.getElementById('direccionPaciente').innerText = data.direccion;
      document.getElementById('fechaNacimiento').innerText = data.fechaNacimiento;
      document.getElementById('edadPaciente').innerText = data.edad;
      document.getElementById('obraSocialPaciente').innerText = data.obraSocial;
      document.getElementById('sexoPaciente').innerText = data.sexo;
      document.getElementById('fechaAperturaPaciente').innerText = data.fechaApertura;



      const info = document.getElementById("info");

      // Limpiar el contenido previo
      info.innerHTML = '';

      // Renderizar el historial por fecha
      data.history.forEach((entry) => {
        info.innerHTML += `

          <div class="container">
            <div class="historial-entry p-4 border rounded shadow">
            <div class="row border rounded-top">
              <div class="col border-end text-start p-2">
                <p class="text-secondary-emphasis"><strong class="text-azul">Profesional:</strong> ${entry.profesional}</p>
              </div>
              <div class="col text-start p-2">
                <p class="text-secondary-emphasis"><strong class="text-azul">Area:</strong> ${entry.area}</p>
              </div>
            </div>

            <div class="row border border-top-0 p-2">
              <p class="text-secondary-emphasis"><strong class="text-azul">Fecha:</strong> ${entry.fecha}hs</p>
            </div>

            <div class="row border border-top-0 p-2">
              <p class="text-secondary-emphasis"><strong class="text-azul">Síntomas:</strong> ${entry.sintomas}</p>
            </div>
            <div class="row border border-top-0 p-2">
              <p class="text-secondary-emphasis"><strong class="text-azul">Diagnóstico:</strong> ${entry.diagnostico}</p>
            </div>
            <div class="row border border-top-0 p-2">
              <p class="text-secondary-emphasis"><strong class="text-azul">Tratamiento:</strong> ${entry.tratamiento}</p>
            </div>
            </div>
          </div></br>
            `;
      });
    } catch (error) {
      alert("No hay paciente");
      console.error(error.message);
    }
  }


  // Descargar Registro Clinico
  async function downloadPatientHistory() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Datos del paciente
    const nombre = document.getElementById("namePaciente").innerText;
    const historialContent = document.getElementById("bodyModal").innerText;

    // Estilos y encabezados
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Agenda Salud", 105, 20, null, null, "center");

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Historial Clínico del Paciente", 105, 30, null, null, "center");

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.line(10, 35, 200, 35);

    // Información del paciente
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Nombre:", 10, 45);
    doc.setFont("helvetica", "normal");
    doc.text(nombre, 40, 45);

    // Datos del paciente
    const telefono = document.getElementById("telefonoPaciente") ? document.getElementById("telefonoPaciente").innerText : "N/A";
    const dni = document.getElementById("dniPaciente") ? document.getElementById("dniPaciente").innerText : "N/A";
    const email = document.getElementById("emailPaciente") ? document.getElementById("emailPaciente").innerText : "N/A";

    doc.setFont("helvetica", "bold");
    doc.text("Teléfono:", 10, 55);
    doc.setFont("helvetica", "normal");
    doc.text(telefono, 40, 55);

    doc.setFont("helvetica", "bold");
    doc.text("DNI:", 10, 65);
    doc.setFont("helvetica", "normal");
    doc.text(dni, 40, 65);

    doc.setFont("helvetica", "bold");
    doc.text("Email:", 10, 75);
    doc.setFont("helvetica", "normal");
    doc.text(email, 40, 75);

    // Línea de separación
    doc.setLineWidth(0.5);
    doc.line(10, 85, 200, 85);

    // Historial clínico
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Historial Médico", 10, 95);

    // Separar y mejorar el contenido del historial
    const contentLines = historialContent.split("\n");
    let yPosition = 105; // Posición inicial en el eje Y para el contenido del historial

    contentLines.forEach(line => {
        if (line.trim() !== "") {
            // Aseguramos que cada línea esté separada
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(line, 10, yPosition);
            yPosition += 10; // Espacio entre las líneas de texto
        }
    });

    // Agregar un pequeño margen al final antes de la descarga
    doc.text("Fin del historial", 10, yPosition + 10);

    // Descarga el PDF
    doc.save(`Historial_${nombre}.pdf`);
  }
