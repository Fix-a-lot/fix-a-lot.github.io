let $txtInpt1 = document.querySelector('#txtInpt1');
let $btn1 = document.querySelector('#btn1');
let $result = document.querySelector('#result');
let $resultUl = document.querySelector('#result-ul');

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

function clear() {
  while ($resultUl.firstChild) {
    $resultUl.removeChild($resultUl.firstChild);
  }
}

function appendLi(innerText) {
  let $li = document.createElement('li');
  $li.innerText = innerText;
  $resultUl.appendChild($li);
}

function pickWinner(players) {
  let nums = [];
  for (let i in players) {
    let player = players[i];
    console.debug('player:', player);
    let randomNumber = getRandomInt(0, 100);
    let obj = {
      who: player.trim(),
      num: randomNumber,
      numTxt: String(randomNumber).padStart(2, '0')
    }
    nums.push(obj);
    // appendLi(`${obj.who}: ${obj.num}`);
  }
  // let max = nums.reduce((a, b) => a.num > b.num ? a : b);
  let min = nums.reduce((a, b) => a.num > b.num ? b : a);
  min.numTxt += ' 🥳';
  // appendLi(`높은 숫자: ${max.who} ${max.num}`);
  // appendLi(`낮은 숫자: ${min.who} ${min.num}`);
  nums.forEach(ele => appendLi(`${ele.who}: ${ele.numTxt}`));
}

function handleInputKeydown(e) {
  if (e.keyCode === 13) {
    handleButtonClick();
  }
  localStorage.setItem('playerList', e.target.value);
}

function handleButtonClick() {
  clear();
  let value = $txtInpt1.value;
  if (!value) {
    return;
  }
  let players = value.split(' ');
  console.debug('values:', players);
  pickWinner(players);
  $result.style.display = 'block';
}

(function() {
  $btn1.addEventListener('click', handleButtonClick);
  $txtInpt1.addEventListener('keydown', handleInputKeydown);
  $txtInpt1.value = localStorage.getItem('playerList');
})();

