//PROGRESS: 080318 Project Complete functional wise. We can improve design if needed

 /*
  * Display the cards on the page
  *   - shuffle the list of cards using the provided "shuffle" method below
  *   - loop through each card and create its HTML
  *   - add each card's HTML to the page
  */

 // Shuffle function from http://stackoverflow.com/a/2450976
 function shuffle(array) {
     var currentIndex = array.length, temporaryValue, randomIndex;

     while (currentIndex !== 0) {
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex -= 1;
         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
     }

     return array;
 }

//Globals
let clockID;
let time = 0;
let clockOff = true;
const TOTAL_PAIRS = 8; //this is cus we know we can only make 8 pairs in the game
let matchedPairs = 0; //we will increment this under cardMatch fn

function initDisplay() {
  const cardDisp = document.querySelectorAll('.deck li');
  for (cards of cardDisp) {
      cards.classList.toggle('open');
      cards.classList.toggle('show');
    };
  setTimeout ( function() {
  for (cards of cardDisp) {
    cards.classList.toggle('open');
    cards.classList.toggle('show');
    };
  }, 3000);
};
initDisplay();

const deck = document.querySelector('.deck');
//function to shuffle cards on refresh
 function shuffleDeck() {
   //const cardsToShuffle = (document.querySelectorAll('.deck li')); creates node list
   //Since shuffle fn needs (array) input we use Array.from() method to creates array from node list
   const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
   //const shuffleCards = document.querySelectorAll('.card'); //just to check if .card works. It doesnt work
   const shuffledCards = shuffle(cardsToShuffle);
   for (card of shuffledCards){
     deck.appendChild(card);  //we are using element.appendChild cus we are appending non-string object
 };                              //if it was string object we can use element.innerHTML as used in addMoves fn
    //console.log('ShuffCards',shuffledCards);
 };
 shuffleDeck();

//MOVES
//Create moves counter fn that will count the no. of Moves player made to complete the Game
//In this game clicking two cards would be considered one move
let movesCtr = 0;
function addMoves() {
  movesCtr++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = movesCtr;
};

//SCORE CARD
//Toggle score card on and off
function toggleModal() {
  const togMod = document.querySelector('.modal_container');
  togMod.classList.toggle('hide');
};
// toggleModal();//open
// toggleModal();//close

//Pull score details into the Modal
function modalGetScore() {
  const modMoves = document.querySelector('.mmoves'); //selecting the element
  const modTimes = document.querySelector('.mtimes');
  const modStars = document.querySelector('.mstars');
  const moveStat = document.querySelector('.moves').innerHTML; //assigning value using innerHTML prop of element storing the reqd value
  const timeStat = document.querySelector('.clock').innerHTML;
  const starStat = document.querySelector('.stars li').innerHTML;
  // const starStat = modalStarsForGetScore();
  modMoves.innerHTML = `Moves:&nbsp&nbsp${moveStat}`;
  modTimes.innerHTML = `Time:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${timeStat}`;
  // modStars.innerHTML = `Rating:&nbsp&nbsp${starStat}`;
  if (movesCtr < 15) {
    modStars.innerHTML = `Rating:&nbsp&nbsp${starStat}&nbsp${starStat}&nbsp${starStat}`;
  }
  else if (movesCtr >= 15 && movesCtr < 25) {
    modStars.innerHTML = `Rating:&nbsp&nbsp${starStat}&nbsp${starStat}`;
  } else {
    modStars.innerHTML = `Rating:&nbsp&nbsp${starStat}`;
  };
};
// modalGetScore();

//Below fn is to properly count stars for display purposes under modalGetScore fn
//if this fn is not written then modalGetScore will only display one star regardless how many are there
//or I used if/else statements as commented above which is more lines of code but displays actual stars instead of a number
// function modalStarsForGetScore() {
//   starCt = document.querySelectorAll('.stars li');
//   ctrStar = 0;
//   for (stars of starCt) {
//     if (stars.style.display !== 'none') {
//       ctrStar++;
//     }
//   }
//   return ctrStar;
// };

//Buttons click event listener
document.querySelector('.mcancel').addEventListener('click', () => {
  toggleModal();
  resetTime();
  resetMoves();
  resetStars();
});

document.querySelector('.mretry').addEventListener('click', replayGame);

