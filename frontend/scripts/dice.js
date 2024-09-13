document.addEventListener('DOMContentLoaded', function () {
    const rollButton = document.getElementById('rollDice');
    const dice1 = document.getElementById('dice1');
    const dice2 = document.getElementById('dice2');
    const diceResult = document.getElementById('diceResult');

    // Function to roll the dice
    function rollDice() {
        const rollingDuration = 1500; // Extend the rolling duration to 1.5 seconds
        const dice1Value = Math.floor(Math.random() * 6) + 1;
        const dice2Value = Math.floor(Math.random() * 6) + 1;
        const total = dice1Value + dice2Value;

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
            diceResult.textContent = `You rolled a ${total}!`;
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
