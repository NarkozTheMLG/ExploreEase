import { gameState, canvas, KEYS, gameFinished, isPaused } from "./myJs.js";
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
class Ball {
  constructor(x, y, vx, vy, w, h, image, bounceFactor, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.image = image;
    this.width = w;
    this.height = h;
    this.gravity = 0.1;
    this.bounceFactor = bounceFactor;
    this.isHit = false;
    this.bounced = 0;
    this.angle = 0;
    this.initialSize = size;
  }
  update() {
    if (!isPaused && !gameFinished) {
      if (gameState.gameTime % gameState.gameSpeed === 0) {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
      }
      if ((gameState.gameTime % 20) * gameState.gameSpeed === 0)
        this.vx *= 0.99;
      this.angle += 0.02 * this.vx;

      if (this.y + this.height > canvas.height) {
        this.y = canvas.height - this.height;
        this.vy *= -this.bounceFactor;
        this.bounced++;
      }
      if (this.x < 0 || this.x + this.width > canvas.width) {
        this.vx *= -1;
        this.angle *= -1;
      }
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
///////////////////////////////////////
// Chest class
///////////////////////////////////////
class Chest {
  constructor(x, vx, vy, w, h, image) {
    this.xPercent = x / canvas.width;
    this.x = x;
    this.y = canvas.height;
    this.vx = vx;
    this.vy = vy;
    this.image = image;
    this.width = w;
    this.height = h;
    this.direction = 1;
  }
  update() {
    if (!isPaused && !gameFinished) {
      this.x = this.xPercent * canvas.width;
      this.y = canvas.height - this.height;
      if (this.vx < 5) this.vx *= 1.02;
      if (KEYS["ArrowLeft"] && !KEYS["ArrowRight"] && this.x > 0) {
        this.x -= this.vx;
        this.direction = 1;
      } else if (
        KEYS["ArrowRight"] &&
        !KEYS["ArrowLeft"] &&
        this.x + this.width < canvas.width
      ) {
        this.x += this.vx;
        this.direction = -1;
      } else {
        this.vx = 1; // reset speed if no valid key or both pressed
      }
      this.xPercent = this.x / canvas.width;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.scale(this.direction, 1);
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
///////////////////////////////////////
// Boom class
///////////////////////////////////////
class Boom {
  constructor(x, y, w, h, image) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.width = w;
    this.height = h;
    this.end = false;
    this.alpha = 1;
  }
  update() {
    if (!isPaused && !gameFinished) {
      this.alpha -= 0.01;
      if (this.alpha <= 0.01) this.end = true;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
///////////////////////////////////////
// GameOver class
///////////////////////////////////////
class GameOver {
  constructor(x, y, w, h, image) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.width = w;
    this.height = h;
    this.end = false;
    this.alpha = 0;
    this.scoreStart = 0;
    this.count = 0;
    this.frames = 650;
    this.step = 0;
    this.scoreTarget = 0;
  }
  update(score) {
    if (this.scoreTarget !== score) {
      this.scoreTarget = score;
      this.step = (score - this.scoreStart) / this.frames;
    }
    if (this.count < this.frames && this.scoreStart < this.scoreTarget) {
      this.scoreStart += this.step;
      this.count++;
    }
    if (this.y > canvas.height / 12) this.y -= 0.6;
    if (this.alpha < 1) this.alpha += 0.003;
  }
  draw(ctx, score) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#470e04";
    ctx.textAlign = "center"; // e.g., start, center, end
    ctx.textBaseline = "middle"; // e.g., top, middle, bottom
    ctx.fillText(
      `${Math.round(this.scoreStart)}`,
      this.x + this.width / 2,
      this.y + this.height / 1.32
    );
    ctx.restore();
  }
}
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
export { Ball, Chest, Boom, GameOver };
