document.getElementById('toggleButton').addEventListener('click', function () {
    const sidePanel = document.querySelector('.side-panel');
    const gridContainer = document.querySelector('.grid-container');
    const toggleButton = document.getElementById('toggleButton');

    if (sidePanel.style.display === 'none') {
        // Show the side panel
        sidePanel.style.display = 'block';
        gridContainer.style.gridTemplateColumns = '2fr 2fr 1fr'; // Restore original layout
        toggleButton.innerHTML = "&#x25B6;";
    } else {
        // Hide the side panel
        sidePanel.style.display = 'none';
        gridContainer.style.gridTemplateColumns = '2fr 2fr'; // Remove the space for the side panel
        toggleButton.innerHTML = "&#x25C0;";
    }
});
