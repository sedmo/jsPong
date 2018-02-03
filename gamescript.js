var canvas = document.getElementById('gameCanvas');
var canvasContext = canvas.getContext('2d');

//global properties

//ball properties
var ballX = 50;
var ballY = 299;
var ballSpeedX = 8;
var ballSpeedY = 4;

//paddle properties
var paddle1Y = 262;
var paddle2Y = 262;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

//score properties
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

//global variables
var showingWinScreen = false;

function colorRect(leftX, topY, width, height, drawColor) {

  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);

}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

//----------------------------------------

window.onload = function() {

  var framesPerSecond = 30;

  console.log('Initiating game');


  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener('mousemove',
    function(evt) {
      var mousePos = calculateMousePos(evt);

      //mouse position in middle/ half of paddle height
      paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
    })


}

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  //takes horizontal position and subtracts canvas and position scrolled to
  //makes position relative
  var mouseX = evt.clientX - rect.left - root.scrollLeft;

  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }

}



//computer AI: moves vertical position to try to prevent ballReset()
function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
  if ((ballY + 35) < paddle2YCenter) {
    paddle2Y -= 6;
  } else if ((ballY - 35) > paddle2YCenter) {
    paddle2Y += 6;
  }

}


//controls movement of game
function moveEverything() {

  computerMovement();
  //horizontal position is moved +ballSpeedX every interval
  ballX += ballSpeedX;

  //vertical position is moved +ballSpeedY every interval
  ballY += ballSpeedY;

  //ternary operator #FTW

  //when ball passes the right side goes back at same speed in opposite
  //direction

  ballY > canvas.height ? ballSpeedY = -ballSpeedY : ballSpeedY;

  ballY < 0 ? ballSpeedY = -ballSpeedY : ballSpeedY;

  //when ball is looping back and reaches 0 it turns back in opposite direction
  //at same speed
  if (ballX < PADDLE_THICKNESS) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {

      //ball position - center of paddle
      var deltaY = ballY - (paddle1Y + (PADDLE_HEIGHT / 2));

      ballSpeedY = deltaY * 0.45;
      ballSpeedX = -ballSpeedX;

    } else if (ballX < 0){
      player2Score++; //must be before ballReset()
      ballReset();

    }
  }

  if (ballX > (canvas.width - PADDLE_THICKNESS)) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {

      var deltaY = ballY - (paddle2Y + (PADDLE_HEIGHT / 2));

      ballSpeedY = deltaY * 0.35;


      ballSpeedX = -ballSpeedX;

    } else if (ballX > canvas.width) {
      player1Score++; //must be before ballReset()
      ballReset();

    }

  }


}

//resets ball everytime player scores
function ballReset() {

  //check if player wins
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {

    showingWinScreen = true;
  }

  //ball position returns to middle of screen
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;

  //ball moves in alternate direction from before the reposition
  ballSpeedX = -ballSpeedX;


}

function drawNet(){
  for (var i = 0; i < canvas.height; i+=40) {
    colorRect((canvas.width/2)-1,i,2,20,'white');
  }
}

function drawEverything() {

  //simplifies drawEverything() by compiling into one function




  function handleMouseClick(evt) {
    if (showingWinScreen) {
      player1Score = 0;
      player2Score = 0;
      showingWinScreen = false;
    }
  }

  if (showingWinScreen) {
    canvasContext.fillStyle = 'pink';
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("PLAYER 1 WON!!", 350, 500);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("PLAYER 2 WON!!", 350, 500);
    }
    canvasContext.fillText("click to continue", 350, 100);
    canvas.addEventListener('mousedown', handleMouseClick);
    return;
  }


  //background of game screen
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  //design
  //colorRect(250, 150, 300, 300, 'red');
  //colorRect(325, 225, 150, 150, 'white');

  //drawNet
  drawNet();

  //left player paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'green');

  //right computer paddle
  colorRect((canvas.width - PADDLE_THICKNESS), paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'green');

  //ball
  colorCircle(ballX, ballY, 10, 'pink');

  //score display text
  canvasContext.fillText(player1Score, 20, 175);
  canvasContext.fillText(player2Score, 780, 175);
}
