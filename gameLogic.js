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

document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var playerName = document.getElementById('playerName').value;
    addPlayerToFirebase(playerName);
});

function addPlayerToFirebase(name) {
    // Write to Firebase
    const playerRef = ref(database, 'players/');
    const newPlayerRef = push(playerRef);
    set(newPlayerRef, { name: name });
}

// Listen for changes in the players list
onValue(ref(database, 'players/'), function(snapshot) {
    updatePlayerList(snapshot.val());
});



function updatePlayerList(players) {
    // Clear existing list
    var playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    // Add each player to the list
    for (var key in players) {
        if (players.hasOwnProperty(key)) {
            var li = document.createElement('li');
            li.textContent = players[key].name;
            playerList.appendChild(li);
        }
    }

    // Check player count and show the waiting area
    checkPlayerCount();
    showWaitingArea();
}

function checkPlayerCount() {
    var players = document.getElementById('playerList').children.length;
    if (players >= 4) {
        document.getElementById('enterGame').disabled = false;
    }
}

// Show waiting area and hide sign-in form
function showWaitingArea() {
    document.getElementById('waitingArea').style.display = 'block';
    document.getElementById('signInArea').style.display = 'none';
}

