const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const speed = 2;

canvas.width = 1024;
canvas.height = 576;
var started = false;

function handleResize() {
  const aspectRatio = canvas.width / canvas.height;
  const windowAspectRatio = window.innerWidth / window.innerHeight;

  if (windowAspectRatio > aspectRatio) {
    // Fit canvas height to window height
    canvas.style.width = "auto";
    canvas.style.height = "100%";
  } else {
    // Fit canvas width to window width
    canvas.style.width = "100%";
    canvas.style.height = "auto";
  }
}

// Call the resize function on page load and window resize
window.addEventListener("load", handleResize);
window.addEventListener("resize", handleResize);

// Rest of your existing code...

c.fillRect(0, 0, canvas.width, canvas.height);

//changed
const gravity = 0.1 * speed;
var timer = 100;

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "../assets/bg.jpg",
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var p1 = parseInt(urlParams.get("p1"));
var p2 = parseInt(urlParams.get("p2"));

var player = new Fighter({
  position: { x: 200, y: 0 },
  velocity: { x: 0, y: 0 },
  scale: players[p1].scale,
  offset: players[p1].offset[0],
  attack2Object: new Attack({
    position: { x: 200, y: 0 },
    imageSrc: `../sprites/${players[p1].name}/attack2FX.png`,
    scale: players[p1].attack.scale,
    framesMax: players[p1].attack.framesMax,
    velocity: { x: 5 * speed, y: 0 },
  }),

  splAttackObject: new Attack({
    position: { x: 200, y: 0 },
    imageSrc: `../sprites/${players[p1].name}/splAttackFX.png`,
    scale: players[p1].spl.scale,
    framesMax: players[p1].spl.framesMax,
    velocity: { x: players[p1].spl.long ? 3 : 0, y: 0 },
    width: players[p1].spl.long ? 100 : 250,
    long: players[p1].spl.long,
  }),

  sprites: {
    idle: {
      imageSrc: `../sprites/${players[p1].name}/idle.png`,
      framesMax: players[p1].moves[0],
      offset: players[p1].offset[0],
    },
    run: {
      imageSrc: `../sprites/${players[p1].name}/run.png`,
      framesMax: players[p1].moves[1],
      offset: players[p1].offset[1],
    },
    jump: {
      imageSrc: `../sprites/${players[p1].name}/jump.png`,
      framesMax: players[p1].moves[2],
      offset: players[p1].offset[2],
    },
    attack1: {
      imageSrc: `../sprites/${players[p1].name}/attack1.png`,
      framesMax: players[p1].moves[3],
      offset: players[p1].offset[3],
    },
    attack2: {
      imageSrc: `../sprites/${players[p1].name}/attack2.png`,
      framesMax: players[p1].moves[4],
      offset: players[p1].offset[4],
    },
    splAttack: {
      imageSrc: `../sprites/${players[p1].name}/splAttack.png`,
      framesMax: players[p1].moves[8],
      offset: players[p1].offset[8],
    },
    takeHit: {
      imageSrc: `../sprites/${players[p1].name}/takeHit1.png`,
      framesMax: players[p1].moves[5],
      offset: players[p1].offset[5],
    },
    fall: {
      imageSrc: `../sprites/${players[p1].name}/fall.png`,
      framesMax: players[p1].moves[6],
      offset: players[p1].offset[6],
    },
    block: {
      imageSrc: `../sprites/${players[p1].name}/block.png`,
      framesMax: players[p1].moves[7],
      offset: players[p1].offset[7],
    },
  },
});

