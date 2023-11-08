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

function drawGameResultEach(who, num) {
  let $li = document.createElement('li');
  $li.innerText = `${who}: ${num}점`;
  $resultUl.appendChild($li);
}

function pickWinner(arr) {
  for (let i in arr) {
    let player = arr[i];
    console.debug('player:', player);
    player = player.trim();
    let rnd = getRandomInt(0, 100);
    drawGameResultEach(player, rnd);
  }
}

function handleInputKeydown(e) {
  if (e.keyCode === 13) {
    handleButtonClick();
  }
}

function handleButtonClick() {
  let value = $txtInpt1.value;
  let values = value.split(',');
  pickWinner(values);
  $result.style.display = 'block';
}

(function() {
  $btn1.addEventListener('click', handleButtonClick);
  $txtInpt1.addEventListener('keydown', handleInputKeydown)
})();

