const WORD_LENGTH = 5;
const guessGrid = document.querySelector("[data-guess-grid]");
const targetWord = "debil";

const keyboard = document.querySelector("data-keyboard");

const FLIP_ANIMATION_DURATION = 500;

const alertContainer = document.querySelector(".alert-container");
console.log(alertContainer);

startInteraction();

function startInteraction() {
    document.addEventListener("click", handleMouseClick);
    document.addEventListener("keydown", handleKeyPress);
}

function stopInteraction() {
    document.removeEventListener("click", handleMouseClick);
    document.removeEventListener("keydown", handleKeyPress);
}

// funkcija koja treba da obradi svaki klik misa
function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
        pressKey(e.target.dataset.key);
        return;
    }

    if (e.target.matches("[data-enter]")) {
        submitGuess();
        return;
    }

    if (e.target.matches("[data-delete]")) {
        deleteKey();
        return;
    }
}

// funkcija koja treba da obradi svaki klik na tastaer na tastaturi
function handleKeyPress(e) {
    if (e.key === "Enter") {
        submitGuess();
        return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
        deleteKey();
        return;
    }

    if (e.key.match(/^[a-z]$/)) {
        pressKey(e.key);
        return;
    }
}

function pressKey(key) {
    const activeTiles = getActiveTiles();
    if (activeTiles.length >= WORD_LENGTH)
        return;
    // hajlajtujemo svaku "plocicu" u koju trenutno upisujemo slovo
    const nextTile = guessGrid.querySelector(":not([data-letter])");
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = "active";
}

// funkcija koja brise 
function deleteKey() {
    const activeTiles = getActiveTiles();
    const lastTile = activeTiles[activeTiles.length - 1];
    if (lastTile == null)
        return
    lastTile.textContent = "";
    delete lastTile.dataset.state;
    delete lastTile.dataset.letter;
}

function submitGuess() {
    // ovo konvertuje niz cvirova tj aktivna polja u niz "[] te zagrade"
    const activeTiles = [...getActiveTiles()];;
    // provjeravamo da li je ukucano 5 slova
    if (activeTiles.length !== WORD_LENGTH) {
        // ukoliko nismo unijeli 5 karaktera treva da prikazemo alert 
        showAlert("Not enough letters");
        // i da zatresemo sva polja koja su popunjena   
        shakeTiles(activeTiles);
        console.log("not long ineaf");
        return;
    }

    // ako je uneseno dovljno slova
    // provjeravamo da li je ova rijec u nasem rijecniku ""

    // uzmemo sva aktivna polja, i napravimo rijec tako sto sastavimo sva slova 
    const guess = activeTiles.reduce((word, tile) => {
        return word + tile.dataset.letter;
    }, "");
    // console.log(activeTiles)
    console.log(guess);

    flipTile(activeTiles);

    // guess je ono sto smo ukucali nasa rijec 

    // ovo iznad nam varca rijec 
    // provjeravmo u uslovu da li rijec postoji u rijecniku
    // ako ne postoji, ponovo ispisujemo alert poruku i tresemo polja
    // showAlert("Not in dictionary");
    // shakeTiles(activeTiles);
    // izlazimo iz funkcije


    // ukoliko je rijec ispravna 
    // zaustavljamo interakciju 
    // "treba da ih bojimo, ali cemo dodati i animaciju"
    // da izgleda kao da ih okrecemo


}

function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]');
}

function showAlert(message, duration = 1000) {
    const alert = document.createElement("div");
    alert.textContent = message;
    alert.classList.add("alert");
    alertContainer.prepend(alert);

    if (duration == null)
        return;

    setTimeout(() => {
        alert.classList.add("hide");
        alert.addEventListener("transitionend", () => {
            alert.remove();
        });
    }, duration);
}

function shakeTiles(tiles) {
    tiles.forEach(tile => {
        tile.classList.add("shake");
        tile.addEventListener("animationend", () => {
            tile.classList.remove("shake");
        }, { once: true });
    });
}

// okrece polja
function flipTile(tiles) {
    // console.log(tiles);
    // console.log(index);  
    // console.log(array);
    // console.log(guess);
    // console.log(tile.dataset.letter);
    // const letter = tile.dataset.letter;
    // console.log(letter);
    // const activeTiles = getActiveTiles();


    tiles.forEach((tile, index) => {
        const letter = tile.dataset.letter;


    setTimeout(() => {
    tile.classList.add("flip");
    }, (index * FLIP_ANIMATION_DURATION) / 2);

    // nakon sto smo okrenuli polja 
    // treba da dodatmo event listener da cim ih okrenemo, 
    // provjerivmo je li dobra rijec, 
    // obojimo bolje
    // uklonimo klasu okrenuto da se vrati nazad ima transition
    // sve ovo ce se desiti jako brzo...
    tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");

        // ukoliko je slovo na mjestu
        if(targetWord[index] === letter){
            tile.dataset.state = "correct";
        }
        
        // ukoliko nije na mjestu je li se nalazi u rijeci?
        else if(targetWord.includes(letter)){
            tile.dataset.state = "wrong-location";   
        }
        else {
            tile.dataset.state = "wrong`";
        }

        // na kraju kada se i izadnje polje vrati na mjesto,
        // evenet listener, nakon sto se izvrsi tranzicija
        // restartujemo interakciju
        // treba da provjerimo za pobjedu
        // samo jednom

        

        // console.log(tile.dataset.letter);
    }, { once: true });


    }); 

    // const key    = keyboard.querySelector(`[data-key='${ letter }"]`);
    // setTimeout(() => {
    // console.log(tile);
    // tile.classList.add("flip");
    // }, (index * FLIP_ANIMATION_DURATION) / 2);
}
