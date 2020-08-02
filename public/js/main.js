const socket = io();

socket.on("message", (test) => {
  console.log(test);
});

socket.on("test", (test) => {
  console.log("This is from server: " + test);
  checkInput(test);
});

//-------------

const guessForm = document.querySelector("#guess-form");
const guessInput = document.querySelector("#guessInput");

let word = "";
let answer = [];
let guessedLetters = [];
let won;
let remainingLetters;

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let guess = event.target.elements.guessInput.value;

  socket.emit("guessedInput", guess);

  console.log("Sending from Main.js: " + guess);
});

document.querySelector("#playAgainButton").addEventListener("click", () => {
  setUpGame();
});

const checkInput = (guess) => {
  if (!guessedLetters.includes(guess)) {
    guessedLetters.push(guess);

    for (let i = 0; i < word.length; i++) {
      if (word[i] === guess) {
        answer[i] = guess;
        remainingLetters--;
        document.querySelector(
          "#status"
        ).textContent = `Status: ${remainingLetters} letters left`;
      }

      if (remainingLetters === 0) {
        won = true;
      }
    }
  } else {
    document.querySelector(
      "#status"
    ).textContent = `Already guessed this letter! Status: ${remainingLetters} letters left`;
  }

  //console.log(guessedLetters);
  document.querySelector("#currentWord").textContent = answer.join(" ");

  //console.log(answer.join(" "));

  guessInput.value = "";
  guessInput.focus();

  if (won) {
    console.log(answer);
    document.querySelector("#status").textContent = `Status: Won!`;
    document.querySelector("#playAgainButton").style = "display: block";
  }
};

const setUpGame = () => {
  word = "potato";
  answer = [];
  guessedLetters = [];
  won = false;
  remainingLetters = word.length;

  for (let i = 0; i < word.length; i++) {
    answer[i] = "_";
  }

  document.querySelector("#currentWord").textContent = answer.join(" ");
  document.querySelector(
    "#status"
  ).textContent = `Status: ${remainingLetters} letters left`;

  document.querySelector("#playAgainButton").style = "display: none";
};

setUpGame();
