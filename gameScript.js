import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase configuration (use the same configuration as your sign-in page)
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

const cards = ['Robot', 'Tiger', 'Mouse', 'Quark'];
const cardValues = { 'Robot': 4, 'Tiger': 3, 'Mouse': 2, 'Quark': 1 };

document.addEventListener('DOMContentLoaded', () => {
    let selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers') || '[]');
    displayPlayerTeamChoices(selectedPlayers);
});

function displayPlayerTeamChoices(players) {
    const playerTeamChoices = document.getElementById('playerTeamChoices');
    players.forEach(player => {
        let playerRow = document.createElement('div');
        playerRow.innerHTML = `
            <span>${player}</span>
            <select class="teamSelect" data-player="${player}">
                <option value="team1">Team 1</option>
                <option value="team2">Team 2</option>
            </select>
        `;
        playerTeamChoices.appendChild(playerRow);
    });
}

document.getElementById('finalizeTeamSelection').addEventListener('click', () => {
    let playerTeams = {};
    document.querySelectorAll('.teamSelect').forEach(select => {
        let playerName = select.getAttribute('data-player');
        let team = select.value;
        playerTeams[playerName] = team;
    });

    // Save the team selections to Firebase
    const teamSelectionRef = ref(database, 'teamSelections/');
    set(teamSelectionRef, playerTeams);

    console.log("Teams have been finalized.");
    startGame(); // Optionally start the game
});

function pickCardsForTeam() {
    return [
        cards[Math.floor(Math.random() * cards.length)], 
        cards[Math.floor(Math.random() * cards.length)]
    ];
}

function displayTeamCards(teamCards, teamId) {
    const teamElement = document.getElementById(teamId);
    teamElement.innerHTML = `Cards: ${teamCards.join(', ')}`;
}

function calculateTeamScore(teamCards, opposingTeamCards) {
    let score = teamCards.reduce((total, card) => total + cardValues[card], 0);
    if (teamCards.includes('Quark') && opposingTeamCards.includes('Robot')) {
        score -= cardValues['Robot'] - 1; 
    }
    return score;
}

function determineWinner(team1Cards, team2Cards) {
    let team1Score = calculateTeamScore(team1Cards, team2Cards);
    let team2Score = calculateTeamScore(team2Cards, team1Cards);

    let result;
    if (team1Score === team2Score) {
        result = team1Score < team2Score ? 'Team 1 Wins with Lower Score' : 'Team 2 Wins with Lower Score';
    } else {
        result = team1Score > team2Score ? 'Team 1 Wins' : 'Team 2 Wins';
    }

    return result;
}

function updateGameResultsInFirebase(winner) {
    const gameResultsRef = ref(database, 'gameResults/');
    set(gameResultsRef, { winner: winner });
}

function startGame() {
    let team1Cards = pickCardsForTeam();
    let team2Cards = pickCardsForTeam();

    displayTeamCards(team1Cards, 'team1');
    displayTeamCards(team2Cards, 'team2');

    let winner = determineWinner(team1Cards, team2Cards);
    document.getElementById('gameResults').textContent = winner;
    updateGameResultsInFirebase(winner);
}

    updateGameResultsInFirebase(winner);
}

document.getElementById('startGame').addEventListener('click', startGame);
