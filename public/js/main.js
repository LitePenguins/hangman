const socket = io();

socket.on("message", (test) => {
  console.log(test);
});

socket.on("test", (test) => {
  console.log("This is from server: " + test);
  checkInput(test);
});

socket.on("hangmanWord", (word) => {
  setUpGame(word);
  document.querySelector("#wordInputSection").style.display = "none";
  document.querySelector("#gameSection").style.display = "block";
});

socket.on("reset", () => {
  document.querySelector("#wordInputSection").style.display = "block";
  document.querySelector("#wordInput").value = "";
  document.querySelector("#gameSection").style.display = "none";
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

document.querySelector("#submitWordButton").addEventListener("click", (e) => {
  e.preventDefault();
  let inputWord = document.querySelector("#wordInput").value;
  socket.emit("hangmanWord", inputWord);
});

document.querySelector("#playAgainButton").addEventListener("click", () => {
  socket.emit("reset", true);
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

const setUpGame = (w) => {
  word = w;
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

// setUpGame();
