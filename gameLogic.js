// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase configuration
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

function addPlayerToFirebase(name) {
    const playerRef = ref(database, 'players/');
    const newPlayerRef = push(playerRef);
    set(newPlayerRef, { name: name });
}

function startListeningToPlayerChanges() {
    onValue(ref(database, 'players/'), (snapshot) => {
        const players = snapshot.val();
        updatePlayerList(players);
    });
}

function updatePlayerList(players) {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = ''; // Clear existing list

    for (const key in players) {
        if (players.hasOwnProperty(key)) {
            const listItem = document.createElement('li');
            listItem.textContent = players[key].name;
            playerList.appendChild(listItem);
        }
    }
}

function clearPlayersFromFirebase() {
    const playersRef = ref(database, 'players/');
    remove(playersRef); // Remove all players from Firebase
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    startListeningToPlayerChanges();

    const signInForm = document.getElementById('signInForm');
    signInForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const playerName = document.getElementById('playerName').value.trim();
        if (playerName) {
            addPlayerToFirebase(playerName);
            document.getElementById('playerName').value = ''; // Clear the input field
        }
    });

    const clearPlayersButton = document.getElementById('clearPlayers');
    clearPlayersButton.addEventListener('click', () => {
        clearPlayersFromFirebase();
    });
});
