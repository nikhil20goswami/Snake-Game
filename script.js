const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem("highscore") || 0 ;
let score = 0;
let time = `00-00`;

highScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalID = null;

let timerIntervalId = null ;


let food = {x:Math.floor(Math.random() * rows) , y : Math.floor(Math.random() * cols)}

const blocks =[];
let snake = [{
    x:1 , y:5
} , {
    x:1 , y:6
} , {
    x:1 , y:7
}]

let direction = 'down';

for(let row = 0 ; row < rows ; row ++){
    for (let col = 0 ; col < cols ; col ++){
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;

    }
}


function render(){
    let head = null;

    
    blocks[`${food.x}-${food.y}`].classList.add("food");

    if (direction ==="left"){
        head = {x:snake[0].x , y:snake[0].y-1};
    }
    else if(direction === "right"){
        head = {x:snake[0].x , y:snake[0].y+1};
    }
    else if(direction === "down"){
        head = {x:snake[0].x+1 , y:snake[0].y};
    }
    else if(direction === "up"){
        head = {x:snake[0].x-1 , y:snake[0].y};
    }

    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >=cols){
        // alert("game Over");
        clearInterval(intervalID);
        intervalID = null;

        modal.style.display="flex";
        startGameModal.style.display = "none";
        gameOverModal.style.display = "flex";

        return;
    }

    // Food Consume Logic

    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {
            x:Math.floor(Math.random() * rows) , y : Math.floor(Math.random() * cols)
        }
        blocks[`${food.x}-${food.y}`].classList.add("food");

        snake.unshift(head);

        score += 10;
        scoreElement.innerText = score;

        if(score > highScore){
            highScore = score ; 
            highScoreElement.innerText = highScore;
            localStorage.setItem("Highscore" , highScore);
        }
        
    }

    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })
    
    snake.unshift(head);
    snake.pop();

    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })
}

startButton.addEventListener("click",()=>{
    modal.style.display = "none";

    clearInterval(intervalID);

    intervalID = setInterval(() => {
        render()
    }, 300);
    
    timerIntervalId = setInterval(() => {
        let [min , sec ] = time.split("-").map(Number);

        if(sec==59){
            min += 1;
            sec = 0 ;
        }
        else{
            sec += 1;
        }

        time =`${min}-${sec}`;
        timeElement.innerText = time;
    },1000);
})

restartButton.addEventListener("click",restartGame)

function restartGame() {
    clearInterval(intervalID);
    intervalID = null;

    Object.values(blocks).forEach(block => {
        block.classList.remove("fill", "food");
    });

    snake = [
        { x: 1, y: 5 },
        { x: 1, y: 6 },
        { x: 1, y: 7 }
    ];

    direction = "left";
    score = 0;
    scoreElement.textContent = score;

    time = "00-00";
    timeElement.textContent = time;

    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };

    while (snake.some(segment =>
        segment.x === food.x && segment.y === food.y
    )) {
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        };
    }

    blocks[`${food.x}-${food.y}`].classList.add("food");

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });

    startGameModal.style.display = "none";
    gameOverModal.style.display = "none";
    modal.style.display = "none";

    intervalID = setInterval(() => {
        render();
    }, 300);
}



addEventListener("keydown" , (event)=>{
    if(event.key == "ArrowUp"){
        direction = "up";
    }
    else if(event.key == "ArrowLeft"){
        direction = "left";
    }
    else if(event.key == "ArrowRight"){
        direction = "right";
    }
    else if(event.key == "ArrowDown"){
        direction = "down";
    }
})
