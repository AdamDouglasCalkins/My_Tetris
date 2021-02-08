const cvs =  document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "WHITE";//color of an empty space

function myFunction() { //creates the audio ellement that can be listened to while playing tetris
  var x = document.createElement("AUDIO");

  if (x.canPlayType("audio/mpeg")) {
    x.setAttribute("src","complete-history-of-the-soviet-union-arranged-to-the-melody-of-tetris.mp3");
  } else {
    x.setAttribute("src","complete-history-of-the-soviet-union-arranged-to-the-melody-of-tetris.ogg");
  }

  x.setAttribute("controls", "controls");
  document.body.appendChild(x);
}
myFunction();


//draws a square
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ, y*SQ, SQ, SQ);

	ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ, y*SQ, SQ, SQ);
}

//drawSquare(0,0,"red");//draws a single square for example

// create the board

let board = [];
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

// draw the board
function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

// the pieces and their colors
//aka change this array for color changes
const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

// intiate a piece
/*
let p = new Piece( PIECES[0][0],PIECES[0][1]);
*/

//generate a random piece
function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece(PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();

//The object Piece
function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // we start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    // we need to control the pieces
    this.x = 3;
    this.y = -2;
}

//fill function
Piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            //draw only the occupied squares
            if(this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

//draw a piece to the board
Piece.prototype.draw = function(){
    this.fill(this.color);
}

//p.draw();//draws a piece to the coard really quick to check function

// undraw a piece
Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}

// move the piece DOWN

Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // we lock the piece in place and generate a new one
        this.lock();
        p = randomPiece();
    }
}
//p.moveDown();//quickly test move down

// move the piece RIGHT
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }else{
        // we lock the piece in place and generate a ew one
    }
    
}

// move the piece LEFT
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }else{
        // we lock the piece in place and generate a ew one
    }
}

// ROTATE the piece
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;

    if(this.collision(0,0,nextPattern)){
        if(this.x > COL / 2){
            //it's the right wall
            kick = -1;//we need to kich the peice to the left
        }else{
            //it's the left wall
            kick = 1;//we need to kick peice to the right
        }
    }
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0 + 1) % 4 = 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;
Piece.prototype.lock = function(){
	let rCount = 0;//variable to count how many rows are full at once set to zero
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            //skip the vacant squares
            if(!this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                alert("Game Over");
                //stop request animation frames
                gameOver = true;
                break;
            }
            //lock the pieces
            board[this.y+r][this.x+c] = this.color;
        }
    }
    //remove full rows
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for(c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT)
        }
        if(isRowFull){
            //if the row is full, we move all the rows above it down
			rCount += 1;//increment the full row counter
            for(y = r; y > 1; y--){
                for(c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            //top row has no row above it
            for(c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            //increment the score loops accumulate for multi row scores
			score += 100;//Single = 1 line
			if (rCount == 2)
				score += 100;//Double = 3 lines
			if (rCount == 3)
				score += 100;//Triple = 5 lines
			if (rCount == 4)
				score += 200;//Tetris = 8 lines
        }
    }
	/*if (rCount == 1)
				score += 1;
			else if (rCount == 3)
				score += 2;
			else if (rCount == 6)
				score += 3;
			else if (rCount == 10)
				score += 4;*/
    //update the board
    drawBoard();

    //update the Score
    scoreElement.innerHTML = score;
}

// collision detection function
Piece.prototype.collision = function (x, y, piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // if the square is empty we skip it
            if(!piece[r][c]){
                continue;
            }
            //coordinates of the piece after the movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            //coonditions
            if(newX < 0 || newX > COL || newY >= ROW){
                return true;
            }
            //skip newY < 0; board[-1] will crash our game
            if(newY <0){
                continue;
            }
            //check if there is already a locked piece on the board in the same place
            if(board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

//CONTROL the piece
document.addEventListener("keydown", CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}

// drop the piece every single second

let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();

