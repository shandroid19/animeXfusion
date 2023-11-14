const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.1;
let timer = 60;

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "./bg.webp",
});

const playerAttack2 = new Attack({
  position: { x: 200, y: 0 },
  imageSrc: "./sprites/zoro/attack2FX.png",
  scale: 2.4,
  framesMax: 4,
});

const player = new Fighter({
  position: { x: 200, y: 0 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: 0, y: 0 },
  framesMax: 7,
  scale: 2.4,
  sprites: {
    idle: {
      imageSrc: "./sprites/zoro/idle.png",
      framesMax: 2,
    },
    run: {
      imageSrc: "./sprites/zoro/run.png",
      framesMax: 6,
    },
    jump: {
      imageSrc: "./sprites/zoro/jump.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "./sprites/zoro/attack1.png",
      framesMax: 4,
    },
    attack2: {
      imageSrc: "./sprites/zoro/attack2.png",
      framesMax: 4,
    },
    fall: {
      imageSrc: "./sprites/luffy/fall.png",
      framesMax: 10,
    },
  },
});

const enemy = new Fighter({
  position: { x: 800, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "green",
  offset: { x: 0, y: 0 },
  imageSrc: "./sprites/zoro/idle.png",
  framesMax: 7,
  scale: 3,
  framesMax: 7,
  scale: 3,
  sprites: {
    idle: {
      imageSrc: "./sprites/luffy/idle.png",
      framesMax: 7,
    },
    run: {
      imageSrc: "./sprites/luffy/run.png",
      framesMax: 5.8,
    },
    jump: {
      imageSrc: "./sprites/luffy/jump.png",
      framesMax: 6,
    },
    attack1: {
      imageSrc: "./sprites/luffy/attack1.png",
      framesMax: 3.3,
    },

    attack2: {
      imageSrc: "./sprites/luffy/attack1.png",
      framesMax: 3.3,
    },

    fall: {
      imageSrc: "./sprites/luffy/fall.png",
      framesMax: 10,
    },
  },
});

const keys = {
  playerUp: { pressed: false },
  playerLeft: { pressed: false },
  playerRight: { pressed: false },
  enemyUp: { pressed: false },
  enemyLeft: { pressed: false },
  enemyRight: { pressed: false },
};

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

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();

  player.update(enemy);
  enemy.update(player);

  if (playerAttack2.launched) playerAttack2.update(enemy);

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.playerLeft.pressed && player.lastKey == "playerLeft") {
    player.velocity.x = -2;
    player.switchSprite("run");
  } else if (keys.playerRight.pressed && player.lastKey == "playerRight") {
    player.velocity.x = 2;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  }

  if (keys.enemyLeft.pressed && enemy.lastKey == "enemyLeft") {
    enemy.velocity.x = -2;
    enemy.switchSprite("run");
  } else if (keys.enemyRight.pressed && enemy.lastKey == "enemyRight") {
    enemy.velocity.x = 2;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  }

  //detect for collision
  if (
    attackCollision({ rectangle1: enemy, rectangle2: playerAttack2 }) &&
    playerAttack2.launched
  ) {
    playerAttack2.launched = false;
    enemy.switchSprite("fall");
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 5;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    player.health -= 5;
    document.querySelector("#playerHealth").style.width = player.health + "%";
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0)
    determineWinner({ player, enemy });
}

animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      keys.playerRight.pressed = true;
      player.lastKey = "playerRight";
      break;

    case "a":
      keys.playerLeft.pressed = true;
      player.lastKey = "playerLeft";
      break;

    case "w":
      keys.playerUp.pressed = true;
      if (player.velocity.y == 0) player.velocity.y = -8;
      break;

    case "ArrowRight":
      keys.enemyRight.pressed = true;
      enemy.lastKey = "enemyRight";
      break;

    case "ArrowLeft":
      keys.enemyLeft.pressed = true;
      enemy.lastKey = "enemyLeft";
      break;

    case "ArrowUp":
      keys.enemyUp.pressed = true;
      if (enemy.velocity.y == 0) enemy.velocity.y = -8;
      break;

    case " ":
      player.attack1();
      break;

    case "q":
      if (player.energy == 100) {
        player.attack2(enemy);
        playerAttack2.release(player.position);
        player.energy = 0;
        document.querySelector("#playerEnergy").style.width =
          player.energy + "%";
      }
      break;

    case "Control":
      enemy.attack1();
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.playerRight.pressed = false;
      break;

    case "a":
      keys.playerLeft.pressed = false;
      break;

    case "ArrowRight":
      keys.enemyRight.pressed = false;
      break;

    case "ArrowLeft":
      keys.enemyLeft.pressed = false;
      break;
  }
});