var enemy = new Fighter({
  position: { x: 800, y: 100 },
  velocity: { x: 0, y: 0 },
  scale: players[p2].scale,
  offset: players[p2].offset[0],

  attack2Object: new Attack({
    position: { x: 200, y: 0 },
    imageSrc: `../sprites/${players[p2].name}/attack2FX.png`,
    scale: players[p2].attack.scale,
    framesMax: players[p2].attack.framesMax,
    velocity: { x: 5 * speed, y: 0 },
  }),

  splAttackObject: new Attack({
    position: { x: 200, y: 0 },
    imageSrc: `../sprites/${players[p2].name}/splAttackFX.png`,
    scale: players[p2].spl.scale,
    framesMax: players[p2].spl.framesMax,
    velocity: { x: players[p2].spl.long ? 3 : 0, y: 0 },
    width: players[p2].spl.long ? 100 : 250,
    long: players[p2].spl.long,
  }),

  sprites: {
    idle: {
      imageSrc: `../sprites/${players[p2].name}/idle.png`,
      framesMax: players[p2].moves[0],
      offset: players[p2].offset[0],
    },
    run: {
      imageSrc: `../sprites/${players[p2].name}/run.png`,
      framesMax: players[p2].moves[1],
      offset: players[p2].offset[1],
    },
    jump: {
      imageSrc: `../sprites/${players[p2].name}/jump.png`,
      framesMax: players[p2].moves[2],
      offset: players[p2].offset[2],
    },
    attack1: {
      imageSrc: `../sprites/${players[p2].name}/attack1.png`,
      framesMax: players[p2].moves[3],
      offset: players[p2].offset[3],
    },
    attack2: {
      imageSrc: `../sprites/${players[p2].name}/attack2.png`,
      framesMax: players[p2].moves[4],
      offset: players[p2].offset[4],
    },
    splAttack: {
      imageSrc: `../sprites/${players[p2].name}/splAttack.png`,
      framesMax: players[p2].moves[8],
      offset: players[p2].offset[8],
    },
    takeHit: {
      imageSrc: `../sprites/${players[p2].name}/takeHit1.png`,
      framesMax: players[p2].moves[5],
      offset: players[p2].offset[5],
    },
    fall: {
      imageSrc: `../sprites/${players[p2].name}/fall.png`,
      framesMax: players[p2].moves[6],
      offset: players[p2].offset[6],
    },
    block: {
      imageSrc: `../sprites/${players[p2].name}/block.png`,
      framesMax: players[p2].moves[7],
      offset: players[p2].offset[7],
    },
  },
});

const keys = {
  playerUp: { pressed: false },
  playerLeft: { pressed: false },
  playerRight: { pressed: false },
  playerBlock: { pressed: false },
  enemyUp: { pressed: false },
  enemyLeft: { pressed: false },
  enemyRight: { pressed: false },
  enemyBlock: { pressed: false },
};

