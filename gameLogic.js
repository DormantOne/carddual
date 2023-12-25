// Initialize Firebase (use your own config here)
firebase.initializeApp(firebaseConfig);

// Reference to your database
var database = firebase.database();

document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var playerName = document.getElementById('playerName').value;
    addPlayerToFirebase(playerName);
});

function addPlayerToFirebase(name) {
    // Write to Firebase
    var playerRef = database.ref('players/');
    var newPlayerRef = playerRef.push();
    newPlayerRef.set({ name: name });

    // No need to call showWaitingArea here, it will be handled in updatePlayerList
}

// Listen for changes in the players list
database.ref('players/').on('value', function(snapshot) {
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
