const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let bird = { x: 50, y: 200, vy: 0 };
let pipes = [];
let score = 0;
let gameOver = false;
let started = false;

function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bird.x, bird.y, 30, 30);
}

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    ctx.fillStyle = 'red';
    ctx.fillRect(pipes[i].x, 0, 80, pipes[i].topHeight);
    ctx.fillRect(pipes[i].x, pipes[i].topHeight + 150, 80, canvas.height);
  }
}

function update() {
  if (gameOver || !started) return;

  bird.y += bird.vy;
  bird.vy += 0.5;

  if (bird.y + 30 > canvas.height) {
    gameOver = true;
  }

  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    pipes.push({
      x: canvas.width,
      topHeight: Math.random() * (canvas.height - 150),
    });
  }

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2;
    if (pipes[i].x < -80) {
      pipes.splice(i, 1);
      score++;
    }
  }

  for (let i = 0; i < pipes.length; i++) {
    if (bird.x + 30 > pipes[i].x &&
        bird.x < pipes[i].x + 80 &&
        (bird.y < pipes[i].topHeight || bird.y + 30 > pipes[i].topHeight + 150)) {
      gameOver = true;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`Score: ${score}`, 10, 10);
  if (gameOver) {
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
  } else if (!started) {
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Tap to Start', canvas.width / 2, canvas.height / 2);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!started) {
    started = true;
    bird.y = 200;
    bird.vy = 0;
    pipes = [];
    score = 0;
    gameOver = false;
  } else if (!gameOver) {
    bird.vy = -6; // Reduced the velocity to make the game more playable
  }
  
});

loop();