import { Ball, Chest, Boom, GameOver } from "./items.js";

export const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const getTable = $("table");
const getBackButton = $("#back");
const getTimeBar1 = $("#timebar1");
const getTimeBar2 = $("#timebar2");
const getScore = $("#score");

const gameOverImg = new Image();
gameOverImg.src = "images/game_over.svg";
const newGameOver = new GameOver(
  canvas.width / 2,
  canvas.height / 2,
  canvas.width / 4,
  canvas.height / 4,
  gameOverImg
);

const beachBall = new Image();
beachBall.src = "images/beach_ball.png";

const backGround = new Image();
backGround.src = "images/beach_background.jpg";

const pausedImg = new Image();
pausedImg.src = "images/paused.svg";

const chestImg = new Image();
chestImg.src = "images/chest_2.png";
const newChest = new Chest(
  canvas.width / 2,
  canvas.height,
  0,
  (190 * window.innerWidth) / screen.width,
  (150 * window.innerHeight) / screen.height,
  chestImg
);

const boomEffect = new Image();
boomEffect.src = "images/boom_effect.png";

const scoreBoard = new Image();
scoreBoard.src = "images/score.svg";

const timebarimg1 = new Image();
timebarimg1.src = "images/menu_design1.svg";

const backbutton = new Image();
backbutton.src = "images/backbutton.svg";

const gravity = 8;
export let gameFinished = false;
export let isPaused = false;
export const KEYS = {};
let startTime = Date.now();
export const gameState = {
  gameTime: 0,
  gameSpeed: 1,
};
let totalTime = 0;
let score = 0;
let sign = 1;
let gameStart = false;

let curX = 56; //56dan baslio
const minBarX = 56;
const maxBarX = 1820;

let items = [];
let booms = [];
let assetsLoaded = 0;
////////////////////////////////////////////
//event listener
////////////////////////////////////////////
window.addEventListener("blur", () => {
  if (!gameFinished) {
    isPaused = true;
    console.log("Game paused");
  }
});
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !gameFinished) isPaused = !isPaused;
});
getBackButton.on("mouseover", function () {
  $(this).css("transform", `scale(1.2)`);
});
getBackButton.on("mouseout", function () {
  $(this).css("transform", "scale(1)");
});
$(document).keydown(function (e) {
  KEYS[e.key] = true;
});
$(document).keyup(function (e) {
  KEYS[e.key] = false;
});
////////////////////////////////////////////
// Check if the items loaded for all
////////////////////////////////////////////
scoreBoard.onload = function () {
  const score = document.getElementById("score");
  score.style.width = scoreBoard.naturalWidth + "px";
  score.style.backgroundImage = `url('${scoreBoard.src}')`;
  score.style.backgroundSize = "contain";
};
backbutton.onload = function () {
  const backButton = document.getElementById("back");
  backButton.style.width = backbutton.naturalWidth * 0.5 + "px";
  backButton.style.height = backbutton.naturalHeight * 0.5 + "px";
  backButton.style.backgroundImage = `url('${backbutton.src}')`;
  backButton.style.backgroundSize = "contain";
  backButton.onclick = () => {
    window.location.href = "index.html";
  };
};
timebarimg1.onload = function () {
  timebar1.style.backgroundImage = `url('${timebarimg1.src}')`;
  timebar1.style.backgroundPosition = "-920px -2346px";

  timebar2.style.backgroundImage = `url('${timebarimg1.src}')`;
  timebar2.style.backgroundPosition = "-920px -2164px";
};
backGround.onload = function () {
  assetsLoaded++;
  if (assetsLoaded === 3) drawScene();
};
beachBall.onload = function () {
  assetsLoaded++;
  if (assetsLoaded === 3) drawScene();
};
chestImg.onload = function () {
  assetsLoaded++;
  if (assetsLoaded === 3) drawScene();
};
////////////////////////////////////////////
// Spawn and draw
////////////////////////////////////////////
function drawGray() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // 50% dark overlay
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.save();
  if (isPaused)
    ctx.drawImage(
      pausedImg,
      canvas.width / 2 - canvas.width / 8,
      canvas.height / 2 - canvas.height / 8,
      canvas.width / 4,
      canvas.height / 4
    );
  ctx.font = "bold 64px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center"; // e.g., start, center, end
  ctx.textBaseline = "middle"; // e.g., top, middle, bottom
  ctx.fillText(`PAUSED!`, canvas.width / 2, canvas.height / 2);
  ctx.font = "bold 32px Arial";
  ctx.fillStyle = "gray";
  ctx.fillText(`Space to resume!`, canvas.width / 2, canvas.height / 2 + 50);
  ctx.restore();
  ctx.save();
}
function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  ctx.drawImage(backGround, 0, 0, canvas.width, canvas.height);
}
function spawnBeachBall() {
  const itemImg = new Image();
  itemImg.src = "images/beach_ball.png";
  const random = Math.floor(Math.random() * (10 - 3)) + 4;
  const scaleX = window.innerWidth / screen.width;
  let size = random * 10;
  let velocity = random;
  let startX = size / 10;
  if (sign === -1) startX = canvas.width - size;
  const newItem = new Ball(
    startX,
    size / 10,
    sign * velocity,
    -velocity / 2,
    size * scaleX,
    size * scaleX,
    itemImg,
    0.9,
    size
  );
  items.push(newItem);
}
////////////////////////////////////////////
// update items and other classes dynamically
////////////////////////////////////////////
function updateItems() {
  items.forEach((item) => {
    if (isColliding(newChest, item)) {
      item.isHit = true;
      score += Math.round(
        Math.max(500, Math.min(2000, 2000 - ((item.width - 20) / 80) * 1500))
      );
    }
  });
  items.forEach((item) => item.update());
  items.forEach((item) => item.draw(ctx));
  let newItems = [];
  for (let i = 0; i < items.length; i++)
    newItems = items.filter((item) => !item.isHit);
  items = newItems;
  // boom here
  booms.forEach((boom) => boom.draw(ctx));
  booms.forEach((boom) => boom.update());
  for (let i = 0; i < items.length; i++) {
    if (items[i].bounced == 3) {
      console.log(`I have bounced: ${items[i].bounced}`);
      const newBoom = new Boom(
        items[i].x,
        items[i].y - items[i].height / 2,
        items[i].width * 1.3,
        items[i].height * 1.3,
        boomEffect
      );
      booms.push(newBoom);
      items[i].isHit = true;
    }
  }
  let newBooms = [];
  for (let i = 0; i < booms.length; i++)
    newBooms = booms.filter((boom) => !boom.end);
  booms = newBooms;
}
function updateTimeBar() {
  curX += (maxBarX - minBarX) / (30 * 20);
  timebar2.style.width = `${curX}px`;
}
function updateChest() {
  newChest.update(KEYS);
  newChest.draw(ctx);
}
function updateGameOver() {
  newGameOver.update(score);
  newGameOver.draw(ctx, score);
}

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width * 0.7 &&
    rect1.x + rect1.width * 0.7 > rect2.x &&
    rect1.y < rect2.y + rect2.height * 0.5 &&
    rect1.y + rect1.height * 0.5 > rect2.y
  );
}
////////////////////////////////////////////
//this is the loop that generates everything
////////////////////////////////////////////
function gameLoop() {
  const curTime = Date.now();
  gameState.gameTime++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScene();
  updateItems();
  updateChest();
  if (isPaused) drawGray();
  gameState.gameTime = curTime;
  $("#scoreText").text("Score: " + score);
  if (gameFinished) updateGameOver();
  requestAnimationFrame(gameLoop);
}
gameLoop();

