import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwsdgIZ1hpEmsQg7sZY0A2vEo71jyhwbY",
    authDomain: "carddual-b13da.firebaseapp.com",
    projectId: "carddual-b13da",
    storageBucket: "carddual-b13da.appspot.com",
    messagingSenderId: "280023498180",
    appId: "1:280023498180:web:940612b32d85e5a08c7891",
    measurementId: "G-KF6XZ6F2MS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    startListeningToPlayerChanges();
});

function startListeningToPlayerChanges() {
    onValue(ref(database, 'players/'), (snapshot) => {
        const players = snapshot.val();
        if (players) {
            updatePlayerList(players);
        }
    }, (error) => {
        console.error("Error fetching player names: ", error);
    });
}

function updatePlayerList(players) {
    const playerTeamChoices = document.getElementById('playerTeamChoices');
    playerTeamChoices.innerHTML = ''; // Clear existing list

    for (const key in players) {
        if (players.hasOwnProperty(key)) {
            const playerRow = document.createElement('div');
            playerRow.innerHTML = `
                <span>${players[key].name}</span>
                <select>
                    <option value="teamA">Team A</option>
                    <option value="teamB">Team B</option>
                </select>
            `;
            playerTeamChoices.appendChild(playerRow);
        }
    }
}
