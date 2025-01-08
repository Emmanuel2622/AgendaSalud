document.addEventListener('DOMContentLoaded', async () => {
  const saveButton = document.getElementById('save-img');
  const fileInput = document.getElementById('img-upload');
  const modalImg = document.getElementById('modal-img');
  const modal = new bootstrap.Modal(document.getElementById('imageModal'));

  const responsedni = await fetch('/api/user');
  const userDataDni = await responsedni.json();
  const dni = userDataDni.dni;

  // Cuando se selecciona una nueva imagen, actualizar la vista en el modal
  fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        modalImg.src = e.target.result;  // Mostrar la imagen seleccionada en el modal
      };
      reader.readAsDataURL(file);
    }
  });

  const responseImg = await fetch('/auth/get-img', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dni: dni }),
  });
  const data = await responseImg.json();

  const direcElement = document.getElementById('profile-img');

  if (responseImg.ok) {
    if (direcElement) {
      direcElement.src = data.image;
      modalImg.src = data.image;
    } else {
        console.error('El elemento con el ID "profile-img" no se encontró en el DOM.');
    }
  }  else {
      console.error('Error:', data.error);
  }


    // Cuando se hace clic en "Guardar", enviar la imagen al servidor
    saveButton.addEventListener('click', function () {
      const file = fileInput.files[0];
      if (!file) {
        alert('Por favor selecciona una imagen');
        return;
      }

      // Crear un FormData para enviar la imagen al servidor
      const formData = new FormData();
      formData.append('image', file);

      // Usar fetch para enviar la imagen al servidor
      fetch(`/upload-image/${dni}`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.image) {
          // Cerrar el modal
          modal.hide();  // Cerrar el modal
          // Actualizar la imagen en el frontend con la nueva URL
          const imgElement = document.querySelector('img');
          imgElement.src = data.image;  // Asume que "data.image" es la URL de la imagen

        } else {
          alert('Error al subir la imagen');
        }
      })
      .catch(error => {
        console.error('Error al subir la imagen:', error);
        alert('Hubo un problema al intentar subir la imagen');
      });
    });

});
