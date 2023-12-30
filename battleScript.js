import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    // Ensure the Firebase app is already initialized
    const database = getDatabase();

    document.getElementById('resetEverything').addEventListener('click', () => resetEverything(database));
});

function resetEverything(database) {
    // Clear local storage
    localStorage.clear();

    // Reset Firebase Database
    const initialData = {
        teams: {
            teamA: {},
            teamB: {}
        },
        // Include any other initial data structure you need
    };

    set(ref(database), initialData)
        .then(() => {
            alert("Everything has been reset.");
            // Redirect to the original HTML page
            window.location.href = 'index.html'; // Change 'index.html' to your original page
        })
        .catch((error) => console.error("Error resetting Firebase: ", error));
}
