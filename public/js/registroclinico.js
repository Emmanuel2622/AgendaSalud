function generarContrasena(longitud) {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let contrasena = "";
    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        contrasena += caracteres.charAt(indice);
    }
    return contrasena;
}

// Registrar paciente
async function addPacient() {
  const fullName = document.getElementById("nombre").value;
  const dni = document.getElementById("dni").value;
  const telefono = document.getElementById("telefono").value;
  const email = document.getElementById("email").value;
  const sexo = document.getElementById("tratamiento").value;
  const direccion = document.getElementById("direccion").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const edad = document.getElementById("edad").value;
  const obraSocial = document.getElementById("obraSocial").value;

  const sintomas = document.getElementById("sintomas").value;
  const diagnostico = document.getElementById("diagnostico").value;
  const tratamiento = document.getElementById("tratamiento").value;


  const fecha = new Date();
  const password = generarContrasena(8)
  const user = await fetch('/api/user');
  const userData = await user.json();
  const profesional = userData.fullName;

  // Obtener Area del prof
const responseArea = await fetch('/auth/get-area', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: userData.email }),
});
const dataArea = await responseArea.json();

if (!responseArea.ok) {
    console.error('Error:', dataArea.error);
    throw new Error('No se pudo obtener el área');
}
const area = dataArea.area;

// Registrar Paciente
const response = await fetch("/pacient/regis-pacient", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullName, dni, password, telefono, email, sexo, direccion, fechaNacimiento, edad, obraSocial, area, profesional, sintomas, diagnostico, tratamiento, fecha })
});

  if (response.ok) {
    alert("Cliente registrado");
    location.reload();
  } else {
    const errorData = await response.json();
    alert(errorData.error || "Error en el registro.");
  }
};

// Buscar paciente
async function searchPaciente() {
  const dni = document.getElementById("dniBuscar").value;
  const password = document.getElementById("password").value;
  try {
    const response = await fetch('/pacient/get-data-pacient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dni, password })
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
    document.getElementById('sexoPaciente').innerHTML = data.sexo;
    document.getElementById('direcPaciente').innerHTML = data.direccion;
    document.getElementById('fechaNacimientoPaciente').innerHTML = data.fechaNacimiento;
    document.getElementById('edadPaciente').innerHTML = data.edad;
    document.getElementById('osPaciente').innerHTML = data.obraSocial;
    document.getElementById('fechaAperturaPaciente').innerHTML = data.fechaApertura;

    // Cargar datos en ventana modal
    document.getElementById("namePaciente").innerText = data.fullName;
      const bodyModal = document.getElementById("bodyModal");

      // Limpiar el contenido previo
      bodyModal.innerHTML = '';

      // Renderizar el historial por fecha
      data.history.forEach((entry) => {
        bodyModal.innerHTML += `
                <div class="historial-entry">
                    <p><strong>Profesional:</strong> ${entry.profesional}</p>
                    <p><strong>Area:</strong> ${entry.area}</p>

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

// Guardar datos paciente
async function saveDataPaciente() {
  const dni = document.getElementById("dniPaciente").textContent;
  const sintomas = document.getElementById("save-sintomas").value;
  const diagnostico = document.getElementById("save-diagnostico").value;
  const tratamiento = document.getElementById("save-tratamiento").value;
  const fecha = new Date();
  const user = await fetch('/api/user');
  const userData = await user.json();
  const profesional = userData.fullName;

    // Obtener Area del prof
  const responseArea = await fetch('/auth/get-area', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userData.email }),
  });
  const dataArea = await responseArea.json();

  if (!responseArea.ok) {
      console.error('Error:', dataArea.error);
      throw new Error('No se pudo obtener el área');
  }
  const area = dataArea.area;


  const response = await fetch("/pacient/save-data-pacient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dni, area, profesional, sintomas, diagnostico, tratamiento, fecha })
  });

  if (response.ok) {
    alert("Datos de Paciente Cargados con exito");
    location.reload();
  } else {
    const errorData = await response.json();
    alert(errorData.error || "Error al cargar los datos del paciente.");
  }
}

// Funcion de los buttons
document.addEventListener('DOMContentLoaded', async () => {

  document.getElementById('select-1').addEventListener('click', function () {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('registrarPaciente').style.display = 'none';
    document.getElementById('buscarPaciente').style.display = 'block';
  });

  document.getElementById('volver-bus').addEventListener('click', function () {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('registrarPaciente').style.display = 'none';
    document.getElementById('buscarPaciente').style.display = 'none';
  });

  document.getElementById('select-2').addEventListener('click', function () {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('registrarPaciente').style.display = 'block';
    document.getElementById('buscarPaciente').style.display = 'none';
  });

  document.getElementById('volver-reg').addEventListener('click', function () {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('registrarPaciente').style.display = 'none';
    document.getElementById('buscarPaciente').style.display = 'none';
  });

});

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
          yPosition += 8; // Espacio entre las líneas de texto
      }
  });

  // Agregar un pequeño margen al final antes de la descarga
  doc.text("Fin del historial", 10, yPosition + 10);

  // Descarga el PDF
  doc.save(`Historial_${nombre}.pdf`);
}
