import { Ball, Chest, Boom, GameOver } from "./items.js";

export const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const getTable = $("table");
const getBackButton = $("#back");

const gameOverImg = new Image();
gameOverImg.src = "/images/game_over.svg"
const newGameOver = new GameOver(canvas.width/2, canvas.height/2, canvas.width/4,canvas.height/4, gameOverImg);
const beachBall = new Image();
beachBall.src = "/images/beach_ball.png";
const backGround = new Image();
backGround.src = "images/beach_background.jpg";
const gravity = 8;

export let gameFinished = false;
let startTime = Date.now();
let totalTime = 0;
let score = 0;
let sign = 1;

let isPaused = false;

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    isPaused = true;
    console.log("Game paused");
  } else {
    isPaused = false;
    console.log("Game resumed");
  }
});

const chestImg = new Image();
chestImg.src = "/images/chest_1.png";
const newChest = new Chest(0, canvas.height, 0,190,150, chestImg);

let items = [];
let booms = [];
let assetsLoaded = 0;
export const gameState= {
    gameTime: 0,
    gameSpeed: 1
};
export const KEYS = {};

$(document).keydown(function(e){
    KEYS[e.key] = true;
});
$(document).keyup(function(e){
    KEYS[e.key] = false;
});

let curX = 56; //56dan baslio
const minBarX = 56;
const maxBarX = 1820;

const boomEffect = new Image();
boomEffect.src = "images/boom_effect.png"

const scoreBoard = new Image();
scoreBoard.src = "images/score.svg";

const timebarimg1 = new Image();
timebarimg1.src = "images/menu_design1.svg"

const backbutton = new Image();
backbutton.src = "images/backbutton.svg"

scoreBoard.onload = function () {
  const score = document.getElementById("score");
  score.style.width = (scoreBoard.naturalWidth)+ "px";
  score.style.backgroundImage = `url('${scoreBoard.src}')`;
  score.style.backgroundSize = "contain";
}

backbutton.onload = function () {
    const backButton = document.getElementById("back");
  backButton.style.width = (backbutton.naturalWidth * 0.5)+ "px";
  backButton.style.height = (backbutton.naturalHeight * 0.5) +"px";
  backButton.style.backgroundImage = `url('${backbutton.src}')`;
  backButton.style.backgroundSize = "contain";
    backButton.onclick = () => {
    window.location.href = "index.html";
};
}

timebarimg1.onload = function () {
  timebar1.style.backgroundImage = `url('${timebarimg1.src}')`;
  timebar1.style.backgroundPosition = "-920px -2346px";

  timebar2.style.backgroundImage = `url('${timebarimg1.src}')`;
  timebar2.style.backgroundPosition = "-920px -2164px";
};

function updateTimeBar(){
    curX += (maxBarX-minBarX)/(30*20);
    if(curX >= maxBarX)
        curX = 56;  
     timebar2.style.width =`${curX}px`;
}

function drawScene(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
     ctx.drawImage(backGround,0,0,canvas.width,canvas.height);
}

backGround.onload = function () {
    assetsLoaded++;
    if (assetsLoaded === 3) 
        drawScene();
};
beachBall.onload = function () {
    assetsLoaded++;
    if (assetsLoaded === 3) 
        drawScene();
};
chestImg.onload = function () {
    assetsLoaded++;
    if (assetsLoaded === 3) 
        drawScene();
};

function spawnBeachBall() {
    const itemImg = new Image();
    itemImg.src = "/images/beach_ball.png";
    const random = Math.floor(Math.random() * (10 - 3)) + 4;
    let size = random *10;
    let velocity = random;
    let startX = size/10;
    if(sign === -1)
      startX = canvas.width -size;
    const newItem = new Ball(startX, size/10, sign*velocity,-velocity/2,size,size, "positive", itemImg,0.9);
    items.push(newItem);
  }

  function updateItems() {
    items.forEach(item => {
  if (isColliding(newChest, item)) {
    item.isHit = true;
    score += 14-item.width/10;
  }
 });
    items.forEach(item => item.update());
    items.forEach(item => item.draw(ctx));
    let newItems = [];
    for(let i = 0;i< items.length;i++)
        newItems = items.filter(item=>!item.isHit);
    items = newItems;

    // boom here
    booms.forEach(boom => boom.draw(ctx));
    booms.forEach(boom => boom.update());
    for(let i = 0;i< items.length;i++){
      if(items[i].bounced == 3){
          console.log(`I have bounced: ${items[i].bounced}`);
      const newBoom = new Boom(items[i].x,items[i].y-(items[i].height/2), items[i].width*1.3,items[i].height*1.3, boomEffect);
      booms.push(newBoom);
        items[i].isHit = true;
      }
    }
    let newBooms = [];
        for(let i = 0;i< booms.length;i++)
        newBooms = booms.filter(boom=>!boom.end);
      booms = newBooms;
  }
 
  function updateChest(){
    newChest.update(KEYS);
    newChest.draw(ctx);
  }

  function updateGameOver(){


    newGameOver.update(score);
    newGameOver.draw(ctx,score);
  }

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width*0.9 &&
    rect1.x + rect1.width*0.9 > rect2.x &&
    rect1.y < rect2.y + rect2.height*0.7 &&
    rect1.y + rect1.height*0.7 > rect2.y
  );
}
function gameLoop() {
    const curTime = Date.now();
    gameState.gameTime++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
    updateItems();
    updateChest();
    gameState.gameTime = curTime;
    $("#scoreText").text("Score: " + score);
    if(gameFinished||isPaused){
      
    updateGameOver();
      
    }

    requestAnimationFrame(gameLoop);
  }

gameLoop();

setInterval(() => {
  if (gameFinished||isPaused) return;
    if (Math.random() < 0.5) 
      sign *=-1;
    spawnBeachBall(); 
  }, 2000);
  setInterval(() => {
  if (gameFinished||isPaused) return;
    totalTime++;
    console.log(`Time: ${totalTime}`);
    if(totalTime == 30)
      gameFinished = true;
  }, 1000);
  setInterval(() => {
  if (gameFinished||isPaused) return;
    updateTimeBar();
  }, 50);
  

function resizeCanvas() {
    newGameOver.x = canvas.width/4;
    newGameOver.y = canvas.height/3;
    newGameOver.width = canvas.width/2;
    newGameOver.height = canvas.height/1.2;
    const newWidth = window.innerWidth * 0.8;
    const newHeight = window.innerHeight * 0.8;
    console.log(`W: ${window.innerWidth}  H: ${window.innerHeight}`);
    canvas.width = newWidth;
    canvas.height = newHeight;
    const scaleX = window.innerWidth/screen.width;
    const scaleY = window.innerHeight/screen.height;
    getTable.css("transform", `translate(-50%, -50%) scaleX(${scaleX}) scaleY(${scaleY})`);
    getBackButton.css("transform", `translate(0%, 0%) scaleX(${scaleX}) scaleY(${scaleY})`);
}
function resizeOnLoad(){
    newChest.y = canvas.height;
    newGameOver.x = canvas.width/4;
    newGameOver.y = canvas.height/3;
    newGameOver.width = canvas.width/2;
    newGameOver.height = canvas.height/1.2;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeOnLoad);