const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const road = new Image();
road.src = 'images/road.png';
const car = new Image();
car.src = 'images/car.png';

let carPos = {
  x: (canvas.width - 50) / 2,
  y: canvas.height - 120
};

let isLeftArrow = false;
let isRightArrow = false;
let roadPosition = 0;
let obstacles = [];
let score = 0;

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') {
    isLeftArrow = true;
  } else if (event.key === 'ArrowRight') {
    isRightArrow = true;
  }
});

document.addEventListener('keyup', function (event) {
  if (event.key === 'ArrowLeft') {
    isLeftArrow = false;
  } else if (event.key === 'ArrowRight') {
    isRightArrow = false;
  }
});

function update() {
  // Move the car
  if (isLeftArrow && carPos.x > 0) {
    carPos.x -= 5;
  } else if (isRightArrow && carPos.x < canvas.width - 50) {
    carPos.x += 5;
  }

  // Move the road
  roadPosition += 5;
  if (roadPosition >= canvas.height) {
    roadPosition = 0;
  }

  // Generate obstacles
  if (Math.random() < 0.02) {
    let obstacleX = Math.random() * (canvas.width - 50); // Random x position for obstacle
    obstacles.push({ x: obstacleX, y: 0, width: 50, height: 50 }); // Add new obstacle to the array
  }

  // Move obstacles
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += 5; // Move obstacles downwards

    // Check collision with car
    if (carPos.x < obstacles[i].x + obstacles[i].width &&
      carPos.x + 50 > obstacles[i].x &&
      carPos.y < obstacles[i].y + obstacles[i].height &&
      carPos.y + 100 > obstacles[i].y) {
      // Collision detected, game over
      alert("Game Over! Your score: " + score);
      score = 0; // Reset score
      obstacles = []; // Clear obstacles array
    }

    // Check if obstacle passed the car without collision
    if (obstacles[i].y > canvas.height && !obstacles[i].passed) {
      score++; // Increment score
      obstacles[i].passed = true; // Mark obstacle as passed
    }
  }

  // Remove obstacles that have moved off the screen
  obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the road
  ctx.drawImage(road, 0, roadPosition, canvas.width, canvas.height);
  ctx.drawImage(road, 0, roadPosition - canvas.height, canvas.width, canvas.height);

  // Draw the car
  ctx.drawImage(car, carPos.x, carPos.y, 50, 100);

  // Draw obstacles
  ctx.fillStyle = 'red';
  for (let i = 0; i < obstacles.length; i++) {
    ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
  }

  // Display score
  document.getElementById('score').textContent = 'Score: ' + score;
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  gameLoop();
}

document.getElementById('start-button').addEventListener('click', startGame);