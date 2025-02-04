// Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let cube = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  color: 'blue',
  velocityX: 0,
  velocityY: 0,
  isJumping: false,
  hasDoubleJump: false,  // Track if double jump is available
  jumpHeight: -10,
  gravity: 0.05,
  previousY: 0
};

// Platforms array
let platforms = [];
let numPlatforms = 15;

// Generate random platforms
function generatePlatforms() {
  platforms = [];
  for (let i = 0; i < numPlatforms; i++) {
    let platformWidth = Math.random() * 150 + 50;
    let platformHeight = 50;
    let platformX = Math.random() * (canvas.width - platformWidth - 200);
    let platformY = Math.random() * (canvas.height - platformHeight + 500);
    platforms.push({
      x: platformX,
      y: platformY,
      width: platformWidth,
      height: platformHeight,
      color: 'green'
    });
  }
}

// Keyboard controls
let keys = {};
let spacePressed = false;
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
  if (e.key === ' ') {
    spacePressed = false;
  }
});

// Game loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 
  // Store previous position
  cube.previousY = cube.y;

  // Update cube position
  cube.x += cube.velocityX;
  cube.x = Math.max(0, Math.min(canvas.width - cube.width, cube.x));

  if (keys['a'] || keys['A']) {
    cube.velocityX = -5;
  } else if (keys['d'] || keys['D']) {
    cube.velocityX = 5;
  } else {
    cube.velocityX = 0;
  }

  // Jumping logic
  if (keys[' '] && !spacePressed) {
    spacePressed = true;
    if (!cube.isJumping) {
      cube.isJumping = true;
      cube.velocityY = cube.jumpHeight;
    } else if (cube.hasDoubleJump) {
      cube.velocityY = cube.jumpHeight;
      cube.hasDoubleJump = false;
    }
  }

  // Apply gravity
  cube.velocityY += cube.gravity;
 
  // Update vertical position - ensure cube stays within canvas bounds and starts to fall when it reaches the top
  cube.y = Math.max(0, Math.min(canvas.height - cube.height, cube.y));
  cube.y += cube.velocityY;
 if (cube.y <= 0) {
    cube.velocityY = 0;
 }
  
  
 
  // Check for platform collisions
  let isOnPlatform = false;
  platforms.forEach(platform => {
    // First check for landing on top of platform
    if (cube.x + cube.width > platform.x &&
        cube.x < platform.x + platform.width &&
        cube.previousY + cube.height <= platform.y &&
        cube.y + cube.height > platform.y &&
        cube.velocityY > 0) {
      cube.y = platform.y - cube.height;
      cube.velocityY = 0;
      isOnPlatform = true;
      cube.isJumping = false;
    }
    // Then check for collision with platform from below
    else if (cube.x + cube.width > platform.x &&
             cube.x < platform.x + platform.width &&
             cube.y <= platform.y + platform.height &&
             cube.previousY >= platform.y + platform.height) {
      cube.y = platform.y + platform.height;
      cube.velocityY = 0;
    }
    // Finally check for side collisions
    else if (cube.y + cube.height > platform.y &&
             cube.y < platform.y + platform.height) {
      // Collision with left side of platform
      if (cube.x + cube.width > platform.x &&
          cube.x + cube.width < platform.x + platform.width) {
        cube.x = platform.x - cube.width;
      }
      // Collision with right side of platform
      else if (cube.x < platform.x + platform.width &&
               cube.x > platform.x) {
        cube.x = platform.x + platform.width;
      }
    }
  });

  // Ground collision
  if (cube.y + cube.height > canvas.height) {
    cube.y = canvas.height - cube.height;
    cube.velocityY = 0;
    cube.isJumping = false;
    isOnPlatform = true;
  }


  // Draw platforms
  platforms.forEach(platform => {
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  // Draw cube
  ctx.fillStyle = cube.color;
  ctx.fillRect(cube.x, cube.y, cube.width, cube.height);

  requestAnimationFrame(loop);
}

// Initialize platforms
generatePlatforms();

loop();