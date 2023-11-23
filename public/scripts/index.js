const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

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

const gravity = 0.15;
let timer = 100;

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
    velocity: { x: 5, y: 0 },
  }),

  sprites: {
    idle: {
      imageSrc: `../sprites/${players[p1].name}/idle.png`,
      framesMax: players[p1].moves[0],
      offset: players[p1].offset[0],
    },
    run: {
      imageSrc: `../sprites/${players[p1].name}/walk.png`,
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
    velocity: { x: 5, y: 0 },
  }),

  sprites: {
    idle: {
      imageSrc: `../sprites/${players[p2].name}/idle.png`,
      framesMax: players[p2].moves[0],
      offset: players[p2].offset[0],
    },
    run: {
      imageSrc: `../sprites/${players[p2].name}/walk.png`,
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
    // const origin = "http://localhost:5000";
    const origin = "https://animexfusion-backend.onrender.com";
    socket = io.connect(origin);
    socket?.emit("joinRoom", urlParams.get("id"), p1);
    roomCode = urlParams.get("id");
    socket.on("syncPosition", (newValues) => {
      player.position = newValues.player;
      enemy.position = newValues.enemy;
    });

    socket.on("syncHealth", (newValues) => {
      player.health = newValues.player;
      enemy.health = newValues.enemy;
      document.querySelector("#playerHealth").style.width = player.health + "%";
      document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    });

    socket.on("keyPress", (data) => {
      performAction(data);
    });

    socket.on("startGame", ({ members, characters }) => {
      player1 = members[0] === socket.id;
      p1 = characters[members[0]];
      p2 = characters[members[1]];

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
          velocity: { x: 5, y: 0 },
        }),

        sprites: {
          idle: {
            imageSrc: `../sprites/${players[p1].name}/idle.png`,
            framesMax: players[p1].moves[0],
            offset: players[p1].offset[0],
          },
          run: {
            imageSrc: `../sprites/${players[p1].name}/walk.png`,
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
          velocity: { x: 5, y: 0 },
        }),

        sprites: {
          idle: {
            imageSrc: `../sprites/${players[p2].name}/idle.png`,
            framesMax: players[p2].moves[0],
            offset: players[p2].offset[0],
          },
          run: {
            imageSrc: `../sprites/${players[p2].name}/walk.png`,
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
      startCountdown(startGame);
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

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  if (player.keys.left && player.lastKey == "playerLeft") {
    player.velocity.x = -2;
    player.switchSprite("run");
  } else if (player.keys.right && player.lastKey == "playerRight") {
    player.velocity.x = 2;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  }

  if (enemy.keys.left && enemy.lastKey == "enemyLeft") {
    enemy.velocity.x = -2;
    enemy.switchSprite("run");
  } else if (enemy.keys.right && enemy.lastKey == "enemyRight") {
    enemy.velocity.x = 2;
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
    socket.emit("syncHealth", {
      player: player.health,
      enemy: enemy.health,
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
    socket.emit("syncHealth", {
      player: player.health,
      enemy: enemy.health,
      roomCode,
    });
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //detect for player collision

  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.takeHit();
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    setTimeout(
      () =>
        socket.emit("syncHealth", {
          player: player.health,
          enemy: enemy.health,
          roomCode,
        }),
      200
    );
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    player.takeHit();
    document.querySelector("#playerHealth").style.width = player.health + "%";
    enemy.isAttacking = false;
    setTimeout(
      () =>
        socket.emit("syncHealth", {
          player: player.health,
          enemy: enemy.health,
          roomCode,
        }),
      200
    );
  }

  if (enemy.health <= 0 || player.health <= 0)
    determineWinner({ player, enemy });
}

animate();

window.addEventListener("keydown", (e) => {
  const currentPlayer = player1 || !urlParams.has("online") ? player : enemy;
  const opponent = player1 || !urlParams.has("online") ? enemy : player;

  const currentPlayerKey =
    player1 || !urlParams.has("online") ? "player" : "enemy";
  const opponentKey = player1 || !urlParams.has("online") ? "enemy" : "player";

  if (!started) return;
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
  }
};

$(document).ready(() => {
  if (!detectMobile()) $(".controlsContainer").addClass("hidden");
});