document.querySelector('.modal_close').addEventListener('click', () => {
  toggleModal();
  resetTime();
  resetMoves();
  resetStars();
});

//Reset/New Game and End Game functions
function resetGame() {
  resetTime();
  resetMoves();
  resetStars();
  shuffleDeck();
};

function resetTime() {
  stopTime();
  clockOff = true;
  time = 0;
  displayTime();
};

function resetStars() {
  ctrStar = 0;  //in case of using modalStarsForGetScore()
  const starList = document.querySelectorAll('.stars li');
  for (stars of starList) {
    stars.style.display = 'inline';
  };
};

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
};

function resetCards() {
  const cardList = document.querySelectorAll('.deck li');
  for (cards of cardList) {
    cards.className = 'card';
  };
};


function gameOver() { //we will call this under cardMatch fn
    stopTime();
    // resetCards();
    modalGetScore();
    toggleModal();
};

function replayGame() {
  resetGame();
  toggleModal();
  resetCards();
  initDisplay();
};

//STARS
//Create Start fn that will rate the game with 1 2 or 3 STARS
function checkScore() {
  if (movesCtr===15 || movesCtr===25) {
    removeStar();
  };
};
//starRate();

function removeStar() {
  const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
      if (star.style.display !== 'none') { //we are simply using display=none instead of removing it
        star.style.display = 'none';
        break; //this break is necessary else it will remove all stars at once
      };
    };
};
//removeStar();
//removeStar();

//TIMER
//Adding fn to display time in HHMMSS display next to stars from start to end of a game
//This warranted adding a 'clock' element to the HTML file code under score-panel

// let clockID;
// let time = 0;
function startTime() {
  //time=0;
  clockID = setInterval(() => {
    time++;
    displayTime();
    // stopTime();
    //console.log(time);
  },1000);
};
// startTime();

// let clockOff = true;
function timerStart() {
if (clockOff) {
  startTime();
  clockOff=false;
};
};

function displayTime() {
    const clockDisplay = document.querySelector('.clock');
    const secs = Math.floor(time % 60);
    const mins = Math.floor(time / 60);
    const hrs = Math.floor(time / 3600);
    dispsecs = (secs < 10) ? `0${secs}` : `${secs}`;
    dispmins = (mins < 10) ? `0${mins}` : `${mins}`;
    disphrs = (hrs < 10) ? `0${hrs}` : `${hrs}`;
    clockDisplay.innerHTML = `${disphrs}:${dispmins}:${dispsecs}&nbsp&nbsp&nbsp&nbsp`;
};


function stopTime() {
    clearInterval(clockID);
  //clearInterval(clockID); //clearInterval method stops the timer when we pass the setInterval variable to it
};
// stopTime();


 /*
  * Create an array list that holds all of your cards
  */
let toggledCards = [];

 function addToggledCards(clickTarget) {
    toggledCards.push(clickTarget);
 };

function cardMatch() {
  if (toggledCards[0].firstElementChild.className ===
  toggledCards[1].firstElementChild.className) {
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    toggledCards = [];
    matchedPairs++;
    if (matchedPairs == TOTAL_PAIRS) {
      gameOver();
    };
    // alert(toggledCards.length);
  } else {
    setTimeout ( function() {
    toggleShowHide(toggledCards[0]);
    toggleShowHide(toggledCards[1]);
    toggledCards = [];
  }, 1000);
  // alert(toggledCards.length);
};
};


//display the card's symbol
function toggleShowHide(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
};

document.querySelector('.deck').addEventListener('click', e => {
  const clickTarget = e.target;
  timerStart();
  if (clickTarget.classList.contains('card') &&
      !clickTarget.classList.contains('match') && //this checks matched card and will not toggle them
      !toggledCards.includes(clickTarget) &&  //this checks if array alr has the clicked card to avoid b2b click of same cards
      toggledCards.length < 2) { //this checks if array length is 2 or less
    // clickTarget.classList.toggle('open');
    // clickTarget.classList.toggle('show');
    toggleShowHide(clickTarget); //this fn open/closes a card when clicked
    addToggledCards(clickTarget); //adding open card to an array
    if (toggledCards.length === 2) {
        addMoves();
        checkScore();
        cardMatch();
    };
  };
});

$('.restart').click(function (){
  location.reload();
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
