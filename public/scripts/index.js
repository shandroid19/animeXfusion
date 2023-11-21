const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

var started = false;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.1;
let timer = 100;

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "../assets/bg.jpg",
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var p1, p2;
if (urlParams.has("initiator")) {
  var p1 = parseInt(urlParams.get("p1"));
  var p2 = parseInt(urlParams.get("p2"));
}

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
    velocity: { x: -5, y: 0 },
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
    velocity: { x: -5, y: 0 },
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
$(document).ready(() => {
  if (urlParams.has("initiator")) {
    socket = io.connect("http://localhost:5000");
    socket?.emit("joinRoom", urlParams.get("id"), p1);

    socket.on("keyPress", (data) => {
      performAction(data);
    });

    socket.on("startGame", ({ members, characters }) => {
      player1 = members[0] === socket.id;

      p1 = characters[members[0]];
      p2 = characters[members[1]];
      console.log(p1, p2);
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
          velocity: { x: -5, y: 0 },
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
          velocity: { x: -5, y: 0 },
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

  if (player.attack2Object.launched) player.attack2Object.update(enemy);
  if (enemy.attack2Object.launched) enemy.attack2Object.update(player);

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
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    attackCollision({ rectangle1: player, rectangle2: enemy.attack2Object }) &&
    enemy.attack2Object.launched
  ) {
    enemy.attack2Object.launched = false;
    player.switchSprite("fall");
    player.health -= 20;
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
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    player.takeHit();
    document.querySelector("#playerHealth").style.width = player.health + "%";
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0)
    determineWinner({ player, enemy });
}

animate();

// window.addEventListener("keydown", (e) => {
//   if (!started) return;
//   switch (e.key) {
//     case "d":
//       socket?.emit("keyPress", "rightDown");
//       player.keys.right = true;
//       player.lastKey = "playerRight";
//       break;

//     case "a":
//       socket?.emit("keyPress", "leftDown");
//       player.keys.left = true;
//       player.lastKey = "playerLeft";
//       break;

//     case "w":
//       socket?.emit("keyPress", "up");
//       player.keys.up = true;
//       if (player.velocity.y == 0) player.velocity.y = -8;
//       break;

//     case "ArrowRight":
//       enemy.keys.right = true;
//       enemy.lastKey = "enemyRight";
//       break;

//     case "ArrowLeft":
//       enemy.keys.left = true;
//       enemy.lastKey = "enemyLeft";
//       break;

//     case "ArrowUp":
//       enemy.keys.up = true;
//       if (enemy.velocity.y == 0) enemy.velocity.y = -8;
//       break;

//     case " ":
//       socket?.emit("keyPress", "attack1");
//       if (player.health > 0 && enemy.health > 0 && !player.isAttacked)
//         player.attack1();
//       break;

//     case "q":
//       socket?.emit("keyPress", "attack2");
//       if (player.health > 0 && enemy.health > 0 && !player.isAttacked)
//         executeAttack2(player, player.attack2Object, "#playerEnergy");
//       break;

//     case "0":
//       if (player.health > 0 && enemy.health > 0 && !enemy.isAttacked)
//         executeAttack2(enemy, enemy.attack2Object, "#enemyEnergy");
//       break;

//     case "Control":
//       if (player.health > 0 && enemy.health > 0 && !enemy.isAttacked)
//         enemy.attack1();
//       break;

//     case "e":
//       socket?.emit("keyPress", "blockDown");
//       player.keys.block = true;
//       if (
//         !player.isAttacking &&
//         player.velocity.y === 0 &&
//         player.velocity.x === 0
//       )
//         player.block();
//       break;

//     case "1":
//       enemy.keys.block = true;
//       if (
//         !enemy.isAttacking &&
//         enemy.velocity.y === 0 &&
//         enemy.velocity.x === 0
//       )
//         enemy.block();
//       break;
//   }
// });

// window.addEventListener("keyup", (e) => {
//   if (!started) return;

//   switch (e.key) {
//     case "d":
//       socket?.emit("keyPress", "rightUp");
//       player.keys.right = false;
//       player.offset = player.sprites.idle.offset;
//       break;

//     case "a":
//       socket?.emit("keyPress", "leftUp");
//       player.keys.left = false;
//       player.offset = player.sprites.idle.offset;

//       break;

//     case "ArrowRight":
//       enemy.keys.right = false;
//       enemy.offset = enemy.sprites.idle.offset;

//       break;

//     case "ArrowLeft":
//       enemy.keys.left = false;
//       enemy.offset = enemy.sprites.idle.offset;

//       break;

//     case "1":
//       enemy.isBlocking = false;
//       enemy.keys.block = false;
//       break;

//     case "e":
//       socket?.emit("keyPress", "blockUp");
//       player.isBlocking = false;
//       player.keys.block = false;
//   }
// });

window.addEventListener("keydown", (e) => {
  const currentPlayer = player1 ? player : enemy;
  const opponent = player1 ? player : enemy;

  const currentPlayerKey = player1 ? "player" : "enemy";
  const opponentKey = player1 ? "player" : "enemy";

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

    case "ArrowRight":
      opponent.keys.right = true;
      opponent.lastKey = `${opponentKey}Right`;
      break;

    case "ArrowLeft":
      opponent.keys.left = true;
      opponent.lastKey = `${opponentKey}Left`;
      break;

    case "ArrowUp":
      opponent.keys.up = true;
      if (opponent.velocity.y == 0) opponent.velocity.y = -8;
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
          "#playerEnergy"
        );
      break;

    case "0":
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !opponent.isAttacked
      )
        executeAttack2(enemy, opponent.attack2Object, "#enemyEnergy");
      break;

    case "Control":
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !opponent.isAttacked
      )
        opponent.attack1();
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

    case "1":
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

  const currentPlayer = player1 ? player : enemy;
  const opponent = player1 ? player : enemy;

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

    case "ArrowRight":
      opponent.keys.right = false;
      opponent.offset = opponent.sprites.idle.offset;

      break;

    case "ArrowLeft":
      opponent.keys.left = false;
      opponent.offset = opponent.sprites.idle.offset;

      break;

    case "1":
      opponent.isBlocking = false;
      opponent.keys.block = false;
      break;

    case "e":
      socket?.emit("keyPress", "blockUp", urlParams.get("id"));
      currentPlayer.isBlocking = false;
      currentPlayer.keys.block = false;
  }
});
