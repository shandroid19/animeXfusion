function decreaseTimer() {
  if (timer) {
    setTimeout(decreaseTimer, 1000);

    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy });
  }
}

function restoreEnergy() {
  setTimeout(restoreEnergy, 10);
  if (timer) {
    if (player.energy < 100) player.energy += 0.1;
    if (enemy.energy < 100) enemy.energy += 0.1;
    document.querySelector("#playerEnergy").style.width = player.energy + "%";
    document.querySelector("#enemyEnergy").style.width = enemy.energy + "%";
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

  $("#overlay").addClass("overlay");

  if (player.health > enemy.health)
    document.querySelector("#result").innerHTML = "Player 1 Wins!";
  else if (player.health < enemy.health)
    document.querySelector("#result").innerHTML = "Player 2 Wins!";
  else document.querySelector("#result").innerHTML = "Draw game!";
  document.querySelector("#result").style.display = "flex";

  const restartButton =
    '<button  class="btn"  style="background-color: rgb(59, 123, 102)"  onclick="restart()"  >Restart</button>';

  const quitButton =
    '<button  class="btn"  style="background-color: rgb(160, 61, 61)"  onclick="quit()"  >Quit</button>';
  if ($("#menu").children().length == 0) {
    $("#menu").append(restartButton);
    $("#menu").append(quitButton);
  }

  timer = 100;
}

function executeAttack2(player, attack, selector) {
  if (parseInt(player.energy) == 100) {
    player.attack2(enemy);
    attack.release(player.position);
    player.energy = 0;
    document.querySelector(selector).style.width = player.energy + "%";
  }
}

function restart() {
  location.reload();
}

function quit() {
  window.close();
}

function startCountdown(startGame) {
  let counter = 3;
  var timer = setInterval(function () {
    $("#countdown").remove();

    var countdown = $(
      '<span id="countdown">' + (counter == 0 ? "FIGHT" : counter) + "</span>"
    );
    countdown.appendTo($("#countdownBox"));
    setTimeout(() => {
      if (counter > -1) {
        $("#countdown").css({ "font-size": "10rem", opacity: 0 });
      } else {
        $("#countdown").css({ "font-size": "2rem", opacity: 1 });
      }
    }, 20);
    counter--;
    if (counter == -2) {
      clearInterval(timer);
      $("#countdown").remove();
      $("#countdownBox").hide();
      started = true;
      decreaseTimer();
      restoreEnergy();
    }
  }, 1000);
}
