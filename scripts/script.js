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
        break;
      }
    }
    if (!isSelected) {
      throw new Error(`In this game you have to be either a boy or a girl`);
    }
    errorMsg.textContent = ``;

    initiateGame(); // ----------------------------------------------- ANROPER (InitiateGame) HER - ETTER (form) ER KONTROLLERT

    event.preventDefault(); // --------------------------------------- FLYTTET (preventDefault) UT FRA (catch) -  sånn at den ikke
    // ----------------------------------------------------------------bare unngår å refreshe når ting er feil,
    //---------------------------------------------------------------- men også unngår å refreshe når alt er rett
  } catch (error) {
    errorMsg.textContent = error.message;
    log(error.message);
    event.preventDefault();
  }
}

document.querySelector(`#form`).addEventListener(`submit`, validateForm);

function initiateGame() {
  // bytte bakgrunnsbilde med et annet
  // document.querySelector(`#form`).classList.add(`d-none`); // FEIL: --> tar bort bare form, wrapperen står kvar.
  document.querySelector(`.form-wrapper`).classList.add(`d-none`); // TAR BORT BÅDE (form) OG (form-wrapper) - ALT GJEMMES
  document.querySelector(`#gameField`).classList.remove(`d-none`); // Annelie behöver remove(d-none)

  document.body.style.backgroundImage = "url('../assets/arena-background.png')"; // BYTTER UT BACKGRUNNSBILDE

  // startMusic();
  createPokemons();
  movePokemons();
}

const numPokemons = 10;
const gameField = document.querySelector(`#gameField`);
const pokemons = [];

const pokeballImg = document.createElement(`img`);
pokeballImg.src = `./assets/ball.webp`;
pokeballImg.alt = `Pokemonboll`;

// skapa function RandomPokemonImg för att spara src för jpg i variabeln randomImg.
// Tar emot parametrar om totalt antal pokemons och antalet vi vill ha.
//  finns variabel numPokemons sparad för detta med värdet 10

function randomPokemonImg(allImages, numImages) {
  let selectedImages = [];

  while (selectedImages.length < numImages) {
    let randomNum = Math.floor(Math.random() * allImages) + 1; //Spara ett slumpat värde i randomNum mellan 1 och 151
    let formatedNum = randomNum.toString().padStart(3, `0`);
    //Våra bilder har alltid nollor framför namnet.
    // Det vill vi skapa. padstart 3 innebär att det alltid ska vara tre siffror
    selectedImages.push(`./assets/pokemons/${formatedNum}.png`);
  }
  return selectedImages;
}

let randomImg = randomPokemonImg(151, numPokemons);
log(randomImg);

// let randomImg = [`Bulbasaur`,`Pikachu`, `Charmander`, `Mr Mime`, `Ponyta`, `Piplup`, `Psyduck`, `Rapidash`, `Squirtle`, `Ratata`];

function createPokemons() {
  for (let i = 0; i < numPokemons; i++) {
    const pokemon = document.createElement(`img`);
    pokemon.src = randomImg[i];
    pokemon.classList.add(`pokemon`);
    pokemon.style.left = oGameData.getLeftPosition();
    pokemon.style.top = oGameData.getTopPosition();

    //Lägg till function för att fånga pokemon, catchPokemon?
    pokemon.addEventListener(`mouseenter`, catchPokemon);
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
setInterval(movePokemons, 3000);

function catchPokemon(event) {
  let randomImg = event.target;
  if (!caughtPokemons.has(img)) {
    // if not caught  catch it...
    caughtPokemons.add(img);
    img.src = "./assets/pokeboll.png"; // change to a ball
    img.removeEventListener("click", releasePokemon);
    oGameData.nmbrOfCaughtPokemons++;
    if (oGameData.nmbrOfCaughtPokemons === 10) endGame();
  }
}
