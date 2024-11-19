// Función para agregar un nuevo profesional y área
async function addProfessional() {
  const area = document.getElementById("areaNameDash").value;
  const professional = document.getElementById("fullName").value;
  const email = document.getElementById("registerEmail").value;

  if (area && professional && email) {
    const data = { area: area, professional: professional };

    try {
      // Enviar datos a la API para agregar profesional
      const addProfessionalResponse = await fetch(
        "http://localhost:3000/add-professional",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!addProfessionalResponse.ok) {
        throw new Error("Error al agregar profesional.");
      }

      // Enviar datos a la API para guardar el área
      const saveAreaResponse = await fetch("/auth/save-area", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, area }),
      });

      if (!saveAreaResponse.ok) {
        throw new Error("Error al guardar el área.");
      }

      const result = await saveAreaResponse.json();
      console.log(result);

      console.log("Área y profesional agregados exitosamente");
      document.getElementById("areaNameDash").value = ""; // Limpiar el input
      return true;
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
      return false;
    }
  } else {
    alert("Por favor, ingresa el área, profesional y email.");
    return false;
  }
}

// Función para obtener áreas y profesionales desde la base de datos y llenar el menú desplegable de áreas
async function populateAreaList(area) {
  const select = area;

  try {
    const response = await fetch("http://localhost:3000/professionals");
    const professionals = await response.json();

    professionals.forEach((prof) => {
      const option = document.createElement("option");
      option.value = prof.area;
      option.textContent = prof.area;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las áreas:", error);
  }
}

function test() {
  const area = document.getElementById("areaNameDash").value;
  console.log("area: ",area);
};

document.addEventListener("DOMContentLoaded", function () {
  area = document.getElementById("areaNameDash");
  populateAreaList(area);

});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Obtener los valores del formulario
  const activationCode = document.getElementById("activationCode").value;
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const area = document.getElementById("areaNameDash").value;

  try {
    // Enviar datos para registrar al usuario
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, email, password, activationCode, area }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error en el registro.");
    }

    // Si el registro fue exitoso, agregar profesional
    const addProfessionalSuccess = await addProfessional();
    if (addProfessionalSuccess) {
      // Redirigir si ambas operaciones fueron exitosas
      window.location.href = "/dashboard";
    }
  } catch (error) {
    alert(error.message || "Ocurrió un error inesperado.");
  }
});
