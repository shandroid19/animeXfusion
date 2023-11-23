class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
  }

  draw(flip) {
    var sHeight = this.position.x;
    if (flip) {
      c.save();
      c.scale(-1, 1);
      sHeight =
        -this.position.x - (this.image.width / this.framesMax) * this.scale;
    }
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      sHeight,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
    if (flip) c.restore();
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else if (!this.isBlocking) this.framesCurrent = 0;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Attack extends Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1, velocity }) {
    super({
      imageSrc,
      scale,
      framesMax,
    });
    this.position = position;
    this.launched = false;
    this.velocity = velocity;
    this.scale = scale;
    this.framesMax = framesMax;
    this.height = 50;
    this.width = 50;
    this.flipped = false;
  }

  release(position) {
    this.position = { x: position.x, y: position.y + 50 };
    this.launched = true;
  }

  update() {
    const canvas = document.querySelector("#mainCanvas");
    const canvasWidth = canvas.width;
    this.draw(this.flipped);

    this.animateFrames();
    if (
      this.position.x + this.velocity.x >= 0 &&
      this.position.x + this.velocity.x <= canvasWidth - 100
    ) {
      this.position.x += this.velocity.x;
    } else {
      this.launched = false;
    }
    this.position.y += this.velocity.y;
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color,
    imageSrc,
    scale = 1,
    framesMax = 1,
    sprites,
    attack2Object,
    offset,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
    });
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey = "None";
    this.offset = offset;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 125,
      height: 50,
      offset: { x: 0, y: 0 },
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
    this.energy = 0;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.sprites = sprites;
    this.isJumping = false;
    this.attack2Object = attack2Object;
    this.isBlocking = false;
    this.isAttacked = false;
    this.keys = {
      up: false,
      left: false,
      right: false,
      block: false,
    };

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  attack1() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 200);
  }

  attack2() {
    this.switchSprite("attack2");
  }

  takeHit() {
    if (this.isBlocking) {
      this.health -= 1;
      return;
    }
    this.isAttacked = true;
    setTimeout(() => {
      this.switchSprite("takeHit");
      this.health -= 5;
      this.isAttacked = false;
    }, 100);
  }

  block() {
    this.isBlocking = true;
    this.switchSprite("block");
  }

  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    if (
      this.image === this.sprites.attack2.image &&
      this.framesCurrent < this.sprites.attack2.framesMax - 1
    )
      return;

    if (
      this.image === this.sprites.fall.image &&
      this.framesCurrent < this.sprites.fall.framesMax - 1
    )
      return;

    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    //jump
    if (
      this.image === this.sprites.jump.image &&
      this.framesCurrent < this.sprites.jump.framesMax - 1
    )
      return;

    if (this.image === this.sprites.block.image && this.isBlocking) return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.offset = this.sprites.idle.offset;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
          this.position.y += this.sprites.idle.offset.y;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.offset = this.sprites.run.offset;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
          this.position.y += this.sprites.run.offset.y;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.offset = this.sprites.jump.offset;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
          this.position.y += this.sprites.jump.offset.y;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.offset = this.sprites.attack1.offset;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
          this.position.y += this.sprites.attack1.offset.y;
        }
        break;

      case "attack2":
        if (this.image !== this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image;
          this.offset = this.sprites.attack2.offset;

          this.framesMax = this.sprites.attack2.framesMax;
          this.framesCurrent = 0;
          this.position.y += this.sprites.attack2.offset.y;
        }
        break;

      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.offset = this.sprites.fall.offset;

          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
          this.position.y += this.sprites.fall.offset.y;
        }
        break;

      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.offset = this.sprites.takeHit.offset;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
          this.position.y += this.sprites.takeHit.offset.y;
        }
        break;

      case "block":
        if (this.image !== this.sprites.block.image) {
          this.image = this.sprites.block.image;
          this.offset = this.sprites.block.offset;
          this.framesMax = this.sprites.block.framesMax;
          this.framesCurrent = 0;
          this.position.y += this.sprites.block.offset.y;
        }
        break;
    }
  }

  update(enemy) {
    const t1 = performance.now();

    const canvas = document.querySelector("canvas");
    const canvasWidth = canvas.width;

    if (this.image === this.sprites.run.image) {
      if (
        (this.position.x > enemy.position.x && this.velocity.x <= 0) ||
        (this.position.x < enemy.position.x && this.velocity.x < 0)
      ) {
        this.draw(false);
      } else {
        this.draw(true);
      }
    } else if (this.position.x > enemy.position.x) {
      this.draw(false);
    } else {
      this.draw(true);
    }
    this.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset;

    if (this.position.x > enemy.position.x)
      this.attackBox.position.x = this.position.x - 60;
    else this.attackBox.position.x = this.position.x + 60 - this.width;

    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    if (
      this.position.x + this.velocity.x >= 0 &&
      this.position.x + this.velocity.x <= canvasWidth - 100
    )
      this.position.x += this.velocity.x;
    this.position.y = this.position.y + this.velocity.y;

    if (
      this.position.y + this.height + this.velocity.y >=
      canvas.height + this.offset.y
    )
      this.velocity.y = 0;
    else this.velocity.y += gravity;
  }
}
