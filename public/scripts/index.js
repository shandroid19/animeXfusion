const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const speed = 2;

canvas.width = 1024;
canvas.height = 576;
var started = false;

function handleResize() {
  const aspectRatio = canvas.width / canvas.height;
  const windowAspectRatio = window.innerWidth / window.innerHeight;
  const isLandscape = window.innerWidth > window.innerHeight;
  const isMobile = detectMobile();

  if (isMobile && isLandscape) {
    // Mobile landscape mode - maintain aspect ratio and center
    const maxHeight = window.innerHeight;
    const maxWidth = window.innerWidth;

    if (maxWidth / maxHeight > aspectRatio) {
      // Window is wider than canvas aspect ratio
      canvas.style.height = maxHeight + "px";
      canvas.style.width = maxHeight * aspectRatio + "px";
    } else {
      // Window is taller than canvas aspect ratio
      canvas.style.width = maxWidth + "px";
      canvas.style.height = maxWidth / aspectRatio + "px";
    }

    // Center the canvas
    canvas.style.margin = "0 auto";
    canvas.style.display = "block";

    // Adjust game container for landscape
    const gameContainer = document.querySelector(".gameContainer");
    if (gameContainer) {
      gameContainer.style.width = "100vw";
      gameContainer.style.height = "100vh";
      gameContainer.style.display = "flex";
      gameContainer.style.alignItems = "center";
      gameContainer.style.justifyContent = "center";
    }
  } else if (isMobile) {
    // Mobile portrait mode - fit to screen width
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    if (maxWidth / maxHeight > aspectRatio) {
      // Window is wider than canvas aspect ratio
      canvas.style.height = maxHeight + "px";
      canvas.style.width = maxHeight * aspectRatio + "px";
    } else {
      // Window is taller than canvas aspect ratio
      canvas.style.width = maxWidth + "px";
      canvas.style.height = maxWidth / aspectRatio + "px";
    }

    // Center the canvas
    canvas.style.margin = "0 auto";
    canvas.style.display = "block";

    // Adjust game container
    const gameContainer = document.querySelector(".gameContainer");
    if (gameContainer) {
      gameContainer.style.width = "100vw";
      gameContainer.style.height = "100vh";
      gameContainer.style.display = "flex";
      gameContainer.style.alignItems = "center";
      gameContainer.style.justifyContent = "center";
    }
  } else if (windowAspectRatio > aspectRatio) {
    // Desktop - fit canvas height to window height
    canvas.style.width = "auto";
    canvas.style.height = "100%";
  } else {
    // Desktop - fit canvas width to window width
    canvas.style.width = "100%";
    canvas.style.height = "auto";
  }

  // Force canvas to maintain aspect ratio in landscape
  if (isLandscape && isMobile) {
    canvas.style.objectFit = "contain";
    canvas.style.objectPosition = "center";
  }
}

// Call the resize function on page load and window resize
window.addEventListener("load", () => {
  handleResize();
  optimizeForOrientation();
});
window.addEventListener("resize", () => {
  handleResize();
  optimizeForOrientation();
});
window.addEventListener("orientationchange", () => {
  // Delay resize to allow orientation change to complete
  setTimeout(() => {
    handleResize();
    optimizeForOrientation();
  }, 100);

  // Re-enter fullscreen if needed for mobile
  if (detectMobile()) {
    setTimeout(() => {
      try {
        if (
          !document.fullscreenElement &&
          !document.webkitFullscreenElement &&
          !document.mozFullScreenElement &&
          !document.msFullscreenElement
        ) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          }
        }
      } catch (e) {
        console.log("Fullscreen re-entry failed:", e);
      }
    }, 200);
  }
});

// Rest of your existing code...

c.fillRect(0, 0, canvas.width, canvas.height);

//changed
const gravity = 0.1 * speed;
var timer = 100;

