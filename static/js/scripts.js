document.addEventListener('DOMContentLoaded', (event) => {
    const lastUpdatedElement = document.getElementById('last-updated');
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    lastUpdatedElement.textContent = formattedDate;
});
