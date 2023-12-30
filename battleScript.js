// Assuming Firebase is already initialized
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const database = getDatabase();
    listenForReset(database);

    document.getElementById('resetEverything').addEventListener('click', () => {
        triggerReset(database);
    });
});

function triggerReset(database) {
    // Clear a specific node in Firebase to signal a reset
    set(ref(database, 'resetSignal'), {})
        .then(() => console.log("Reset signal triggered in Firebase."))
        .catch((error) => console.error("Error triggering reset signal: ", error));
}

function listenForReset(database) {
    const resetRef = ref(database, 'resetSignal');
    onValue(resetRef, (snapshot) => {
        if (snapshot.exists() && Object.keys(snapshot.val()).length === 0) {
            // Detected an empty set, perform reset actions
            localStorage.clear();
            window.location.href = 'index.html'; // Redirect to the initial setup page
        }
    });
}