const startGame = () => {
  decreaseTimer();
  restoreEnergy();
};
var socket;
var player1;
var online = false;
$(document).ready(() => {
  if (urlParams.has("online")) {
    online = true;
    const origin = "http://localhost:5000";
    // const origin = "https://animexfusion-backend.onrender.com";
    socket = io.connect(origin);
    socket?.emit("joinRoom", urlParams.get("id"), p1);
    roomCode = urlParams.get("id");

    // socket.on("syncPosition", (newValues) => {
    //   player.position = newValues.player;
    //   enemy.position = newValues.enemy;
    // });

    socket.on("syncHealth", (newValues) => {
      player.health = newValues.player.health;
      enemy.health = newValues.enemy.health;
      document.querySelector("#playerHealth").style.width = player.health + "%";
      document.querySelector("#enemyHealth").style.width = enemy.health + "%";
      player.energy = newValues.player.energy;
      enemy.energy = newValues.enemy.energy;
      document.querySelector("#playerEnergy").style.width = player.energy + "%";
      document.querySelector("#enemyEnergy").style.width = enemy.energy + "%";
    });

    socket.on("keyPress", (data) => {
      performAction(data);
    });

    socket.on("opponentLeft", () => {
      waitForPlayer();

      timer = 100;
      started = false;
    });

    socket.on("updatePlayers", (data) => {
      player.position.x = data[0].x;
      enemy.position.x = data[1].x;
    });

    socket.on("startGame", (data) => {
      console.log(data.players[Object.keys(data.players)[0]].characterId);
      const characters = [
        data.players[Object.keys(data.players)[0]].characterId,
        data.players[Object.keys(data.players)[1]].characterId,
      ];

      const members = Object.keys(data.players);
      console.log(characters, members);

      player1 = members[0] === socket.id;
      p1 = characters[0];
      p2 = characters[1];

      player = new Fighter({
        position: { x: 200, y: 0 },
        velocity: { x: 0, y: 0 },
        scale: players[p1].scale,
        offset: players[p1].offset[0],
        attack2Object: new Attack({
          position: { x: 200, y: 0 },
          imageSrc: `../sprites/${players[p1].name}/attack2FX.png`,
          scale: players[p1].attack.scale,
          framesMax: players[p1].attack.framesMax,
          velocity: { x: 5 * speed, y: 0 },
        }),

        splAttackObject: new Attack({
          position: { x: 200, y: 0 },
          imageSrc: `../sprites/${players[p1].name}/splAttackFX.png`,
          scale: players[p1].spl.scale,
          framesMax: players[p1].spl.framesMax,
          velocity: { x: players[p1].spl.long ? 3 : 0, y: 0 },
          width: players[p1].spl.long ? 100 : 250,
          long: players[p1].spl.long,
        }),

        sprites: {
          idle: {
            imageSrc: `../sprites/${players[p1].name}/idle.png`,
            framesMax: players[p1].moves[0],
            offset: players[p1].offset[0],
          },
          run: {
            imageSrc: `../sprites/${players[p1].name}/run.png`,
            framesMax: players[p1].moves[1],
            offset: players[p1].offset[1],
          },
          jump: {
            imageSrc: `../sprites/${players[p1].name}/jump.png`,
            framesMax: players[p1].moves[2],
            offset: players[p1].offset[2],
          },
          attack1: {
            imageSrc: `../sprites/${players[p1].name}/attack1.png`,
            framesMax: players[p1].moves[3],
            offset: players[p1].offset[3],
          },
          attack2: {
            imageSrc: `../sprites/${players[p1].name}/attack2.png`,
            framesMax: players[p1].moves[4],
            offset: players[p1].offset[4],
          },
          splAttack: {
            imageSrc: `../sprites/${players[p1].name}/splAttack.png`,
            framesMax: players[p1].moves[8],
            offset: players[p1].offset[8],
          },
          takeHit: {
            imageSrc: `../sprites/${players[p1].name}/takeHit1.png`,
            framesMax: players[p1].moves[5],
            offset: players[p1].offset[5],
          },
          fall: {
            imageSrc: `../sprites/${players[p1].name}/fall.png`,
            framesMax: players[p1].moves[6],
            offset: players[p1].offset[6],
          },
          block: {
            imageSrc: `../sprites/${players[p1].name}/block.png`,
            framesMax: players[p1].moves[7],
            offset: players[p1].offset[7],
          },
        },
      });

      enemy = new Fighter({
        position: { x: 800, y: 100 },
        velocity: { x: 0, y: 0 },
        scale: players[p2].scale,
        offset: players[p2].offset[0],

        attack2Object: new Attack({
          position: { x: 200, y: 0 },
          imageSrc: `../sprites/${players[p2].name}/attack2FX.png`,
          scale: players[p2].attack.scale,
          framesMax: players[p2].attack.framesMax,
          velocity: { x: 5 * speed, y: 0 },
        }),

        splAttackObject: new Attack({
          position: { x: 200, y: 0 },
          imageSrc: `../sprites/${players[p2].name}/splAttackFX.png`,
          scale: players[p2].spl.scale,
          framesMax: players[p2].spl.framesMax,
          velocity: { x: players[p2].spl.long ? 3 : 0, y: 0 },
          width: players[p2].spl.long ? 100 : 250,
          long: players[p2].spl.long,
        }),

        sprites: {
          idle: {
            imageSrc: `../sprites/${players[p2].name}/idle.png`,
            framesMax: players[p2].moves[0],
            offset: players[p2].offset[0],
          },
          run: {
            imageSrc: `../sprites/${players[p2].name}/run.png`,
            framesMax: players[p2].moves[1],
            offset: players[p2].offset[1],
          },
          jump: {
            imageSrc: `../sprites/${players[p2].name}/jump.png`,
            framesMax: players[p2].moves[2],
            offset: players[p2].offset[2],
          },
          attack1: {
            imageSrc: `../sprites/${players[p2].name}/attack1.png`,
            framesMax: players[p2].moves[3],
            offset: players[p2].offset[3],
          },
          attack2: {
            imageSrc: `../sprites/${players[p2].name}/attack2.png`,
            framesMax: players[p2].moves[4],
            offset: players[p2].offset[4],
          },
          splAttack: {
            imageSrc: `../sprites/${players[p2].name}/splAttack.png`,
            framesMax: players[p2].moves[8],
            offset: players[p2].offset[8],
          },
          takeHit: {
            imageSrc: `../sprites/${players[p2].name}/takeHit1.png`,
            framesMax: players[p2].moves[5],
            offset: players[p2].offset[5],
          },
          fall: {
            imageSrc: `../sprites/${players[p2].name}/fall.png`,
            framesMax: players[p2].moves[6],
            offset: players[p2].offset[6],
          },
          block: {
            imageSrc: `../sprites/${players[p2].name}/block.png`,
            framesMax: players[p2].moves[7],
            offset: players[p2].offset[7],
          },
        },
      });
      startCountdown();
    });
  }

  background.update();
  waitForPlayer();
});
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  player.update(enemy);
  enemy.update(player);

  if (player.attack2Object.launched) player.attack2Object.update();
  if (enemy.attack2Object.launched) enemy.attack2Object.update();

  if (player.splAttackObject.launched) player.splAttackObject.update();
  if (enemy.splAttackObject.launched) enemy.splAttackObject.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  if (player.keys.left && player.lastKey == "playerLeft") {
    //changed
    player.velocity.x = -3 * speed;
    player.switchSprite("run");
  } else if (player.keys.right && player.lastKey == "playerRight") {
    player.velocity.x = 3 * speed;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  }

  if (enemy.keys.left && enemy.lastKey == "enemyLeft") {
    enemy.velocity.x = -3 * speed;
    enemy.switchSprite("run");
  } else if (enemy.keys.right && enemy.lastKey == "enemyRight") {
    enemy.velocity.x = 3 * speed;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  }
  //detect for attack collision
  if (
    attackCollision({ rectangle1: enemy, rectangle2: player.attack2Object }) &&
    player.attack2Object.launched
  ) {
    player.attack2Object.launched = false;

    enemy.switchSprite("fall");
    enemy.health -= 20;
    socket?.emit("syncHealth", {
      player: { health: player.health, energy: player.energy },
      enemy: { health: enemy.health, energy: enemy.energy },
      roomCode,
    });
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    attackCollision({ rectangle1: player, rectangle2: enemy.attack2Object }) &&
    enemy.attack2Object.launched
  ) {
    enemy.attack2Object.launched = false;
    player.switchSprite("fall");
    player.health -= 20;
    socket?.emit("syncHealth", {
      player: { health: player.health, energy: player.energy },
      enemy: { health: enemy.health, energy: enemy.energy },
      roomCode,
    });
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  if (
    attackCollision({
      rectangle1: enemy,
      rectangle2: player.splAttackObject,
    }) &&
    player.splAttackObject.launched
  ) {
    enemy.switchSprite("takeHit");

    player.splAttackObject.velocity.x = 0;

    if (!player.isSplAttacking) {
      player.isSplAttacking = true;
      enemy.isAttacked = true;
      player.framesHold *= 4;
      for (let i = 1; i <= 8; i++)
        setTimeout(() => {
          enemy.health -= 5;
          document.querySelector("#enemyHealth").style.width =
            enemy.health + "%";
        }, 250 * i);

      setTimeout(() => {
        player.framesHold /= 4;
        player.isSplAttacking = false;
        player.splAttackObject.launched = false;
        enemy.switchSprite("fall");
        socket?.emit("syncHealth", {
          player: { health: player.health, energy: player.energy },
          enemy: { health: enemy.health, energy: enemy.energy },
          roomCode,
        });
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
        enemy.isAttacked = false;
        player.splAttackObject.velocity.x = player.splAttackObject.long
          ? 3 * speed
          : 0;
      }, 2000);
    }
  }
  if (
    attackCollision({
      rectangle1: player,
      rectangle2: enemy.splAttackObject,
    }) &&
    enemy.splAttackObject.launched
  ) {
    player.switchSprite("takeHit");
    enemy.splAttackObject.velocity.x = 0;

    if (!enemy.isSplAttacking) {
      enemy.isSplAttacking = true;
      player.isAttacked = true;
      enemy.framesHold *= 4;

      for (let i = 1; i <= 8; i++)
        setTimeout(() => {
          player.health -= 5;
          document.querySelector("#playerHealth").style.width =
            player.health + "%";
        }, 250 * i);

      setTimeout(() => {
        enemy.framesHold /= 4;

        enemy.isSplAttacking = false;
        enemy.splAttackObject.launched = false;

        player.switchSprite("fall");

        socket?.emit("syncHealth", {
          player: { health: player.health, energy: player.energy },
          enemy: { health: enemy.health, energy: enemy.energy },
          roomCode,
        });
        document.querySelector("#playerHealth").style.width =
          player.health + "%";
        player.isAttacked = false;
        enemy.splAttackObject.velocity.x = enemy.splAttackObject.long
          ? 3 * speed
          : 0;
      }, 2000);
    }
  }

  //detect for player collision

  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    if (enemy.isAttacked) return;

    player.isAttacking = false;
    enemy.takeHit();
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    setTimeout(
      () =>
        socket?.emit("syncHealth", {
          player: { health: player.health, energy: player.energy },
          enemy: { health: enemy.health, energy: enemy.energy },
          roomCode,
        }),
      200
    );
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    if (player.isAttacked) return;

    player.takeHit();
    document.querySelector("#playerHealth").style.width = player.health + "%";
    enemy.isAttacking = false;
    setTimeout(
      () =>
        socket?.emit("syncHealth", {
          player: { health: player.health, energy: player.energy },
          enemy: { health: enemy.health, energy: enemy.energy },
          roomCode,
        }),
      200
    );
  }

  if (enemy.health <= 0 || player.health <= 0) {
    document.querySelector("#playerHealth").style.width = player.health + "%";
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    determineWinner({ player, enemy });
    started = false;
  }
}

