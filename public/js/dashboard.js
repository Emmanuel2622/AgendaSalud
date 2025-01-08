// dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/user');
    const userData = await response.json();

    if (userData.fullName) {
        document.getElementById('userName').textContent = `Te damos la bienvenida, ${userData.fullName}!`;
    }
});
