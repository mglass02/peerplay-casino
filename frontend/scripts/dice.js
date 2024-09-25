document.addEventListener('DOMContentLoaded', function () {
    const rollButton = document.getElementById('rollDice');
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    const diceResult = document.getElementById('diceResult');
    const guessInput = document.getElementById('guess');
    const gameCostButtons = document.querySelectorAll('.game-cost');
    let selectedAmount = null; // To store the selected betting amount

    // Function to handle the amount selection
    gameCostButtons.forEach(button => {
        button.addEventListener('click', function () {
            selectedAmount = parseInt(this.getAttribute('data-amount'));
            diceResult.textContent = `You chose to play with £${selectedAmount}. Now, guess the dice sum!`;
            guessInput.disabled = false; // Enable guess input after selecting amount
            rollButton.disabled = false; // Enable the roll button after selecting amount
        });
    });

    // Function to roll the dice
    function rollDice() {
        const rollingDuration = 1500; // Duration for dice rolling effect
        const dice1Value = Math.floor(Math.random() * 6) + 1;
        const dice2Value = Math.floor(Math.random() * 6) + 1;
        const total = dice1Value + dice2Value;

        const userGuess = parseInt(guessInput.value); // Get user's guess as a number

        // Check if the user entered a valid guess
        if (isNaN(userGuess) || userGuess < 2 || userGuess > 12) {
            diceResult.textContent = 'Please enter a valid guess between 2 and 12.';
            return;
        }

        // Animate dice roll (spin effect)
        let rollInterval = setInterval(() => {
            dice1.textContent = getDiceFace(Math.floor(Math.random() * 6) + 1);
            dice2.textContent = getDiceFace(Math.floor(Math.random() * 6) + 1);
        }, 100); // Change faces every 100ms to simulate rolling

        // Stop the rolling after the specified duration
        setTimeout(() => {
            clearInterval(rollInterval);
            dice1.textContent = getDiceFace(dice1Value);
            dice2.textContent = getDiceFace(dice2Value);
            
            // Display the result
            diceResult.textContent = `You rolled a ${total}!`;

            // Check if the user's guess was correct
            if (userGuess === total) {
                const winnings = selectedAmount * 3;
                diceResult.textContent += ` Winner! You win £${winnings}!`;
            } else {
                diceResult.textContent += ' You lose!';
            }

            // Reset guess input and disable rolling until a new amount is chosen
            guessInput.disabled = true;
            rollButton.disabled = true;
            guessInput.value = ''; // Clear the guess input field
        }, rollingDuration);
    }

    // Function to return dice face based on number
    function getDiceFace(value) {
        switch (value) {
            case 1: return '⚀';
            case 2: return '⚁';
            case 3: return '⚂';
            case 4: return '⚃';
            case 5: return '⚄';
            case 6: return '⚅';
            default: return '⚀';
        }
    }

    // Add event listener to the roll button
    rollButton.addEventListener('click', rollDice);
});
