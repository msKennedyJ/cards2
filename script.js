
// Game settings
const TOTAL_CARDS = 10;

// Game variables
let deck = [];
let currentCard = null;
let cardsRevealed = 0;
let gameOver = false;


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


// Create the ten card spaces
function createCardSlots() {
    const cardsRow = document.getElementById("cardsRow");

    cardsRow.innerHTML = "";

    for (let i = 0; i < TOTAL_CARDS; i++) {
        const card = document.createElement("div");

        card.className = "card card-back";

        // Alternate red and black card backs
        if (i % 2 === 1) {
            card.classList.add("black");
        }

        card.id = `card-${i}`;

        cardsRow.appendChild(card);
    }
}


// Display a revealed card
function displayCard(card, position) {
    const cardElement = document.getElementById(`card-${position}`);

    cardElement.className = `card ${card.colour}`;

    cardElement.innerHTML = `
        <span class="rank">${card.name}</span>
        <span class="suit">${card.symbol}</span>
    `;
}


// Start or restart the game
function startGame() {
    deck = createDeck();

    cardsRevealed = 0;
    gameOver = false;

    // Create ten card spaces
    createCardSlots();

    // Deal the first card
    currentCard = deck.pop();

    displayCard(currentCard, 0);

    cardsRevealed = 1;

    // Reset the game display
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

    // Draw the next card
    const nextCard = deck.pop();

    // Reveal it in the next position
    displayCard(nextCard, cardsRevealed);

    cardsRevealed++;

    // Check the guess
    if (nextCard.value === currentCard.value) {
        document.getElementById("message").textContent =
            "Same value! You continue!";
    }

    else if (
        guess === "higher" &&
        nextCard.value > currentCard.value
    ) {
        document.getElementById("message").textContent =
            "Correct! The card is higher!";
    }

    else if (
        guess === "lower" &&
        nextCard.value < currentCard.value
    ) {
        document.getElementById("message").textContent =
            "Correct! The card is lower!";
    }

    else {
        document.getElementById("message").textContent =
            "Wrong guess! Game over!";

        currentCard = nextCard;

        updateScore();
        endGame();

        return;
    }

    // The newly revealed card becomes the current card
    currentCard = nextCard;

    updateScore();

    // Check whether all ten cards have been revealed
    if (cardsRevealed === TOTAL_CARDS) {
        document.getElementById("message").textContent =
            "Amazing! You revealed all 10 cards!";

        endGame();
    }
}


// Update the score
function updateScore() {
    document.getElementById("score").textContent =
        `Cards revealed: ${cardsRevealed} / ${TOTAL_CARDS}`;
}


// End the game
function endGame() {
    gameOver = true;

    document.getElementById("higher").disabled = true;
    document.getElementById("lower").disabled = true;

    document.getElementById("playAgain").style.display = "block";
}


// Start the game when the page loads
startGame();
