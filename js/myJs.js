import { Ball } from "./items.js";

export const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const beachBall = new Image();
beachBall.src = "../images/beach_ball.png";
const backGround = new Image();
backGround.src = "images/beach_background.jpg";
const gravity = 8;

let startTime = Date.now();
let totalTime = 0;

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
const timebarimg1 = new Image();
timebarimg1.src = "images/menu_design1.svg"

const backbutton = new Image();
backbutton.src = "images/backbutton.svg"

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
    if (assetsLoaded === 2) 
        drawScene();
};
beachBall.onload = function () {
    assetsLoaded++;
    if (assetsLoaded === 2) 
        drawScene();
};

function spawnBeachBall() {
    const itemImg = new Image();
    itemImg.src = "/images/beach_ball.png";
    const newItem = new Ball(100, 0, 4, 0,40,40, "positive", itemImg,0.9);
    items.push(newItem);
  }

  function updateItems() {
    items.forEach(item => item.update());
    items.forEach(item => item.draw(ctx));
    let newitems = [];
    for(let i = 0;i< items.length;i++)
        newitems = items.filter(item=>!item.isHit);
    items = newitems;
  }

function gameLoop() {
    const curTime = Date.now();
    gameState.gameTime++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
    updateItems();
    gameState.gameTime = curTime;
    requestAnimationFrame(gameLoop);
  }

gameLoop();
setInterval(() => {
    spawnBeachBall(); 
  }, 2000);
  setInterval(() => {
    totalTime++;
    console.log(totalTime);
  }, 1000);
  setInterval(() => {
    updateTimeBar();
  }, 50);
  
  