animate();

window.addEventListener("keydown", (e) => {
  const currentPlayer = player1 || !urlParams.has("online") ? player : enemy;
  const opponent = player1 || !urlParams.has("online") ? enemy : player;

  const currentPlayerKey =
    player1 || !urlParams.has("online") ? "player" : "enemy";
  const opponentKey = player1 || !urlParams.has("online") ? "enemy" : "player";

  if (!started) return;

  if (
    (currentPlayer.isAttacked &&
      currentPlayer.sprites.takeHit.image === currentPlayer.image) ||
    (currentPlayer.isSplAttacking &&
      currentPlayer.sprites.splAttack.image === currentPlayer.image)
  )
    return;

  switch (e.key) {
    case "d":
      socket?.emit("keyPress", "rightDown", urlParams.get("id"));
      currentPlayer.keys.right = true;
      currentPlayer.lastKey = `${currentPlayerKey}Right`;
      break;

    case "a":
      socket?.emit("keyPress", "leftDown", urlParams.get("id"));
      currentPlayer.keys.left = true;
      currentPlayer.lastKey = `${currentPlayerKey}Left`;
      break;

    case "w":
      socket?.emit("keyPress", "up", urlParams.get("id"));
      currentPlayer.keys.up = true;
      if (currentPlayer.velocity.y == 0) currentPlayer.velocity.y = -8;
      break;

    case " ":
      socket?.emit("keyPress", "attack1", urlParams.get("id"));
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !currentPlayer.isAttacked
      )
        currentPlayer.attack1();
      break;

    case "q":
      socket?.emit("keyPress", "attack2", urlParams.get("id"));

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

    case "r":
      socket?.emit("keyPress", "splAttack", urlParams.get("id"));

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

    case "e":
      socket?.emit("keyPress", "blockDown", urlParams.get("id"));
      currentPlayer.keys.block = true;
      if (
        !currentPlayer.isAttacking &&
        currentPlayer.velocity.y === 0 &&
        currentPlayer.velocity.x === 0
      )
        currentPlayer.block();
      break;

    case "ArrowRight":
      if (online) return;
      opponent.keys.right = true;
      opponent.lastKey = `${opponentKey}Right`;
      break;

    case "ArrowLeft":
      if (online) return;

      opponent.keys.left = true;
      opponent.lastKey = `${opponentKey}Left`;
      break;

    case "ArrowUp":
      if (online) return;

      opponent.keys.up = true;
      if (opponent.velocity.y == 0) opponent.velocity.y = -8;
      break;

    case "0":
      if (online) return;

      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !opponent.isAttacked
      )
        executeAttack2(
          opponent,
          opponent.attack2Object,
          currentPlayer,
          `#${opponentKey}Energy`
        );
      break;

    case "2":
      if (online) return;

      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !opponent.isAttacked
      )
        executeSplAttack(
          opponent,
          opponent.splAttackObject,
          currentPlayer,
          `#${opponentKey}Energy`
        );
      break;

    case "Control":
      if (online) return;

      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !opponent.isAttacked
      )
        opponent.attack1();
      break;

    case "1":
      if (online) return;

      opponent.keys.block = true;
      if (
        !opponent.isAttacking &&
        opponent.velocity.y === 0 &&
        opponent.velocity.x === 0
      )
        opponent.block();
      break;
  }
});