const selectedBg = (function () {
  try {
    return sessionStorage.getItem("axf_bg") || "../assets/bg.jpg";
  } catch {
    return "../assets/bg.jpg";
  }
})();
const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: selectedBg,
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
// Remote interpolation buffer
var remoteSnapshots = [];
const INTERP_DELAY_MS = 50; // Reduced from 100ms for more responsive movement
$(document).ready(() => {
  if (urlParams.has("online")) {
    online = true;
    // const origin = "http://localhost:5000";
    const origin = "https://animexfusion-backend.onrender.com";
    socket = io.connect(origin);
    socket?.emit("joinRoom", urlParams.get("id"), p1);
    roomCode = urlParams.get("id");
    socket.on("syncPosition", (newValues) => {
      // Buffer only the remote player's snapshots with better validation
      const snap = player1 ? newValues.enemy : newValues.player;
      if (
        snap &&
        typeof snap.x === "number" &&
        typeof snap.y === "number" &&
        typeof snap.vx === "number" &&
        typeof snap.vy === "number" &&
        snap.t
      ) {
        // Add timestamp if missing
        if (!snap.t) snap.t = Date.now();

        // Only add if it's a significant change to reduce noise
        const lastSnap = remoteSnapshots[remoteSnapshots.length - 1];
        if (
          !lastSnap ||
          Math.abs(snap.x - lastSnap.x) > 1 ||
          Math.abs(snap.y - lastSnap.y) > 1 ||
          Math.abs(snap.vx - lastSnap.vx) > 0.5 ||
          Math.abs(snap.vy - lastSnap.vy) > 0.5
        ) {
          remoteSnapshots.push(snap);
          if (remoteSnapshots.length > 20) remoteSnapshots.shift(); // Reduced buffer size for faster response
        }
      }
    });

    socket.on("syncHealth", (newValues) => {
      if (player1) {
        player.health = newValues.player.health;
        player.energy = newValues.player.energy;
        applyHealthBar("playerHealth", player.health, false);
        document.querySelector("#playerEnergy").style.width =
          player.energy + "%";
        return;
      }
      enemy.health = newValues.enemy.health;
      enemy.energy = newValues.enemy.energy;
      document.querySelector("#enemyEnergy").style.width = enemy.energy + "%";
      applyHealthBar("enemyHealth", enemy.health, true);
    });

    socket.on("keyPress", (data) => {
      performAction(data);
    });

    socket.on("opponentLeft", () => {
      waitForPlayer();

      timer = 100;
      started = false;
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
  // Interpolate remote player for smoother online motion
  if (online && remoteSnapshots.length >= 2) {
    const renderTime = Date.now() - INTERP_DELAY_MS;
    // find two snapshots around renderTime
    let prev = null;
    let next = null;
    for (let i = remoteSnapshots.length - 1; i >= 0; i--) {
      const s = remoteSnapshots[i];
      if (s.t <= renderTime) {
        prev = s;
        next = remoteSnapshots[i + 1] || s;
        break;
      }
    }
    if (!prev) {
      prev = remoteSnapshots[0];
      next = remoteSnapshots[1] || prev;
    }

    const t0 = prev.t || 0;
    const t1 = Math.max(next.t || 0, t0 + 1);
    const alpha = Math.max(0, Math.min(1, (renderTime - t0) / (t1 - t0)));

    const targetX = prev.x + (next.x - prev.x) * alpha;
    const targetY = prev.y + (next.y - prev.y) * alpha;
    const targetVX = prev.vx + (next.vx - prev.vx) * alpha;
    const targetVY = prev.vy + (next.vy - prev.vy) * alpha;

    const remoteFighter = player1 ? enemy : player;

    // Only interpolate if the remote fighter isn't being controlled locally
    const isLocalInput =
      (player1 && remoteFighter === player) ||
      (!player1 && remoteFighter === enemy);
    if (!isLocalInput) {
      // Update position with better smoothing
      const smoothingFactor = 0.4; // Increased from 0.2 for more responsive movement
      remoteFighter.position.x +=
        (targetX - remoteFighter.position.x) * smoothingFactor;
      remoteFighter.position.y +=
        (targetY - remoteFighter.position.y) * smoothingFactor;

      // Update velocity for smoother movement
      remoteFighter.velocity.x = targetVX;
      remoteFighter.velocity.y = targetVY;

      // Update sprite state based on movement
      if (Math.abs(targetVX) > 0.1) {
        remoteFighter.switchSprite("run");
      } else if (targetVY < 0) {
        remoteFighter.switchSprite("jump");
      } else {
        remoteFighter.switchSprite("idle");
      }

      // Update lastKey for proper sprite direction
      if (targetVX > 0.1) {
        remoteFighter.lastKey = player1 ? "enemyRight" : "playerRight";
      } else if (targetVX < -0.1) {
        remoteFighter.lastKey = player1 ? "enemyLeft" : "playerLeft";
      }
    }
  }
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
    applyHealthBar("enemyHealth", enemy.health, true);
    // socket?.emit("syncHealth", {
    //   player: { health: player.health, energy: player.energy },
    //   enemy: { health: enemy.health, energy: enemy.energy },
    //   roomCode,
    // });
  }

  if (
    attackCollision({ rectangle1: player, rectangle2: enemy.attack2Object }) &&
    enemy.attack2Object.launched
  ) {
    enemy.attack2Object.launched = false;
    player.switchSprite("fall");
    player.health -= 20;
    applyHealthBar("playerHealth", player.health, false);
    // socket?.emit("syncHealth", {
    //   player: { health: player.health, energy: player.energy },
    //   enemy: { health: enemy.health, energy: enemy.energy },
    //   roomCode,
    // });
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
          applyHealthBar("enemyHealth", enemy.health, true);
          // socket?.emit("syncHealth", {
          //   player: { health: player.health, energy: player.energy },
          //   enemy: { health: enemy.health, energy: enemy.energy },
          //   roomCode,
          // });
        }, 250 * i);

      setTimeout(() => {
        player.framesHold /= 4;
        player.isSplAttacking = false;
        player.splAttackObject.launched = false;
        enemy.switchSprite("fall");

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
          // socket?.emit("syncHealth", {
          //   player: { health: player.health, energy: player.energy },
          //   enemy: { health: enemy.health, energy: enemy.energy },
          //   roomCode,
          // });
          applyHealthBar("playerHealth", player.health, false);
        }, 250 * i);

      setTimeout(() => {
        enemy.framesHold /= 4;

        enemy.isSplAttacking = false;
        enemy.splAttackObject.launched = false;

        player.switchSprite("fall");

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
    applyHealthBar("enemyHealth", enemy.health, true);
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    if (player.isAttacked) return;

    player.takeHit();
    applyHealthBar("playerHealth", player.health, false);
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    applyHealthBar("playerHealth", player.health, false);
    applyHealthBar("enemyHealth", enemy.health, true);
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
      if (currentPlayer.isBlocking) return;

      socket?.emit("keyPress", "rightDown", urlParams.get("id"));
      currentPlayer.keys.right = true;
      currentPlayer.lastKey = `${currentPlayerKey}Right`;
      break;

    case "a":
      if (currentPlayer.isBlocking) return;

      socket?.emit("keyPress", "leftDown", urlParams.get("id"));
      currentPlayer.keys.left = true;
      currentPlayer.lastKey = `${currentPlayerKey}Left`;
      break;

    case "w":
      if (currentPlayer.isBlocking) return;

      socket?.emit("keyPress", "up", urlParams.get("id"));
      currentPlayer.keys.up = true;
      if (currentPlayer.velocity.y == 0) currentPlayer.velocity.y = -8;
      break;

    case " ":
      if (currentPlayer.isBlocking) return;

      socket?.emit("keyPress", "attack1", urlParams.get("id"));
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !currentPlayer.isAttacked
      )
        currentPlayer.attack1();
      break;

    case "q":
      if (currentPlayer.isBlocking) return;

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
      if (currentPlayer.isBlocking) return;

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
      if (currentPlayer.isBlocking) return;

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
      if (opponent.isBlocking) return;

      opponent.keys.right = true;
      opponent.lastKey = `${opponentKey}Right`;
      break;

    case "ArrowLeft":
      if (online) return;
      if (opponent.isBlocking) return;

      opponent.keys.left = true;
      opponent.lastKey = `${opponentKey}Left`;
      break;

    case "ArrowUp":
      if (online) return;
      if (opponent.isBlocking) return;

      opponent.keys.up = true;
      if (opponent.velocity.y == 0) opponent.velocity.y = -8;
      break;

    case "0":
      if (online) return;
      if (opponent.isBlocking) return;

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
      if (opponent.isBlocking) return;

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
      if (opponent.isBlocking) return;

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
      if (currentPlayer.isBlocking) return;
      socket?.emit("keyPress", "rightDown", urlParams.get("id"));
      currentPlayer.keys.right = true;
      currentPlayer.lastKey = `${currentPlayerKey}Right`;
      break;

    case "leftDown":
      if (currentPlayer.isBlocking) return;

      socket?.emit("keyPress", "leftDown", urlParams.get("id"));
      currentPlayer.keys.left = true;
      currentPlayer.lastKey = `${currentPlayerKey}Left`;
      break;

    case "rightUp":
      if (currentPlayer.isBlocking) return;

      socket?.emit("keyPress", e, urlParams.get("id"));
      currentPlayer.keys.right = false;
      currentPlayer.offset = currentPlayer.sprites.idle.offset;

      break;

    case "leftUp":
      if (currentPlayer.isBlocking) return;

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
      if (currentPlayer.isBlocking) return;

      socket?.emit("keyPress", e, urlParams.get("id"));
      currentPlayer.keys.up = true;
      if (currentPlayer.velocity.y == 0) currentPlayer.velocity.y = -8;
      break;

    case "attack1":
      if (currentPlayer.isBlocking) return;

      socket?.emit("keyPress", e, urlParams.get("id"));
      if (
        currentPlayer.health > 0 &&
        opponent.health > 0 &&
        !currentPlayer.isAttacked
      )
        currentPlayer.attack1();
      break;

    case "attack2":
      if (currentPlayer.isBlocking) return;

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
      if (currentPlayer.isBlocking) return;

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

  // Fullscreen disabled for Android - removed auto-enter fullscreen
  // if (detectMobile()) {
  //   // Hide browser UI elements when possible
  //   try {
  //     if (document.documentElement.requestFullscreen) {
  //       document.documentElement.requestFullscreen();
  //     } else if (document.documentElement.webkitRequestFullscreen) {
  //       document.documentElement.webkitRequestFullscreen();
  //     } else if (document.documentElement.msRequestFullscreen) {
  //       document.documentElement.msRequestFullscreen();
  //     }
  //   } catch (e) {
  //     console.log("Fullscreen not supported or blocked");
  //   }

  //   // Add fullscreen change event listeners
  //   document.addEventListener("fullscreenchange", handleFullscreenChange);
  //   document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  //   document.addEventListener("mozfullscreenchange", handleFullscreenChange);
  //   document.addEventListener("MSFullscreenChange", handleFullscreenChange);
  // }

  // Haptics on touch
  const vibrate = (ms) => {
    try {
      if (navigator.vibrate) navigator.vibrate(ms);
    } catch {}
  };
  $(document).on(
    "touchstart",
    ".controlBtn,.attack1Btn,.attack2Btn",
    function () {
      vibrate(10);
    }
  );
});

// Handle fullscreen changes - DISABLED
// function handleFullscreenChange() {
//   const isFullscreen =
//     document.fullscreenElement ||
//     document.webkitFullscreenElement ||
//     document.mozFullScreenElement ||
//     document.msFullscreenElement;

//   if (isFullscreen) {
//     // Hide browser UI elements
//     document.body.style.overflow = "hidden";
//     // Add CSS to hide address bar on mobile
//     const style = document.createElement("style");
//     style.id = "fullscreen-style";
//     style.textContent = `
//       @media screen and (display-mode: fullscreen) {
//         body {
//           overflow: hidden !important;
//           position: fixed !important;
//           width: 100vw !important;
//           height: 100vh !important;
//         }
//       }
//       @media screen and (display-mode: standalone) {
//         body {
//           overflow: hidden !important;
//         }
//       }
//     `;
//     document.head.appendChild(style);
//   } else {
//     // Restore normal behavior when exiting fullscreen
//     document.body.style.overflow = "";
//     const fullscreenStyle = document.getElementById("fullscreen-style");
//     if (fullscreenStyle) {
//       fullscreenStyle.remove();
//     }
//   }
// }

// Function to optimize layout for current orientation
function optimizeForOrientation() {
  const isLandscape = window.innerWidth > window.innerHeight;
  const isMobile = detectMobile();

  if (isMobile && isLandscape) {
    // Add landscape-specific classes
    document.body.classList.add("landscape-mode");

    // Optimize canvas for landscape
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.style.objectFit = "cover";
    }

    // Adjust control positioning
    const controlsContainer = document.querySelector(".controlsContainer");
    if (controlsContainer) {
      controlsContainer.style.bottom = "0";
      controlsContainer.style.left = "0";
      controlsContainer.style.right = "0";
    }

    // Optimize status bar
    const statusBar = document.querySelector(".statusBar");
    if (statusBar) {
      statusBar.style.position = "fixed";
      statusBar.style.top = "0";
      statusBar.style.left = "0";
      statusBar.style.right = "0";
    }
  } else {
    // Remove landscape classes
    document.body.classList.remove("landscape-mode");

    // Reset to default positioning
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.style.width = "";
      canvas.style.height = "";
      canvas.style.objectFit = "";
    }

    const controlsContainer = document.querySelector(".controlsContainer");
    if (controlsContainer) {
      controlsContainer.style.bottom = "";
      controlsContainer.style.left = "";
      controlsContainer.style.right = "";
    }

    const statusBar = document.querySelector(".statusBar");
    if (statusBar) {
      statusBar.style.position = "";
      statusBar.style.top = "";
      statusBar.style.left = "";
      statusBar.style.right = "";
    }
  }
}
