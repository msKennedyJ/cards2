
// Game settings
const TOTAL_CARDS = 10;

// Game variables
let deck = [];
let currentCard = null;
let cardsRevealed = 0;
let gameOver = false;

// Audio
let audioContext = null;


// Create audio context when needed
function getAudioContext() {
    if (!audioContext) {
        audioContext = new (
            window.AudioContext || window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;
}


// Correct-answer sound
function playCorrectSound() {
    const audio = getAudioContext();
    const now = audio.currentTime;

    [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const volume = audio.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
            frequency,
            now + index * 0.09
        );

        volume.gain.setValueAtTime(0.0001, now + index * 0.09);
        volume.gain.exponentialRampToValueAtTime(
            0.12,
            now + index * 0.09 + 0.02
        );
        volume.gain.exponentialRampToValueAtTime(
            0.0001,
            now + index * 0.09 + 0.22
        );

        oscillator.connect(volume);
        volume.connect(audio.destination);

        oscillator.start(now + index * 0.09);
        oscillator.stop(now + index * 0.09 + 0.23);
    });
}


// Losing sound
function playLoseSound() {
    const audio = getAudioContext();
    const now = audio.currentTime;

    const oscillator = audio.createOscillator();
    const volume = audio.createGain();

    oscillator.type = "triangle";

    oscillator.frequency.setValueAtTime(330, now);
    oscillator.frequency.exponentialRampToValueAtTime(
        165,
        now + 0.65
    );

    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.15, now + 0.04);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

    oscillator.connect(volume);
    volume.connect(audio.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.8);
}

// Celebratory victory sound
function playWinSound() {
    const audio = getAudioContext();
    const now = audio.currentTime;

    // A little victory melody
    const notes = [523.25, 659.25, 783.99, 1046.50];

    notes.forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const volume = audio.createGain();

        const start = now + index * 0.16;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, start);

        volume.gain.setValueAtTime(0.0001, start);
        volume.gain.exponentialRampToValueAtTime(0.15, start + 0.03);
        volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

        oscillator.connect(volume);
        volume.connect(audio.destination);

        oscillator.start(start);
        oscillator.stop(start + 0.46);
    });
}


// Create falling confetti
function launchConfetti() {
    const colours = [
        "#facc15",
        "#ef4444",
        "#3b82f6",
        "#22c55e",
        "#ec4899",
        "#a855f7",
        "#ffffff"
    ];

    for (let i = 0; i < 120; i++) {
        const piece = document.createElement("div");

        piece.className = "confetti";

        piece.style.left = Math.random() * 100 + "vw";
        piece.style.backgroundColor =
            colours[Math.floor(Math.random() * colours.length)];

        piece.style.animationDuration =
            (2.5 + Math.random() * 2) + "s";

        piece.style.animationDelay =
            Math.random() * 1.5 + "s";

        piece.style.width =
            (6 + Math.random() * 8) + "px";

        piece.style.height =
            (8 + Math.random() * 12) + "px";

        document.body.appendChild(piece);

        // Remove the confetti after its animation
        setTimeout(() => {
            piece.remove();
        }, 5000);
    }
}


// Create a standard 52-card deck
function createDeck() {
    const suits = [
        { name: "Hearts", symbol: "♥", colour: "red" },
        { name: "Diamonds", symbol: "♦", colour: "red" },
        { name: "Clubs", symbol: "♣", colour: "black" },
        { name: "Spades", symbol: "♠", colour: "black" }
    ];

    const ranks = [
        { name: "A", value: 1 },
        { name: "2", value: 2 },
        { name: "3", value: 3 },
        { name: "4", value: 4 },
        { name: "5", value: 5 },
        { name: "6", value: 6 },
        { name: "7", value: 7 },
        { name: "8", value: 8 },
        { name: "9", value: 9 },
        { name: "10", value: 10 },
        { name: "J", value: 11 },
        { name: "Q", value: 12 },
        { name: "K", value: 13 }
    ];

    const newDeck = [];

    for (let suit of suits) {
        for (let rank of ranks) {
            newDeck.push({
                suit: suit.name,
                symbol: suit.symbol,
                colour: suit.colour,
                name: rank.name,
                value: rank.value
            });
        }
    }

    // Shuffle the deck
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [newDeck[i], newDeck[j]] =
            [newDeck[j], newDeck[i]];
    }

    return newDeck;
}


// Create ten card spaces
function createCardSlots() {
    const cardsRow = document.getElementById("cardsRow");

    cardsRow.innerHTML = "";

    for (let i = 0; i < TOTAL_CARDS; i++) {
        const card = document.createElement("div");

        card.className = "card";
        card.id = `card-${i}`;

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-back"></div>

                <div class="card-front"></div>

            </div>
        `;

        cardsRow.appendChild(card);
    }
}


// Display and flip a card
function displayCard(card, position) {
    const cardElement = document.getElementById(`card-${position}`);
    const cardFront = cardElement.querySelector(".card-front");

    cardFront.className = `card-front ${card.colour}`;

    cardFront.innerHTML = `
        <div class="card-corner top">
            <span>${card.name}</span>
            <span>${card.symbol}</span>
        </div>

        <span class="card-center">${card.symbol}</span>

        <div class="card-corner bottom">
            <span>${card.name}</span>
            <span>${card.symbol}</span>
        </div>
    `;

    // Trigger the flip animation
    cardElement.classList.add("flipped");
}


// Start or restart the game
function startGame() {
    deck = createDeck();

    cardsRevealed = 0;
    gameOver = false;

    createCardSlots();

    // Deal the first card
    currentCard = deck.pop();

    displayCard(currentCard, 0);

    cardsRevealed = 1;

    document.getElementById("message").textContent =
        "Will the next card be higher or lower?";

    updateScore();

    document.getElementById("higher").disabled = false;
    document.getElementById("lower").disabled = false;

    document.getElementById("playAgain").style.display = "none";
}


// Make a higher or lower guess
function makeGuess(guess) {
    if (gameOver || cardsRevealed >= TOTAL_CARDS) {
        return;
    }

    const nextCard = deck.pop();

    // Reveal and flip the next card
    displayCard(nextCard, cardsRevealed);

    cardsRevealed++;

    // Check the guess
    if (nextCard.value === currentCard.value) {
        document.getElementById("message").textContent =
            "Same value! You continue!";

        playCorrectSound();
    }

    else if (
        guess === "higher" &&
        nextCard.value > currentCard.value
    ) {
        document.getElementById("message").textContent =
            "Correct! The card is higher!";

        playCorrectSound();
    }

    else if (
        guess === "lower" &&
        nextCard.value < currentCard.value
    ) {
        document.getElementById("message").textContent =
            "Correct! The card is lower!";

        playCorrectSound();
    }

    else {
        document.getElementById("message").textContent =
            "Wrong guess! Game over!";

        playLoseSound();

        currentCard = nextCard;

        updateScore();
        endGame();

        return;
    }

    currentCard = nextCard;

    updateScore();

    // Check whether all ten cards have been revealed
    if (cardsRevealed === TOTAL_CARDS) {
        document.getElementById("message").textContent =
            "Amazing! You revealed all 10 cards!";

        endGame();
    }
}


// Update score
function updateScore() {
    document.getElementById("score").textContent =
        `Cards revealed: ${cardsRevealed} / ${TOTAL_CARDS}`;
}


// End game
function endGame() {
    gameOver = true;

    document.getElementById("higher").disabled = true;
    document.getElementById("lower").disabled = true;

    document.getElementById("playAgain").style.display = "block";
}


// Start game when page loads
startGame();