window.addEventListener("keyup", (e) => {
  if (!started) return;

  const currentPlayer = player1 || !urlParams.has("online") ? player : enemy;
  const opponent = player1 || !urlParams.has("online") ? enemy : player;

  if (
    (currentPlayer.isAttacked &&
      currentPlayer.sprites.takeHit.image === currentPlayer.image) ||
    (currentPlayer.isSplAttacking &&
      currentPlayer.sprites.splAttack.image === currentPlayer.image)
  )
    return;
  if (!started) return;

  switch (e.key) {
    case "d":
      socket?.emit("keyPress", "rightUp", urlParams.get("id"));
      currentPlayer.keys.right = false;
      currentPlayer.offset = currentPlayer.sprites.idle.offset;
      break;

    case "a":
      socket?.emit("keyPress", "leftUp", urlParams.get("id"));
      currentPlayer.keys.left = false;
      currentPlayer.offset = currentPlayer.sprites.idle.offset;

      break;

    case "e":
      socket?.emit("keyPress", "blockUp", urlParams.get("id"));
      currentPlayer.isBlocking = false;
      currentPlayer.keys.block = false;
      break;

    case "ArrowRight":
      if (online) return;

      opponent.keys.right = false;
      opponent.offset = opponent.sprites.idle.offset;

      break;

    case "ArrowLeft":
      if (online) return;

      opponent.keys.left = false;
      opponent.offset = opponent.sprites.idle.offset;

      break;

    case "1":
      if (online) return;

      opponent.isBlocking = false;
      opponent.keys.block = false;
      break;
  }
});