////////////////////////////////////////////
// game intervals here
////////////////////////////////////////////
setInterval(() => {
  if (isPaused || gameFinished) return;
  if (Math.random() < 0.5) sign *= -1;
  gameStart = true;
  spawnBeachBall();
}, 2000);
setInterval(() => {
  if (isPaused || gameFinished || !gameStart) return;
  totalTime++;
  console.log(`Time: ${totalTime}`);
  if (totalTime == 31) gameFinished = true;
}, 1000);
setInterval(() => {
  if (isPaused || gameFinished || !gameStart) return;
  updateTimeBar();
}, 50);

////////////////////////////////////////////
//on resize fit it in screen
////////////////////////////////////////////
function resizeCanvas() {
  newGameOver.x = canvas.width / 4;
  newGameOver.y = canvas.height / 3;
  newGameOver.width = canvas.width / 2;
  newGameOver.height = canvas.height / 1.2;
  const newWidth = window.innerWidth * 0.8;
  const newHeight = window.innerHeight * 0.8;
  console.log(`W: ${window.innerWidth}  H: ${window.innerHeight}`);
  canvas.width = newWidth;
  canvas.height = newHeight;
  const scaleX = newWidth / window.innerWidth + 0.3;
  const scaleY = newHeight / window.innerHeight + 0.3;
  newChest.width = 190 * scaleX;
  newChest.height = 150 * scaleY;
  const ascaleX = window.innerWidth / screen.width;
  const ascaleY = window.innerHeight / screen.height;

  getTimeBar1.css(
    "transform",
    `translate(-80%, 0%) scale(${ascaleX}, ${ascaleY})`
  );

  getTimeBar2.css(
    "transform",
    `scale(${ascaleX}, ${ascaleY})`
  );
  getScore.css(
    "transform",
    `scale(${ascaleX}, ${ascaleY})`
  );
  console.log(scaleX, scaleY);
  items.forEach((item) => {
    item.width = item.initialSize * scaleX;
    item.height = item.initialSize * scaleY;
    console.log(item.width, item.height);
  });
  getTable.css(
    "transform",
    `translate(-50%, -50%) scaleX(${scaleX}) scaleY(${scaleY})`
  );
  getBackButton.css(
    "transform",
    `translate(0%, 0%) scaleX(${ascaleX}) scaleY(${ascaleY})`
  );
}
function resizeOnLoad() {
  newChest.y = canvas.height;
  newGameOver.x = canvas.width / 4;
  newGameOver.y = canvas.height / 3;
  newGameOver.width = canvas.width / 2;
  newGameOver.height = canvas.height / 1.2;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeOnLoad);
