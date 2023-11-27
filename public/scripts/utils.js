function decreaseTimer() {
  if (timer && started) {
    setTimeout(decreaseTimer, 1000);

    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy });
    socket?.emit("syncHealth", {
      player: { health: player.health, energy: player.energy },
      enemy: { health: enemy.health, enemy: energy.energy },
      roomCode,
    });
  }
}

function loadSounds(player, name) {
  if (!player) return;
  player.sounds.jump = new Audio("../assets/sounds/jump.mp3");
  player.sounds.takeHit = new Audio("../assets/sounds/takeHit.mp3");
  player.sounds.attack1 = new Audio(`../assets/sounds/${name}Atk1.mp3`);
  player.sounds.splAttack = new Audio(`../assets/sounds/${name}Spl.mp3`);
}

var roomCode;

function syncPosition() {
  if (timer) {
    setTimeout(syncPosition, 10);
    socket?.emit("syncPosition", {
      player: player.position,
      enemy: enemy.position,
      roomCode,
    });
  }
}
function restoreEnergy() {
  if (!started) return;

  setTimeout(restoreEnergy, 10);
  if (timer) {
    if (player.energy < 100) player.energy += 0.05;
    if (enemy.energy < 100) enemy.energy += 0.05;
    if (player.energy >= 50) $("#attack2Btn").css("border-color", "#fff");
    else $("#attack2Btn").css("border-color", "#000");
    if (player.energy >= 100) $("#splAttackBtn").css("border-color", "#fff");
    else $("#splAttackBtn").css("border-color", "#000");
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
    document.querySelector(
      "#result"
    ).innerHTML = `Player 1 (${players[p1].name}) Wins!`;
  else if (player.health < enemy.health)
    document.querySelector(
      "#result"
    ).innerHTML = `Player 2 (${players[p2].name}) Wins!`;
  else document.querySelector("#result").innerHTML = "Draw game!";
  document.querySelector("#result").style.display = "flex";

  const restartButton =
    '<button  class="btn"  style="background-color: rgb(59, 123, 102)"  onclick="restart()"  >New Game</button>';

  const quitButton =
    '<button  class="btn"  style="background-color: rgb(160, 61, 61)"  onclick="quit()"  >Quit</button>';
  if ($("#menu").children().length == 0) {
    $("#menu").append(restartButton);
  }

  timer = 100;
}

function executeAttack2(player1, attack, enemy1, selector) {
  if (parseInt(player1.energy) >= 50) {
    player1.sounds.attack1.play();
    if (player1.position.x > enemy1.position.x) {
      attack.flipped = false;
      attack.velocity = {
        x: -Math.abs(attack.velocity.x),
        y: attack.velocity.y,
      };
    } else {
      attack.velocity = {
        x: Math.abs(attack.velocity.x),
        y: attack.velocity.y,
      };
      attack.flipped = true;
    }

    player1.attack2(enemy1);
    attack.release(player1.position);
    player1.energy -= 50;
    document.querySelector(selector).style.width = player1.energy + "%";
  }
}

function executeSplAttack(player1, attack, enemy1, selector) {
  if (parseInt(player1.energy) === 100) {
    player1.sounds.splAttack.play();
    if (player1.position.x > enemy1.position.x) {
      attack.flipped = false;
      attack.velocity = {
        x: -Math.abs(attack.velocity.x),
        y: attack.velocity.y,
      };
    } else {
      attack.velocity = {
        x: Math.abs(attack.velocity.x),
        y: attack.velocity.y,
      };
      attack.flipped = true;
    }

    player1.splAttack(enemy1);
    attack.release(player1.position, attack.flipped, (special = true));
    player1.energy = 0;
    document.querySelector(selector).style.width = player1.energy + "%";
  }
}

function restart() {
  if (online) return window.history.go(-1);
  window.history.go(-2);
}

function quit() {
  window.close();
}

function waitForPlayer() {
  if (!urlParams.has("online")) {
    startCountdown(startGame);
    return;
  }

  $("#countdownBox").show();
  var message = $(
    '<h2 style="color:white;text-align:center;" id="message"> Waiting for the other player to join ... </h2>'
  );
  message.appendTo($("#countdownBox"));
}

function startCountdown() {
  loadSounds(player, players[p1].name);
  loadSounds(enemy, players[p2].name);
  let counter = 3;
  $("#message").remove();

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
      player.energy = 0;
      enemy.energy = 0;
      player.health = 100;
      enemy.health = 100;
      started = true;
      decreaseTimer();
      restoreEnergy();
      if (urlParams.has("online") && player1) syncPosition();
    }
  }, 1000);
}

const performAction = (data, touch = false) => {
  if (!started) return;
  if (touch) socket?.emit("keyPress", data, urlParams.get("id"));
  const currentPlayer = !player1 ? player : enemy;
  const opponent = !player1 ? enemy : player;
  const currentPlayerKey = player1 ? "enemy" : "player";
  const opponentKey = player1 ? "player" : "enemy";

  if (
    (currentPlayer.isAttacked &&
      currentPlayer.sprites.takeHit.image === currentPlayer.image) ||
    (currentPlayer.isSplAttacking &&
      currentPlayer.sprites.splAttack.image === currentPlayer.image)
  )
    return;
  switch (data) {
    case "rightDown":
      currentPlayer.keys.right = true;
      currentPlayer.lastKey = `${currentPlayerKey}Right`;
      break;

    case "leftDown":
      currentPlayer.keys.left = true;
      currentPlayer.lastKey = `${currentPlayerKey}Left`;
      break;

    case "up":
      currentPlayer.keys.up = true;
      if (currentPlayer.velocity.y == 0) currentPlayer.velocity.y = -10;
      break;

    case "attack1":
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !currentPlayer.isAttacked
      )
        currentPlayer.attack1();
      break;

    case "attack2":
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !currentPlayer.isAttacked
      )
        executeAttack2(
          currentPlayer,
          currentPlayer.attack2Object,
          opponent,
          `#${currentPlayerKey}Energy`
        );
      break;

    case "splAttack":
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !currentPlayer.isAttacked
      )
        executeSplAttack(
          currentPlayer,
          currentPlayer.splAttackObject,
          opponent,
          `#${currentPlayerKey}Energy`
        );
      break;

    case "blockDown":
      currentPlayer.keys.block = true;
      if (
        !currentPlayer.isAttacking &&
        currentPlayer.velocity.y === 0 &&
        currentPlayer.velocity.x === 0
      )
        currentPlayer.block();
      break;

    case "rightUp":
      currentPlayer.keys.right = false;
      currentPlayer.offset = currentPlayer.sprites.idle.offset;
      break;

    case "leftUp":
      currentPlayer.keys.left = false;
      currentPlayer.offset = currentPlayer.sprites.idle.offset;

      break;

    case "blockUp":
      currentPlayer.isBlocking = false;
      opponent.keys.block = false;
  }
};

const detectMobile = () => {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  } else {
    return false;
  }
};
