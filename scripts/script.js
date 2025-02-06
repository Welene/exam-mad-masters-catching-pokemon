const log = (msg) => console.log(msg);

let errorMsg = document.createElement(`p`);
errorMsg.id = `errorMsg`;
errorMsg.style.color = `red`;
errorMsg.style.fontWeight = `600`;
errorMsg.style.fontStyle = `italic`; //----------------------------------------------ENDRET TIL (bold) + (italic), kan ta bort også

const submitBtnRef = document.querySelector(`#submitBtn`);
submitBtnRef.insertAdjacentElement("afterend", errorMsg);

function validateForm(event) {
  oGameData.trainerName = document.querySelector(`#nick`).value;
  oGameData.trainerAge = document.querySelector(`#age`).value;
  log(oGameData.trainerName.length);
  log(oGameData.trainerAge);

  try {
    if (oGameData.trainerName.length < 5) {
      throw new Error(
        `Your IRL name cannot possibly be that short... change name.`
      );
    } else if (oGameData.trainerName.length > 10) {
      throw new Error(
        `Seriously? that name is way too long! Get a shorter one.`
      );
    } else {
      log(errorMsg.textContent);
      errorMsg.textContent = "";
    }

    if (oGameData.trainerAge < 10) {
      throw new Error(
        `You're too young for this... wait a few years and try again.`
      );
    } else if (oGameData.trainerAge > 15) {
      throw new Error(
        `You are way too old for Pokémon! (for legal reasons... that was a joke)`
      );
    } else {
      log(errorMsg.textContent);
      errorMsg.textContent = "";
    }

    const genderRadios = document.querySelectorAll(`input[name="gender"]`);

    let isSelected = false;

    for (let radio of genderRadios) {
      if (radio.checked) {
        isSelected = true;
        oGameData.trainerGender = radio.id;
        log(radio.id);
        break;
      }
    }
    if (!isSelected) {
      throw new Error(`In this game you have to be either a boy or a girl`);
    }
    errorMsg.textContent = ``;

    initiateGame();

    event.preventDefault();
  } catch (error) {
    errorMsg.textContent = error.message;
    log(error.message);
    event.preventDefault();
  }
}

document.querySelector(`#form`).addEventListener(`submit`, validateForm);

const audioRef = document.querySelector(`audio`);

let isPlaying = true;

function startMusic() {
  audioRef.play();
  log(`Musiken spelar`);
}

function stopMusic() {
  audioRef.pause();
  log(`Musiken är pausad`);
}

let musicBtn = document.createElement(`button`);
musicBtn.id = `music-btn`;
musicBtn.classList = `music-btn`;
musicBtn.textContent = String.fromCodePoint(0x266b);

// document.querySelector(`#gameField`).classList.remove(`d-none`);
document.querySelector(`#gameField`).appendChild(musicBtn);

function toggleMusic() {
  if (isPlaying) {
    stopMusic();
  } else {
    startMusic();
  }

  isPlaying = !isPlaying;

  musicBtn.textContent = isPlaying
    ? String.fromCodePoint(0x266b)
    : String.fromCodePoint(0x23f8);
}

musicBtn.addEventListener(`click`, toggleMusic);

function initiateGame() {
  // bytte bakgrunnsbilde med et annet
  // document.querySelector(`#form`).classList.add(`d-none`); // FEIL: --> tar bort bare form, wrapperen står kvar.
  document.querySelector(`.form-wrapper`).classList.add(`d-none`); // TAR BORT BÅDE (form) OG (form-wrapper) - ALT GJEMMES
  document.querySelector(`#gameField`).classList.remove(`d-none`); // Annelie behöver remove(d-none)
  musicBtn.classList.remove(`d-none`);

  document.body.style.backgroundImage = "url('../assets/arena-background.png')"; // BYTTER UT BACKGRUNNSBILDE
  oGameData.startTimeInMilliseconds(); // Start timer
  startMusic();
  createPokemons();
  movePokemons();
}

const numPokemons = 10;
const gameField = document.querySelector(`#gameField`);
const pokemons = [];

const pokeballImg = document.createElement(`img`);
pokeballImg.src = `./assets/ball.webp`;
pokeballImg.alt = `Pokemonboll`;

function randomPokemonImg(allImages, numImages) {
  let selectedImages = [];

  while (selectedImages.length < numImages) {
    let randomNum = Math.floor(Math.random() * allImages) + 1; //Spara ett slumpat värde i randomNum mellan 1 och 151
    let formatedNum = randomNum.toString().padStart(3, `0`);
    //Våra bilder har alltid nollor framför namnet.
    // Det vill vi skapa. padstart 3 innebär att det alltid ska vara tre siffror
    let pokemonSrc = `./assets/pokemons/${formatedNum}.png`;
    if (!selectedImages.includes(pokemonSrc)) {
      selectedImages.push(pokemonSrc);
      // index.push(formatedNum);
    }
  }
  return selectedImages;
}

let randomImg = randomPokemonImg(151, numPokemons);
log(randomImg);

function createPokemons() {
  for (let i = 0; i < numPokemons; i++) {
    const pokemon = document.createElement(`img`);
    pokemon.dataset.id = randomImg[i];
    pokemon.src = randomImg[i];
    pokemon.classList.add(`pokemon`);
    pokemon.style.left = oGameData.getLeftPosition();
    pokemon.style.top = oGameData.getTopPosition();

    //Lägg till function för att fånga pokemon, catchPokemon?
    pokemon.addEventListener(`mouseenter`, catchPokemon); // --- ---------- MADE catchPokemon + togglePokeball FUNCTION: line: 195.
    // ---------------------------------------------------------------------Haven't checked if how to remove catchPokemon code from within createPokemons.
    gameField.appendChild(pokemon);
    pokemons.push(pokemon);
  }
  movePokemons();
}

