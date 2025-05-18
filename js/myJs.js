import { Ball, Chest } from "./items.js";

export const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const getTable = $("table");
const getBackButton = $("#back");

const beachBall = new Image();
beachBall.src = "../images/beach_ball.png";
const backGround = new Image();
backGround.src = "images/beach_background.jpg";
const gravity = 8;

let startTime = Date.now();
let totalTime = 0;
let score = 0;


const chestImg = new Image();
chestImg.src = "/images/chest_1.png";
const newChest = new Chest(0, 1, 0,190,150, chestImg);

let items = [];
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
    const newItem = new Ball(100, 0, 4, 0,80,80, "positive", itemImg,0.9);
    items.push(newItem);
  }

  function updateItems() {
    items.forEach(item => {
  if (isColliding(newChest, item)) {
    item.isHit = true;
    score++;
  }
 });
    items.forEach(item => item.update());
    items.forEach(item => item.draw(ctx));
    let newitems = [];
    for(let i = 0;i< items.length;i++)
        newitems = items.filter(item=>!item.isHit);
    items = newitems;
  }
 
  function updateChest(){
    newChest.update(KEYS);
    newChest.draw(ctx);
  }

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
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
    requestAnimationFrame(gameLoop);
  }

gameLoop();
setInterval(() => {
    spawnBeachBall(); 
  }, 2000);
  setInterval(() => {
    totalTime++;
    console.log(`Time: ${totalTime}`);
  }, 1000);
  setInterval(() => {
    updateTimeBar();
  }, 50);
  

function resizeCanvas() {
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
resizeCanvas();
window.addEventListener('resize', resizeCanvas);