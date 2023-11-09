let $txtInpt1 = document.querySelector('#txtInpt1');
let $btn1 = document.querySelector('#btn1');
let $result = document.querySelector('#result');
let $resultUl = document.querySelector('#result-ul');
let $historyUl = document.querySelector('#history-ul');

/**
 * 무작위로 양의 정수 구하기
 *
 * @param {number} minimum 굴림의 최소값
 * @param {number} range 무작위 굴림의 범위
 * @returns number
 */
function getRandomInt(minimum, range) {
  return Math.floor(Math.random() * range + minimum);
}

function clear(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function appendLi({parent, innerText}) {
  let $li = document.createElement('li');
  $li.innerText = innerText;
  parent.appendChild($li);
}

function drawResult({parent, playResults}) {
  playResults.forEach(ele => appendLi({parent, innerText: `${ele.who}: ${ele.numTxt}`}));
}

function pickWinner(players) {
  let playResults = [];
  for (let i in players) {
    let player = players[i];
    console.debug('player:', player);
    let randomNumber = getRandomInt(0, 100);
    let obj = {
      who: player.trim(),
      num: randomNumber,
      numTxt: String(randomNumber).padStart(2, '0')
    }
    playResults.push(obj);
  }
  let min = playResults.reduce((a, b) => a.num > b.num ? b : a);
  min.numTxt += ' 🥳';
  drawResult({parent: $resultUl, playResults});
  return min;
}

/**
 * 뽑 이력
 * 
 * @returns Object[]
 */
function getWinningHistory() {
  let winningHistory = localStorage.getItem('win-hist');
  if (!winningHistory) {
    return [];
  }
  return JSON.parse(winningHistory);
}

function putWinnerStorage(winner) {
  let winningHistory = getWinningHistory();
  winningHistory.unshift({
    when: new Date().toLocaleString(),
    winner
  });
  winningHistory = cutHistory(winningHistory);
  localStorage.setItem('win-hist', JSON.stringify(winningHistory));
}

function cutHistory(winningHistory) {
  if (winningHistory.length > 100) {
    winningHistory = winningHistory.slice(0, 100);
  }
  return winningHistory;
}

function drawHistory(winningHistory) {
  winningHistory.forEach(ele => appendLi({parent: $historyUl, innerText: `${ele.when}: ${ele.winner.who}`}))
}

function handleInputKeydown(e) {
  if (e.keyCode === 13) {
    handleButtonClick();
  }
  localStorage.setItem('playerList', e.target.value);
}

function handleButtonClick() {
  clear($resultUl);
  clear($historyUl);
  let value = $txtInpt1.value;
  if (!value) {
    return;
  }
  let players = value.split(' ');
  console.debug('values:', players);
  $result.style.display = 'block';
  let winner = pickWinner(players);
  putWinnerStorage(winner);
  drawHistory(getWinningHistory());
}

function attachEventHandlers() {
  $btn1.addEventListener('click', handleButtonClick);
  $txtInpt1.addEventListener('keydown', handleInputKeydown);
}

(function fireImmediatly() {
  attachEventHandlers()
  $txtInpt1.value = localStorage.getItem('playerList');
  drawHistory(getWinningHistory());
})();