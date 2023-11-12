let $txtInpt1 = document.querySelector('#txtInpt1');
let $pickBtn = document.querySelector('#btn1');
let $saveBtn = document.querySelector('#btn2');
let $result = document.querySelector('#result');
let $resultList = document.querySelector('#resultList');
let $histories = document.querySelector('#histories');
let $saveList = document.querySelector('#saveList');

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

function appendLiText({parent, innerText}) {
  let $li = document.createElement('li');
  $li.innerText = innerText;
  parent.appendChild($li);
}

function drawResult({parent, playResults}) {
  playResults.forEach(ele => appendLiText({parent, innerText: `${ele.who}: ${ele.numTxt}`}));
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
  drawResult({parent: $resultList, playResults});
  return min;
}

/**
 * 뽑 이력
 * 
 * @returns Object[]
 */
function loadWinningHistory() {
  let winningHistory = localStorage.getItem('win-hist');
  if (!winningHistory) {
    return [];
  }
  return JSON.parse(winningHistory);
}

function storeWinners(winner) {
  let winningHistory = loadWinningHistory();
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

function drawHistory({parent, winningHistory}) {
  winningHistory.forEach(ele => appendLiText({parent, innerText: `${ele.when}: ${ele.winner.who}`}))
}

function loadPlayersList() {
  let playersList = localStorage.getItem('playersList');
  return playersList ? JSON.parse(playersList) : [];
}

function storePlayersList(players) {
  let playersList = loadPlayersList();
  playersList.unshift(players);
  localStorage.setItem('playersList', JSON.stringify(playersList));
}

function drawPlayersList({parent, playersList}) {
  playersList.forEach(players => {
    let $li = document.createElement('li');
    parent.appendChild($li);

    let $loadButton = document.createElement('button');
    $li.appendChild($loadButton);
    $loadButton.type = 'button';
    $loadButton.innerText = '불러오기';
    $loadButton.classList.add('btns');
    $loadButton.classList.add('size-lesser');
    $loadButton.classList.add('lightgray');
    $loadButton.classList.add('effect-push');
    $loadButton.addEventListener('click', e => {
      $txtInpt1.value = players;
    });

    // let $deleteButton = document.createElement('button');
    // $li.appendChild($deleteButton);
    // $deleteButton.type = 'button';
    // $deleteButton.innerText = '삭제';
    // $deleteButton.classList.add('btns');
    // $deleteButton.classList.add('size-lesser');
    // $deleteButton.classList.add('lightgray');
    // $deleteButton.classList.add('effect-push');
    // $deleteButton.addEventListener('click', e => {

    // });

    let $span = document.createElement('span');
    $li.appendChild($span);
    $span.innerText = ' ' + players;
  });
}

function handleInputKeydown(e) {
  if (e.keyCode === 13) {
    handlePickButtonClick();
  }
  localStorage.setItem('latestUserInput1', e.target.value);
}

function handlePickButtonClick() {
  clear($resultList);
  clear($histories);
  let value = $txtInpt1.value;
  if (!value) {
    return;
  }
  let players = value.split(' ');
  console.debug('values:', players);
  $result.style.display = 'block';
  let winner = pickWinner(players);
  storeWinners(winner);
  drawHistory({parent: $histories, winningHistory: loadWinningHistory()});
}

function handleSaveButtonClick() {
  let value = $txtInpt1.value;
  if (!value) {
    return;
  }
  value = value.trim()
  let playersList = loadPlayersList();
  if (playersList.some(e => e === value)) { // 중복이면
    return;
  }
  storePlayersList(value);
  clear($saveList);
  drawPlayersList({parent: $saveList, playersList: loadPlayersList()});
}

function attachEventHandlers() {
  $pickBtn.addEventListener('click', handlePickButtonClick);
  $txtInpt1.addEventListener('keydown', handleInputKeydown);
  $saveBtn.addEventListener('click', handleSaveButtonClick);
}

(function fireImmediatly() {
  attachEventHandlers()
  $txtInpt1.value = localStorage.getItem('latestUserInput1');
  drawHistory({parent: $histories, winningHistory: loadWinningHistory()});
  drawPlayersList({parent: $saveList, playersList: loadPlayersList()});
})();
