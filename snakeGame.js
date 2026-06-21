let board = document.querySelector(".board");
let startBtn = document.querySelector(".btn-start");
let modal = document.querySelector(".modal");
let restart = document.querySelector(".restart-game");
let start = document.querySelector(".start-game");
let restartGame = document.querySelector(".btn-restart");
let highScoreElement = document.querySelector("#high-score");
let scoreElement = document.querySelector("#score");
let timeElement = document.querySelector("#time");

let boxHeight = 50;
let boxWidth =50;
let highScore = localStorage.getItem("highScore") || 0 ;
highScore = Number(highScore);
let score = 0;
let time = `00-00`;

highScoreElement.innerText = highScore;

let cols = Math.floor(board.clientWidth/boxWidth);
let rows = Math.floor(board.clientHeight/boxHeight);
let blocks = [];
let snake = [{x:1 , y:3}];
let direction = "down"
let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

let timerInterval = null;

for(let row = 0;row<rows;row++){
    for(let col = 0;col<cols;col++){
        let box = document.createElement("div");
        box.classList.add("box");
        board.appendChild(box);
        blocks[`(${row},${col})`] = box;
    }
}

function render(){
    let head = null;

    blocks[`(${food.x},${food.y})`].classList.add("fillSnake");

    if(direction==="left"){
        head = {x: snake[0].x , y: (snake[0].y)-1}
    }else if(direction==="right"){
        head = {x: snake[0].x , y: (snake[0].y)+1}
    }else if(direction==="top"){
        head = {x: (snake[0].x)-1 , y: (snake[0].y)}
    }else if(direction==="down"){
        head = {x: (snake[0].x)+1 , y: (snake[0].y)}
    }


    if(head.x<0 || head.x>rows || head.y<0 || head.y>cols){
        clearInterval(interval);
        modal.style.display = "flex";
        start.style.display = "none";
        restart.style.display = "flex";
        return;
    }

     snake.forEach((segment)=>{
        blocks[`(${segment.x},${segment.y})`].classList.remove("fill");
    })

    if(head.x == food.x && head.y == food.y){
        blocks[`(${food.x},${food.y})`].classList.remove("fillSnake");
        food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};
        blocks[`(${food.x},${food.y})`].classList.add("fillSnake");
        snake.unshift(head);

        score += 1;
        scoreElement.innerText = score;

        if(score>highScore){
            highScore = score;
            highScoreElement.innerText = highScore;
            localStorage.setItem("highScore",highScore);
        }
    }else{
        snake.unshift(head);
        snake.pop();
    }

    snake.forEach((segment)=>{
        blocks[`(${segment.x},${segment.y})`].classList.add("fill");
    })
}
render();

startBtn.addEventListener("click",()=>{
    modal.style.display = "none";
    interval = setInterval(()=>{render()},300);
    timerInterval = setInterval(()=>{
        let [min,sec] = time.split("-").map(Number);
        if(sec==59){
            min+=1;
            sec=0;
        }else{
            sec+=1;
        }
        time = `${min}-${sec}`;
        timeElement.innerText = time;
    },1000);
})

addEventListener("keydown",(event)=>{
    if(event.key=="ArrowUp"){
        direction="top";
    }else if(event.key=="ArrowDown"){
        direction="down";
    }else if(event.key=="ArrowRight"){
        direction="right";
    }else if(event.key=="ArrowLeft"){
        direction="left";
    }
})

restartGame.addEventListener("click",restartFun);
function restartFun(){
    clearInterval(interval);

    snake.forEach((segment)=>{
        blocks[`(${segment.x},${segment.y})`].classList.remove("fill");
    })

    blocks[`(${food.x},${food.y})`].classList.remove("fillSnake");
    
    snake = [{x:1 , y:3}];
    direction = "down";
    score = 0;
    scoreElement.innerText = score;
    time =`00-00`;
    time.innerText = time;

    food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

    modal.style.display = "none";
    
    render();

    interval = setInterval(render,300)
}