function movePokemons() {
  let allPokemons = document.querySelectorAll(".pokemon"); // Select all Pokémon images

  allPokemons.forEach((pokemon) => {
    let newLeft = oGameData.getLeftPosition();
    let newTop = oGameData.getTopPosition();

    pokemon.style.left = `${newLeft}px`; // Moves Pokémon horizontally
    pokemon.style.top = `${newTop}px`; // Moves Pokémon vertically
  });
}

// Move Pokémon every 3 seconds
oGameData.time = setInterval(movePokemons, 3000);

function togglePokeball(hoveredImage) {
  if (hoveredImage.src.includes("ball.webp")) {
    hoveredImage.src = hoveredImage.dataset.id;
    hoveredImage.removeEventListener("mouseenter", togglePokeball);
    oGameData.nmbrOfCaughtPokemons--;
  } else {
    hoveredImage.src = "./assets/ball.webp";
    hoveredImage.removeEventListener("mouseleave", togglePokeball);
    oGameData.nmbrOfCaughtPokemons++;
  }
  log(oGameData.nmbrOfCaughtPokemons);

  if (oGameData.nmbrOfCaughtPokemons === 10) {
    log(`Grattis!`);
    endGame();
  } // skapa endGame function
}

function catchPokemon(event) {
  togglePokeball(event.target);
}

function endGame() {
  clearInterval(oGameData.timerId);
  stopMusic();
  musicBtn.classList.add(`d-none`);
  log("Game Over! All Pokémon are caught!");
  document
    .querySelectorAll(`#gameField img`)
    .forEach((img) => img.classList.add(`d-none`));
  oGameData.endTimeInMilliseconds();
  oGameData.endTime = oGameData.nmbrOfMilliseconds() / 1000;

  let congrat = document.querySelector(`#congrat`);
  congrat.textContent = `🎉 Congratulations, ${oGameData.trainerName}! 🎉`;
  let winMsg = document.querySelector(`#winMsg`);
  winMsg.textContent = `You caught all Pokémon in ${oGameData.endTime.toFixed(
    2
  )} seconds!`;
  document.querySelector(`#highScore`).classList.remove(`d-none`);

  let finaleMusic = document.createElement(`audio`);
  document.querySelector(`#gameField`).appendChild(finaleMusic);
  finaleMusic.src = `./assets/winMusic.mp3`;
  finaleMusic.play();
  scoreBoard(); // anropa funtionen för att det ska fungera
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------

// TLDR - vad gör funktionen;

// 1) funktionen hämtar timeTaken från endGame(); med (localStorage.getItem).
// 2) använder name & age values från HTML-inputs sparat i variabler
// 3) skapar et objekt/key med values: name, age & time inuti
// 4) anroper scoreBoard funktionen för att fungera

// 5) bara synlig under "application" i inspektera
// 6) visar namnet spelaren har skrevet inuti input, efter hen har vunnit (fordi det är sparat och sen hämtas from local storage)

// 7) PROBLEM: Förra rundans tid sätts på spelaren ("player"), nuvarande runda sätts inte på spelaren ("player"),
// men på "timeTaken" enbart, AKA --> kopplas inte till "player" i local storage, bara "time taken"

function scoreBoard() {
  let highscores = JSON.parse(localStorage.getItem(`highscores`)) || [];

  highscores.push({
    name: oGameData.trainerName,
    age: oGameData.trainerAge,
    gender: oGameData.trainerGender,
    time: oGameData.endTime.toFixed(2),
  });

  highscores.sort((a, b) => a.time - b.time);

  if (highscores.length > 10) {
    highscores.pop();
  }

  localStorage.setItem("highscores", JSON.stringify(highscores));

  // document.querySelector("#submitBtn").addEventListener("click", function() { // klikkar på knappen = localStorage.setItem händer, inputs sparas ner
  // variabler för name, age & time used // används som "Value" i Local Storage, kolla rad 241
  // listRef.textContent = "";

  let listRef = document.querySelector("#highscoreList");
  document.querySelectorAll("#highscoreList li").forEach((li) => li.remove());

  for (let score of highscores) {
    let listItemRef = document.createElement("li");
    listItemRef.classList.add(`highscore__listitem`);
    listItemRef.textContent = `${score.name} 
      ${score.age},
      ${score.gender},
      ${score.time}`;
    listRef.appendChild(listItemRef);
  }
}

// visar namnet på spelarens NAME-INPUT efter spelet er klart.

// ----------------------------------------------------------------------------------------------------------------------------------------------------
document.querySelector(`#playAgainBtn`).addEventListener(`click`, restartGame);

function restartGame() {
  // fungerar inte just nu?
  document.body.style.backgroundImage = "url('../assets/background.png')";
  oGameData.init();
  gameField.classList.add(`d-none`);

  document.querySelectorAll(".pokemon").forEach((pokemon) => pokemon.remove());
  pokemons.length = 0;

  document.querySelector(`#highScore`).classList.add(`d-none`);
  document.querySelector(`#formWrapper`).classList.remove(`d-none`);
}
