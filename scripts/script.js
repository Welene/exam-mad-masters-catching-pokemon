const log = (msg) => console.log(msg);



// Användaren startar vid ett formulär och ni skall formulärvalidera följande
// --- Tränarens namn måste vara mellan 5 och 10 tecken långt
// --- Tränaren måste vara mellan 10 och 15 år gammal
// --- Tränaren måste ha bockat i om hen är en pojke eller en flicka

// let oGameData = {};
// log(oGameData);

// function initGlobalObject() {
//     oGameData.trainerName = document.querySelector(`#nick`);
//     oGameData.trainerAge = Parseint(document.querySelector(`#age`));

//     oGameData.timeRef = document.querySelector(`#errorMsg`);
//     oGameData.querySelector('#form');
// }   


let errorMsg = document.createElement(`p`);
errorMsg.id = `errorMsg`;
errorMsg.style.color = `red`;

const submitBtnRef = document.querySelector(`#submitBtn`);
    submitBtnRef.insertAdjacentElement("afterend", errorMsg);

function validateForm(event) {
    oGameData.trainerName = document.querySelector (`#nick`).value;
    oGameData.trainerAge = document.querySelector (`#age`).value;
    log(oGameData.trainerName.length);
    log(oGameData.trainerAge);

    try {
    if(oGameData.trainerName.length < 5) {
        throw new Error (`Your IRL name cannot possibly be that short... change name.`);
        
    } else if (oGameData.trainerName.length > 10) {
        throw new Error (`Seriously? that name is way too long! Get a shorter one.`);
    } else {
        log(errorMsg.textContent);
        errorMsg.textContent = '';
    }


    if(oGameData.trainerAge < 10) {
        throw new Error (`You're too young for this... wait a few years and try again.`);
        
    } else if (oGameData.trainerAge > 15) {
        throw new Error (`You are way too old for Pokémon! (for legal reasons... that was a joke)`);
    } else {
        log(errorMsg.textContent);
        errorMsg.textContent = '';
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
    throw new Error(`Du måste välja pojke eller flicka`);
    }
    errorMsg.textContent = ``;
} catch (error) {
    errorMsg.textContent = error.message;
    log(error.message);
    event.preventDefault();
    }
}

document.querySelector(`#form`).addEventListener(`submit`, validateForm);
