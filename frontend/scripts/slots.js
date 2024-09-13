const icon_width = 79, 
      icon_height = 79, 
      num_icons = 9, 
      time_per_icon = 100,
      indexes = [0, 0, 0],
      icon_map = ["banana", "seven", "cherry", "plum", "orange", "bell", "bar", "lemon", "watermelon"];

let player_pot = 5;

const roll = (reel, offset = 0) => {
    const delta = (offset + 2) * num_icons + Math.round(Math.random() * num_icons);
    const style = getComputedStyle(reel),
          backgroundPositionY = parseFloat(style["background-position-y"]),
          targetBackgroundPositionY = backgroundPositionY + delta * icon_height,
          normTargetBackgroundPositionY = targetBackgroundPositionY % (num_icons * icon_height);

    return new Promise((resolve) => {
        reel.style.transition = `background-position-y ${8 + delta * time_per_icon}ms`;
        reel.style.backgroundPositionY = `${targetBackgroundPositionY}px`;

        setTimeout(() => {
            reel.style.transition = 'none';
            reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
            resolve(delta % num_icons);
        }, 8 + delta * time_per_icon);
    });
}

function rollAll() {
    const reelsList = document.querySelectorAll('.slots > .reels');
    const playerPotElement = document.getElementById('player-pot');
    const winStatusElement = document.getElementById('win-status');
    const rollButton = document.getElementById('roll-button');
    const depositOptions = document.getElementById('deposit-options');

    // Disable the roll button while spinning
    rollButton.disabled = true;

    // Decrease player pot by 1 for each roll
    player_pot--;
    playerPotElement.textContent = "Player Pot: £" + player_pot;
    winStatusElement.textContent = "Waiting for result...";

    Promise
        .all([...reelsList].map((reels, i) => roll(reels, i)))
        .then((deltas) => {
            deltas.forEach((delta, i) => indexes[i] = (indexes[i] + delta) % num_icons);

            // Check win condition
            let winMessage = 'No win';
            if (indexes[0] == indexes[1] && indexes[1] == indexes[2]) {
                player_pot += 5;
                winMessage = 'JACKPOT';
            } else if (indexes[0] == indexes[1] || indexes[0] == indexes[2] || indexes[1] == indexes[2]) {
                player_pot += 2;
                winMessage = 'Big win';
            }

            // Update the DOM with the current player pot and win status
            playerPotElement.textContent = "Player Pot: £" + player_pot;
            winStatusElement.textContent = winMessage;

            // Check if the player pot reaches 0
            if (player_pot <= 0) {
                player_pot = 0; // Ensure pot doesn't go negative
                playerPotElement.textContent = "Player Pot: £" + player_pot;
                winStatusElement.textContent = "No funds left! Please deposit.";

                // Hide the Roll button and show deposit options
                rollButton.style.display = "none";
                depositOptions.style.display = "block";
            } else {
                // Enable the roll button after rolling completes
                rollButton.disabled = false;
                winStatusElement.textContent = winMessage;
            }
        });
}

// Event listener for deposit buttons
document.querySelectorAll('.deposit-btn').forEach(button => {
    button.addEventListener('click', function() {
        const depositValue = parseInt(this.getAttribute('data-value'), 10);
        player_pot = depositValue; // Set the player's pot to the selected deposit value

        // Update the player pot display
        document.getElementById('player-pot').textContent = "Player Pot: £" + player_pot;
        document.getElementById('win-status').textContent = "Deposit successful! Roll again.";

        // Show the Roll button and hide deposit options
        document.getElementById('roll-button').style.display = "block";
        document.getElementById('deposit-options').style.display = "none";
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Get reference to the roll button
    const rollButton = document.getElementById('roll-button');

    // Attach a click event listener to the roll button
    rollButton.addEventListener('click', function() {
        rollAll();
    });
});
