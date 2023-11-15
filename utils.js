function decreaseTimer() {
  if (timer) {
    setTimeout(decreaseTimer, 1000);
    if (player.energy < 100) player.energy += 10;
    if (enemy.energy < 100) enemy.energy += 10;
    document.querySelector("#playerEnergy").style.width = player.energy + "%";
    document.querySelector("#enemyEnergy").style.width = enemy.energy + "%";
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy });
  }
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function attackCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy }) {
  document.querySelector("#timer").innerHTML = 0;
  timer = 0;

  if (player.health > enemy.health)
    document.querySelector("#result").innerHTML = "Player 1 Wins!";
  else if (player.health < enemy.health)
    document.querySelector("#result").innerHTML = "Player 2 Wins!";
  else document.querySelector("#result").innerHTML = "Draw!";
  document.querySelector("#result").style.display = "flex";
}

function executeAttack2(player, attack, selector) {
  if (player.energy == 100) {
    player.attack2(enemy);
    attack.release(player.position);
    player.energy = 0;
    document.querySelector(selector).style.width = player.energy + "%";
  }
}
