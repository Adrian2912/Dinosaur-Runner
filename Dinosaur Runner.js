let isJumping, spawningInterval, speed, score = 0, timer, seconds, minutes, ballDestroyed;
const times = document.querySelectorAll("span"), edge = 2100;
for (let i = 0; i < 100; ++i) {
    let star = document.createElement("div");
    document.getElementById("sky").appendChild(star);
    star.classList.add("star");
    star.style.top = `${Math.floor(Math.random() * 100)}%`;
    star.style.right = `${Math.floor(Math.random() * 100)}%`;
}
startGame();

function startGame() {
    seconds = 0;
    minutes = 0;
    spawningInterval = 4000;
    speed = 1;
    score = 0;
    spawnball();
    for (let i = 0; i < times.length; ++i) {
        times[i].innerText = '00';
    }
    updateScore();
    timer = setInterval(countTime, 1000);
    let obstaclesSpawnRate = setTimeout(spawnObstacle, spawningInterval);  
}

function spawnball() {
    let ball = document.createElement("div");
    document.getElementById("gameScreen").appendChild(ball);
    ball.setAttribute("id", "purpleBall");
    ballDestroyed = false;
    document.addEventListener("keydown", ballControls);
    document.addEventListener("keyup", rise);
}

function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
}

function countTime() {
    ++seconds;
    if (seconds < 10) {
        times[1].innerText = '0' + seconds;
    } else {
        times[1].innerText = seconds;
        if (seconds % 30 === 0) {
            ++speed;
        }
        convertToMinutes();
    }
}

function convertToMinutes() {
     if (seconds === 60) {
        seconds = 0;
        times[1].innerText = '0' + seconds;
        ++minutes;
        if (spawningInterval > 1000) {
            spawningInterval -= 500;
        }
        if (minutes < 10) {
            times[0].innerText = '0' + minutes;
        } else {
            times[0].innerText = minutes;
        }
    }
}

function ballControls(e) {
    if (String(e.code) === "Space" && !isJumping) {
        jump();
    } else if (String(e.code) === "ArrowDown") {
        duck();
    } 
}      

function jump() {
    document.getElementById("purpleBall").classList.add("jumping");
        isJumping = true;
        let removal = setTimeout(() => {
            document.getElementById("purpleBall").classList.remove("jumping");
            isJumping = false;
    }, 2000);
}

function duck() {
    document.getElementById("purpleBall").style.height = "40px";
}

function rise() {
    document.getElementById("purpleBall").style.height = "60px"; 
}

function obstacleMovement(timestamp, obstacle, distance) {
    if (!ballDestroyed) {
        if (distance < edge) {
            distance += speed;
            obstacle.style.right = `${distance - 100}px`;
            checkCollisionBetweenBallAndObstacle(obstacle);
            requestAnimationFrame((timestamp) => obstacleMovement(timestamp, obstacle, distance));
        } else {
            document.getElementById("gameScreen").removeChild(obstacle); 
            ++score;
            updateScore();
        }
    }
}

function spawnObstacle() {
    if (!ballDestroyed) {
        let obstacle = document.createElement("div"), distance = 0, surface = Math.floor(Math.random() * (32 - 23.8 + 1) + 23.8);
        document.getElementById("gameScreen").appendChild(obstacle);
        obstacle.classList.add("obstacle");
        obstacle.style.width = `${Math.floor(Math.random() * (80 - 20 + 1) + 20)}px`;
        obstacle.style.height = `${Math.floor(Math.random() * (80 - 20 + 1) + 20)}px`;
        obstacle.style.bottom = `${surface}%`; 
        requestAnimationFrame((timestamp) => obstacleMovement(timestamp, obstacle, distance));
        obstaclesSpawnRate = setTimeout(spawnObstacle, spawningInterval);
    }
}

function checkCollisionBetweenBallAndObstacle(obstacle) {
    let obstacleCoordinates = obstacle.getBoundingClientRect();
    let ballCoordinates = document.getElementById("purpleBall").getBoundingClientRect();
    if ((ballCoordinates.x >= obstacleCoordinates.left && ballCoordinates.x <= obstacleCoordinates.right)  && (ballCoordinates.bottom >= obstacleCoordinates.top && ballCoordinates.top <= obstacleCoordinates.bottom)) {
        ballDestroyed = true;
        let destroyedBall = document.getElementById("purpleBall");
        if (isJumping) {
            destroyedBall.classList.remove("jumping");
            isJumping = false;
        }
        destroyedBall.removeEventListener("keydown", ballControls);
        destroyedBall.removeEventListener("keyup", rise);
        document.getElementById("gameScreen").removeChild(destroyedBall);
        clearInterval(timer);
        clearTimeout(obstaclesSpawnRate);
        createGameOverScreen();
    } 
} 

function createGameOverScreen() {
    let gameOverScreen = document.createElement("div");
    document.getElementById("gameScreen").appendChild(gameOverScreen);
    gameOverScreen.setAttribute("id", "gameOverScreen");
    let gameOverMessage = document.createElement("h1");
    gameOverScreen.appendChild(gameOverMessage);
    gameOverMessage.innerText = "Game Over!";
    let scoreMessage = document.createElement("p");
    gameOverScreen.appendChild(scoreMessage);
    scoreMessage.innerText = `Score: ${score}`;
    let restartButton = document.createElement("button");
    gameOverScreen.appendChild(restartButton);
    restartButton.innerText = "Restart";
    restartButton.setAttribute("id", "restartButton");
    restartButton.addEventListener("click", restartGame);
}

function clearObstacles() {
    const obstacles = document.querySelectorAll(".obstacle");
    for (let i = 0; i < obstacles.length; ++i) {
        document.getElementById("gameScreen").removeChild(obstacles[i]);
    }
}

function restartGame() {
    startGame();
    let gameOverScreen = document.getElementById("gameOverScreen");
    document.getElementById("gameScreen").removeChild(gameOverScreen);
    clearObstacles();
}
