document.addEventListener('DOMContentLoaded', function () {
    const playerCardsElement = document.getElementById('player-cards');
    const dealerCardsElement = document.getElementById('dealer-cards');
    const playerTotalElement = document.getElementById('player-total');
    const dealerTotalElement = document.getElementById('dealer-total');
    const gameStatusElement = document.getElementById('game-status');
    const hitButton = document.getElementById('hit-button');
    const standButton = document.getElementById('stand-button');
    const newGameButton = document.getElementById('new-game-button');

    let playerHand = [];
    let dealerHand = [];
    let deck = [];
    let gameOver = false;

    // Card deck
    function createDeck() {
        const suits = ['♠', '♥', '♣', '♦'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let newDeck = [];
        for (let suit of suits) {
            for (let value of values) {
                newDeck.push({ suit, value });
            }
        }
        return newDeck;
    }

    // Shuffle the deck
    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    // Get card value
    function getCardValue(card) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            return 10;
        } else if (card.value === 'A') {
            return 11;
        } else {
            return parseInt(card.value);
        }
    }

    // Calculate total for a hand
    function calculateHandTotal(hand) {
        let total = hand.reduce((sum, card) => sum + getCardValue(card), 0);
        let aces = hand.filter(card => card.value === 'A').length;
        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }
        return total;
    }

    // Render cards in the DOM
    function renderCards(cards, container) {
        container.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.innerHTML = `${card.value}<br>${card.suit}`;
            container.appendChild(cardElement);
        });
    }

    // Start a new game
    function newGame() {
        deck = createDeck();
        shuffleDeck(deck);
        playerHand = [deck.pop(), deck.pop()];
        dealerHand = [deck.pop(), deck.pop()];
        gameOver = false;

        renderCards(playerHand, playerCardsElement);
        renderCards([dealerHand[0]], dealerCardsElement);
        playerTotalElement.textContent = `Total: ${calculateHandTotal(playerHand)}`;
        dealerTotalElement.textContent = `Total: ?`;

        gameStatusElement.textContent = "Hit or Stand?";
        newGameButton.style.display = "none";
        hitButton.style.display = "inline-block";
        standButton.style.display = "inline-block";
    }

    // Player hits (draws a card)
    function hit() {
        if (!gameOver) {
            playerHand.push(deck.pop());
            renderCards(playerHand, playerCardsElement);
            const playerTotal = calculateHandTotal(playerHand);
            playerTotalElement.textContent = `Total: ${playerTotal}`;

            if (playerTotal > 21) {
                gameOver = true;
                gameStatusElement.textContent = "You busted! Dealer wins.";
                endGame();
            }
        }
    }

    // Player stands (dealer's turn)
    function stand() {
        if (!gameOver) {
            gameOver = true;

            // Reveal dealer's cards
            renderCards(dealerHand, dealerCardsElement);
            let dealerTotal = calculateHandTotal(dealerHand);
            dealerTotalElement.textContent = `Total: ${dealerTotal}`;

            // Dealer must hit until they reach 17 or higher
            while (dealerTotal < 17) {
                dealerHand.push(deck.pop());
                dealerTotal = calculateHandTotal(dealerHand);
                renderCards(dealerHand, dealerCardsElement);
                dealerTotalElement.textContent = `Total: ${dealerTotal}`;
            }

            // Determine winner
            const playerTotal = calculateHandTotal(playerHand);
            if (dealerTotal > 21) {
                gameStatusElement.textContent = "Dealer busted! You win!";
            } else if (playerTotal > dealerTotal) {
                gameStatusElement.textContent = "You win!";
            } else if (playerTotal < dealerTotal) {
                gameStatusElement.textContent = "Dealer wins!";
            } else {
                gameStatusElement.textContent = "It's a tie!";
            }

            endGame();
        }
    }

    // End game
    function endGame() {
        hitButton.style.display = "none";
        standButton.style.display = "none";
        newGameButton.style.display = "inline-block";
    }

    // Event listeners
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
    newGameButton.addEventListener('click', newGame);

    // Start the first game
    newGame();
});
