// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let playerAdded = false; // Flag to track if the current player has been added

document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var playerName = document.getElementById('playerName').value;
    addPlayerToFirebase(playerName);
    playerAdded = true; // Set flag when player is added
});

function addPlayerToFirebase(name) {
    const playerRef = ref(database, 'players/');
    const newPlayerRef = push(playerRef);
    set(newPlayerRef, { name: name }).then(() => {
        startListeningToPlayerChanges(); // Start listening to Firebase after player is added
    });
}

function startListeningToPlayerChanges() {
    onValue(ref(database, 'players/'), function(snapshot) {
        updatePlayerList(snapshot.val());
    });
}

function updatePlayerList(players) {
    var playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    for (var key in players) {
        if (players.hasOwnProperty(key)) {
            var li = document.createElement('li');
            li.textContent = players[key].name;
            playerList.appendChild(li);
        }
    }

    if (playerAdded) {
        showWaitingArea();
    }
    checkPlayerCount();
}

function checkPlayerCount() {
    var players = document.getElementById('playerList').children.length;
    if (players >= 4) {
        document.getElementById('enterGame').disabled = false;
    }
}

function showWaitingArea() {
    document.getElementById('waitingArea').style.display = 'block';
    document.getElementById('signInArea').style.display = 'none';
}
