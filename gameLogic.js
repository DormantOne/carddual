// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set, remove, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let playerAdded = false; // Flag to track if the current player has been added
let selectedPlayers = new Set();

function addPlayerToFirebase(name) {
    const playerRef = ref(database, 'players/');
    const newPlayerRef = push(playerRef);
    set(newPlayerRef, { name: name });
    // Do not call startListeningToPlayerChanges here
}

function startListeningToPlayerChanges() {
    onValue(ref(database, 'players/'), snapshot => {
        updatePlayerList(snapshot.val());
    });
}



function updatePlayerList(players) {
    var playerList = document.getElementById('playerList');
    playerList.innerHTML = '';  // Clear the list before repopulating

    for (var key in players) {
        if (players.hasOwnProperty(key)) {
            var li = document.createElement('li');
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = key;
            checkbox.addEventListener('change', handleCheckboxChange);
            li.appendChild(checkbox);

            var label = document.createElement('label');
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
   // In handleCheckboxChange function
   document.getElementById('enterGame').disabled = selectedPlayers.size !== 4;
}

function checkPlayerCount() {
    var enterGameButton = document.getElementById('enterGame');
    if (enterGameButton) {
        var players = document.getElementById('playerList').children.length;
        enterGameButton.disabled = players < 4;
    } else {
        console.error("Enter Game button not found!");
    }
}





function showWaitingArea() {
    document.getElementById('waitingArea').style.display = 'block';
    document.getElementById('signInArea').style.display = 'none';
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {

       // Ensure startListeningToPlayerChanges is called only once
    startListeningToPlayerChanges();



    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var playerName = document.getElementById('playerName').value;
            addPlayerToFirebase(playerName);
            // Consider clearing the input field here
            document.getElementById('playerName').value = '';
        });
    }

    const clearPlayersButton = document.getElementById('clearPlayers');
    if (clearPlayersButton) {
        clearPlayersButton.addEventListener('click', function() {
            const playersRef = ref(database, 'players/');
            remove(playersRef); // Remove all players from Firebase
    
            // Clear the player list in the UI
            var playerList = document.getElementById('playerList');
            playerList.innerHTML = '';
            // In clearPlayersButton event listener
             document.getElementById('enterGame').disabled = true;
            
        });
    }
  
});




