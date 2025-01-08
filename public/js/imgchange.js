document.getElementById("img-upload").addEventListener("change", function(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("modal-img").src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
});

document.getElementById("save-img").addEventListener("click", function() {
    const newImageSrc = document.getElementById("modal-img").src;
    document.getElementById("profile-img").src = newImageSrc;
    const modal = bootstrap.Modal.getInstance(document.getElementById("imageModal"));
    modal.hide();  // Cerrar el modal
});
