const startPage = document.querySelector('.js-startPage');
const gamePage = document.querySelector('.js-gamePage');
const endPage = document.querySelector('.js-endPage');
const startBtn = document.querySelectorAll('.js-startBtn');
const numArr = document.querySelectorAll('.js-num');
const symbolArea = document.querySelector('.js-symbol');
const question = document.querySelector('.js-gameArea');
const answer = document.querySelector('.js-gameArea input');
const timeTxt = document.querySelector('.js-time');
const score = document.querySelector('.js-score');
const finalScore = document.querySelector('.js-finalScore');

let totalTime = 60;
const symbolArr = ['+', '−', '×', '÷'];
let value;
let totalScore = 0;
let gameLv;

//按下開始按鈕到gamePage頁
startBtn.forEach((item, index) => {
  item.addEventListener('click', () => {
    switch (index) {
      //開始頁按鈕
      case 0:
        startPage.setAttribute('class', 'js-startPage startPage d-none');
        break;
      case 1:
        endPage.setAttribute('class', 'js-endPage endPage d-none');
        break;
    }
    gamePage.setAttribute('class', 'js-gamePage gamePage');
    resetGame();
    gameStart();
  })
})

//倒數計時
function reciprocal() {
  setInterval(() => {
    totalTime--;
    timeTxt.textContent = `00 : ${totalTime < 10 ? '0' + totalTime : totalTime}`;
    switch (totalTime) {
      case 0:
        gamePage.setAttribute('class', 'js-gamePage gamePage d-none');
        endPage.setAttribute('class', 'js-endPage endPage');
        finalScore.textContent = totalScore;
        break;
    }
  }, 1000)
}
reciprocal();

//根據遊戲進程隨機更換算式
function gameStart() {
  let numA;
  let numB;
  let totalNum;
  let delNum;
  question.setAttribute('class', 'js-gameArea gameArea fs-112');
    answer.setAttribute('class', 'answer fs-112');
  if (totalTime > 40) {
    delNum = 0;
    totalNum = 9;
    gameLv = 1;
  } else if (totalTime <= 40 && totalTime > 20) {
    delNum = 10;
    totalNum = 99 - delNum;
    gameLv = 2;
  } else if (totalTime <= 20) {
    delNum = 100;
    totalNum = 999 - delNum;
    gameLv = 3;
    question.setAttribute('class', 'js-gameArea gameArea fs-95');
    answer.setAttribute('class', 'answer fs-70');
  }
  //第一個數字
  numA = random(totalNum) + delNum;
  numArr[0].textContent = numA;
  //運算符號
  let symbol;
  switch (numA) {
    case 0:
      symbol = random(1);
      switch (symbol) {
        case 1:
          symbol = 2;
          break;
      }
      symbolArea.textContent = symbolArr[symbol];
      break;
    default:
      symbol = random(3);
      symbolArea.textContent = symbolArr[symbol];
      break;
  }
  //第二個數字
  switch (symbol) {
    //當為除法時，第一個數字一定會被第二個整除(篩出符合位數的因數)
    case 3:
      let factorArr = getAllFactor(numA).filter((item) => {
        return item >= delNum;
      });
      numB = factorArr[random(factorArr.length-1)];
      break;
    case 1:
      numB = random(numA - delNum) + delNum;
      break;
    default:
      numB = random(totalNum) + delNum;
      break;
  }
  numArr[1].textContent = numB;
  value = calc(numA, numB, symbol);
}

//輸入答案換題目，並計算分數
answer.addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 13:
      switch (parseInt(answer.value)) {
        case value:
          console.log('答對');
          switch (gameLv) {
            case 1:
            case 2:
              totalScore += 1;
              break;
            case 3:
              totalScore += 5;
          break;
          }
        break;
        default:
          console.log(totalScore);
          if (totalScore > 0) {
            totalScore--;
          }
          break;
      }
      if (totalScore < 10) {
        scoreTxt = '00' + totalScore;
      } else if (totalScore >= 10 && totalScore <100) {
        scoreTxt = '0' + totalScore;
      } else {
        scoreTxt = totalScore;
      }
      score.textContent = scoreTxt;
      answer.value = '';
      gameStart();
      break;
  }
})

//隨機產生1個1~num的數字(num為最大數字)
function random(num) {
  let randomData = Math.random();
  return Math.round(randomData * num);
}

//找所有因數
function getAllFactor(num) {
  let factorArr = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) {
      factorArr.push(i);
    }
  }
  return factorArr;
}

//計算答案
function calc(numA, numB, symbol) {
  let calcValue;
  if (symbol === 0) {
    calcValue = numA + numB;
  } else if (symbol === 1) {
    calcValue = numA - numB;
  } else if (symbol === 2) {
    calcValue = numA * numB;
  } else if (symbol === 3) {
    calcValue = numA / numB;
  }
  return calcValue;
}

function resetGame() {
  totalTime = 60;
  value = 0;
  totalScore = 0;
  gameLv = 0;
  answer.value = '';
  timeTxt.textContent = `01 : 00`;
  score.textContent = '000';
}