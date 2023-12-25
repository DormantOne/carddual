document.getElementById('signInForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var playerName = document.getElementById('playerName').value;
    addPlayerToList(playerName);
    checkPlayerCount();
});

function addPlayerToList(name) {
    var li = document.createElement('li');
    li.textContent = name;
    document.getElementById('playerList').appendChild(li);
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
