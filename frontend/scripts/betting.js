// File: /frontend/scripts/betting.js

document.addEventListener('DOMContentLoaded', async () => {
    const fixturesContainer = document.getElementById('fixtures-container');
    const userBalanceElement = document.getElementById('user-balance');
    
    const fixtures = await fetchFixtures();

    fixtures.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.innerHTML = `
            <h2>${match.homeTeam.name} vs ${match.awayTeam.name}</h2>
            <p>Date: ${new Date(match.utcDate).toLocaleString()}</p>
            <button onclick="placeBet('${match.id}', 'homeWin')">Bet Home Win</button>
            <button onclick="placeBet('${match.id}', 'draw')">Bet Draw</button>
            <button onclick="placeBet('${match.id}', 'awayWin')">Bet Away Win</button>
        `;
        fixturesContainer.appendChild(matchElement);
    });
});

async function fetchFixtures() {
    const response = await fetch('https://api.football-data.org/v2/competitions/PL/matches', {
        headers: { 'X-Auth-Token': 'YOUR_API_KEY' }
    });
    const data = await response.json();
    return data.matches;
}

async function placeBet(matchId, betType) {
    const betAmount = prompt('Enter bet amount');
    const odds = 1.5; // Example odds for simplicity

    const response = await fetch('/api/place-bet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, betType, betAmount, odds })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Bet placed successfully!');
        updateBalance(data.user.balance);
    } else {
        alert(data.message);
    }
}

function updateBalance(newBalance) {
    const userBalanceElement = document.getElementById('user-balance');
    userBalanceElement.textContent = newBalance;
}
