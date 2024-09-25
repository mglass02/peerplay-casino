document.addEventListener('DOMContentLoaded', function () {
    const playerCardsElement = document.getElementById('player-cards');
    const dealerCardsElement = document.getElementById('dealer-cards');
    const playerTotalElement = document.getElementById('player-total');
    const dealerTotalElement = document.getElementById('dealer-total');
    const gameStatusElement = document.getElementById('game-status');
    const hitButton = document.getElementById('hit-button');
    const standButton = document.getElementById('stand-button');
    const newGameButton = document.getElementById('new-game-button');
    const gameCostButtons = document.querySelectorAll('.game-cost');

    let playerHand = [];
    let dealerHand = [];
    let deck = [];
    let gameOver = false;
    let selectedAmount = null; // To store the selected betting amount

    // Disable hit and stand buttons initially
    hitButton.disabled = true;
    standButton.disabled = true;

    // Function to handle the amount selection
    gameCostButtons.forEach(button => {
        button.addEventListener('click', async function () {
            selectedAmount = parseInt(this.getAttribute('data-amount'));
            gameStatusElement.textContent = `You chose to play with £${selectedAmount}. Placing bet...`;
            const paymentSuccess = await handlePayment(selectedAmount);
            if (!paymentSuccess) {
                gameStatusElement.textContent = "Payment failed. Insufficient funds. Please try again.";
                selectedAmount = null; // Reset bet amount
            } else {
                gameStatusElement.textContent = `Bet placed with £${selectedAmount}. Ready to play!`;
                hitButton.disabled = false;  // Enable the hit and stand buttons after bet is placed
                standButton.disabled = false;
                startNewGame();
            }
        });
    });

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
    function startNewGame() {
        deck = createDeck();
        shuffleDeck(deck);
        playerHand = [deck.pop(), deck.pop()];
        dealerHand = [deck.pop(), deck.pop()];
        gameOver = false;

        renderCards(playerHand, playerCardsElement);
        renderCards([dealerHand[0]], dealerCardsElement);
        playerTotalElement.textContent = `Total: ${calculateHandTotal(playerHand)}`;
        dealerTotalElement.textContent = `Total: ?`;

        gameStatusElement.textContent = "Make your move! Hit or Stand?";
        newGameButton.style.display = "none";
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
                gameStatusElement.textContent = "You busted! Dealer wins. Better luck next time.";
                endGame(false, 0);
            }
        }
    }

    // Player stands (dealer's turn)
    async function stand() {
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
            if (dealerTotal > 21 || playerTotal > dealerTotal) {
                const winnings = selectedAmount * 1.5;
                gameStatusElement.textContent = `You win £${winnings.toFixed(2)}! Congratulations!`;
                await handleWinnings(winnings);  // Winnings are 1.5x the amount
                endGame(true, winnings);
            } else if (playerTotal < dealerTotal) {
                gameStatusElement.textContent = `Dealer wins! You lost £${selectedAmount}.`;
                endGame(false, 0);
            } else {
                gameStatusElement.textContent = `It's a tie! You get to keep your £${selectedAmount}.`;
                endGame(false, selectedAmount);  // In case of a tie, no loss or win
            }
        }
    }

    // End game
    function endGame(playerWon, amount) {
        hitButton.disabled = true;  // Disable hit and stand buttons at the end of the game
        standButton.disabled = true;
        newGameButton.style.display = "inline-block";

        if (playerWon) {
            gameStatusElement.textContent += ` You've won £${amount.toFixed(2)}!`;
        } else {
            gameStatusElement.textContent += ` Game over.`;
        }
    }

    // Event listeners
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
    newGameButton.addEventListener('click', startNewGame);

    // Function to handle payment to the casino
    async function handlePayment(amount) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://sprightly-dolphin-5975b2/auth/user/play-game', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount })
            });

            const data = await response.json();
            if (!response.ok) {
                alert(`Payment failed: ${data.message}`);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error processing payment:', error);
            return false;
        }
    }

    // Function to handle winnings transfer to the player
    async function handleWinnings(amount) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://sprightly-dolphin-5975b2/auth/user/win', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount })
            });

            const data = await response.json();
            if (!response.ok) {
                alert(`Winnings transfer failed: ${data.message}`);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error transferring winnings:', error);
            return false;
        }
    }

    // Start the first game (initially disables hit/stand until amount is selected)
    gameStatusElement.textContent = "Please choose an amount to play!";
});
