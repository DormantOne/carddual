// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let selectedPlayers = new Set();

document.addEventListener('DOMContentLoaded', () => {
    // Start listening to player changes right away
    startListeningToPlayerChanges();

    // Event listener for form submission
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const playerName = document.getElementById('playerName').value;
            addPlayerToFirebase(playerName);
        });
    }

    // Event listener for clearing players
    const clearPlayersButton = document.getElementById('clearPlayers');
    if (clearPlayersButton) {
        clearPlayersButton.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('#playerList input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = false);
            selectedPlayers.clear();
            document.getElementById('startGame').disabled = true;
        });
    }
});

function addPlayerToFirebase(name) {
    const playerRef = ref(database, 'players/');
    const newPlayerRef = push(playerRef);
    set(newPlayerRef, { name: name });
}

function startListeningToPlayerChanges() {
    onValue(ref(database, 'players/'), snapshot => {
        updatePlayerList(snapshot.val());
    });
}

function updatePlayerList(players) {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    for (let key in players) {
        if (players.hasOwnProperty(key)) {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = key;
            checkbox.addEventListener('change', handleCheckboxChange);
            li.appendChild(checkbox);

            const label = document.createElement('label');
            label.htmlFor = key;
            label.textContent = players[key].name;
            li.appendChild(label);

            playerList.appendChild(li);
        }
    }
}

function handleCheckboxChange(event) {
    if (event.target.checked) {
        selectedPlayers.add(event.target.id);
        if (selectedPlayers.size > 4) {
            event.target.checked = false;
            selectedPlayers.delete(event.target.id);
            alert("Only 4 players can be selected!");
        }
    } else {
        selectedPlayers.delete(event.target.id);
    }
    document.getElementById('startGame').disabled = selectedPlayers.size !== 4;
}

function checkPlayerCount() {
    const players = document.getElementById('playerList').children.length;
    if (players >= 4) {
        document.getElementById('enterGame').disabled = false;
    }
}

function showWaitingArea() {
    document.getElementById('waitingArea').style.display = 'block';
    document.getElementById('signInArea').style.display = 'none';
}