const performTouchAction = (e, touch = false) => {
  if (!started) return;

  const currentPlayer = player1 || !urlParams.has("online") ? player : enemy;
  const opponent = player1 || !urlParams.has("online") ? enemy : player;
  const currentPlayerKey =
    player1 || !urlParams.has("online") ? "player" : "enemy";

  if (!started) return;

  if (
    (currentPlayer.isAttacked &&
      currentPlayer.sprites.takeHit.image === currentPlayer.image) ||
    (currentPlayer.isSplAttacking &&
      currentPlayer.sprites.splAttack.image === currentPlayer.image)
  )
    return;
  switch (e) {
    case "rightDown":
      socket?.emit("keyPress", "rightDown", urlParams.get("id"));
      currentPlayer.keys.right = true;
      currentPlayer.lastKey = `${currentPlayerKey}Right`;
      break;

    case "leftDown":
      socket?.emit("keyPress", "leftDown", urlParams.get("id"));
      currentPlayer.keys.left = true;
      currentPlayer.lastKey = `${currentPlayerKey}Left`;
      break;

    case "rightUp":
      socket?.emit("keyPress", e, urlParams.get("id"));
      currentPlayer.keys.right = false;
      currentPlayer.offset = currentPlayer.sprites.idle.offset;

      break;

    case "leftUp":
      socket?.emit("keyPress", e, urlParams.get("id"));
      currentPlayer.keys.left = false;
      currentPlayer.offset = currentPlayer.sprites.idle.offset;

      break;

    case "blockDown":
      socket?.emit("keyPress", "blockDown", urlParams.get("id"));
      currentPlayer.keys.block = true;
      if (
        !currentPlayer.isAttacking &&
        currentPlayer.velocity.y === 0 &&
        currentPlayer.velocity.x === 0
      )
        currentPlayer.block();
      break;

    case "blockUp":
      socket?.emit("keyPress", e, urlParams.get("id"));
      currentPlayer.isBlocking = false;
      currentPlayer.keys.block = false;
      break;

    case "up":
      socket?.emit("keyPress", e, urlParams.get("id"));
      currentPlayer.keys.up = true;
      if (currentPlayer.velocity.y == 0) currentPlayer.velocity.y = -8;
      break;

    case "attack1":
      socket?.emit("keyPress", e, urlParams.get("id"));
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !currentPlayer.isAttacked
      )
        currentPlayer.attack1();
      break;

    case "attack2":
      socket?.emit("keyPress", e, urlParams.get("id"));

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
      socket?.emit("keyPress", e, urlParams.get("id"));

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
  }
};

$(document).ready(() => {
  if (!detectMobile()) $(".controlsContainer").addClass("hidden");
});
