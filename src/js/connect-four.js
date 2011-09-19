/**
 * Connect Four game javascript functions.
 * Connect Four javascript is a collection of javascript functions 
 * that can be used to play the traditional Connect Four game. It 
 * conceptually separates the internal data and UI, so it's easier
 * to maintain and work with HTML/CSS files.
 *
 * @version 1.0
 * @auther Chung-Yi Chi
 * @date Sep 5, 2011
 */

// Namespace for constants and global variables
var C4 = {
   // Constants.
   COL_SIZE  : 7,
   ROW_SIZE  : 6, 
   H_SPACE   : 15,
   V_SPACE   : 14,
   DISC_SIZE : 40,
   STR_MY_TURN : "My turn!",
   STR_WIN : "Woohoo! Win!",
   STR_TIE : "Tie! Not bad!",

   // Global variables.
   board    : null,
   moves    : null,   // Total moves now
   turn     : null,   // Whose turn now
   winner   : null,
   winPath  : null, 
   gameOver : null
};

/**
 * Initialize the game.
 * Create and initialize internal data structure and UI.
 */
function gameInit() {
   gameCoreInit();
   gameUIInit();
}

/**
 * Create and initialize internal data struture.
 */
function gameCoreInit() {
   // Create the board.
   if (C4.board == null) {
      C4.board = new Array(C4.COL_SIZE);
      for (var i = 0; i < C4.COL_SIZE; i++) {
         C4.board[i] = new Array(C4.ROW_SIZE);
      }
   }
   gameCoreReset();
}

/**
 * Create and initialize dynamic UI for the game.
 * Render slots in the dropping area and register event handlers.
 */
function gameUIInit() {
   var elemIdToAddSlots = 'drop-area';
   var elemIdReplay = 'replay';
   assert(document.getElementById(elemIdToAddSlots) != null, 
         "Element with id " + elemIdToAddSlots + " is null");
   assert(document.getElementById(elemIdReplay) != null, 
         "Element with id " + elemIdReplay + " is null");

   // Render dropping slots and register event handlers.
   for (var i = 0; i < C4.COL_SIZE; i++) {
      var slot = document.createElement('div');
      slot.setAttribute('id', 'slot' + i);
      slot.className = "slot";
      slot.style.marginLeft = C4.H_SPACE + "px"; 
      document.getElementById(elemIdToAddSlots).appendChild(slot);
      document.getElementById('slot' + i).onclick = (function(col){
         return function() {
            thisMove(col);
         };
      })(i);
   }

   // Register event handler for the replay button.
   document.getElementById('replay').onclick = function() {
      gameCoreReset();
      gameUIReset();
   };

   // Reset the UI.
   gameUIReset();
}

/**
 * Reset internal data structure for a new game.
 */
function gameCoreReset() {
   var board = C4.board;
   // Reset the board.
   for (var i = 0; i < C4.COL_SIZE; i++) {
      for (var j = 0; j < C4.ROW_SIZE; j++) {
         board[i][j] = null;
      }
   }

   // Reset game status.
   C4.turn = -1;
   C4.moves = 0;
   C4.winner = null;
   C4.winPath = new Array();
   C4.gameOver = false;
}

/**
 * Reset UI for a new game.
 */
function gameUIReset() {
   var elemIdToReset = 'board-inside', 
       elemIdPlayer0 = 'player0', 
       elemIdPlayer1 = 'player1', 
       elemIdSpeech0 = 'speech0', 
       elemIdSpeech1 = 'speech1';
   assert(document.getElementById(elemIdToReset) != null, 
         "Element with id " + elemIdToReset + " is null");
   assert(document.getElementById(elemIdPlayer0) != null, 
         "Element with id " + elemIdPlayer0 + " is null");
   assert(document.getElementById(elemIdPlayer1) != null, 
         "Element with id " + elemIdPlayer1 + " is null");
   assert(document.getElementById(elemIdSpeech0) != null, 
         "Element with id " + elemIdSpeech0 + " is null");
   assert(document.getElementById(elemIdSpeech1) != null, 
         "Element with id " + elemIdSpeech1 + " is null");

   // Clear all discs UI.
   var boardUI = document.getElementById(elemIdToReset);
   while ( boardUI.hasChildNodes() ) { 
      boardUI.removeChild( boardUI.firstChild );
   }

   // Reset avatar and speech bubble.
   document.getElementById(elemIdPlayer0).className = "player0-myturn";
   document.getElementById(elemIdPlayer1).className = "player1-normal";

   document.getElementById(elemIdSpeech0).className = "speech0-myturn";
   document.getElementById(elemIdSpeech0).innerHTML = C4.STR_MY_TURN;
   document.getElementById(elemIdSpeech1).className = "speech0-normal";
   document.getElementById(elemIdSpeech1).innerHTML = "";
}

/**
 * Update game status and UI given a move.
 * @param col - the col index that the player drops the disc.
 */
function thisMove(col) {
   // Check if it's a valid move.
   if (C4.gameOver || !isValidMove(col)) {
      return;
   }
   C4.turn = (C4.turn == 1 || C4.turn == -1) ? 0 : 1;
   C4.moves ++;

   // Update the board and UI.
   for (var row = C4.ROW_SIZE - 1; row >= 0; row--) {
      if (C4.board[col][row] == null) {
         updateCore(col, row);
         updateUI(col, row);
         break;
      }
   }
}

/**
 * Update game status given the coordinate of a move.
 * @param x - the x coord of the move.
 *        y - the y coord of the move.
 */
function updateCore(x, y) {
   var board = C4.board;
   board[x][y] = C4.turn;

   C4.winner = checkWinner(x, y);
   if (C4.winner != null)  // Someone wins
      C4.gameOver = true;
   if (C4.moves == C4.COL_SIZE * C4.ROW_SIZE)   // Tie
      C4.gameOver = true;
}

/**
 * Update UI given the coordinate of a move.
 * If game over, trigger awardPrize() after UI update animation.
 * @param x - the x coord of the move.
 *        y - the y coord of the move.
 */
function updateUI(x,y) {
   var elemIdToAddDisk = 'board-inside', 
       elemIdPlayer0 = 'player0', 
       elemIdPlayer1 = 'player1', 
       elemIdSpeech0 = 'speech0', 
       elemIdSpeech1 = 'speech1';
   assert(document.getElementById(elemIdToAddDisk) != null, 
         "Element with id " + elemIdToAddDisk + " is null");
   assert(document.getElementById(elemIdPlayer0) != null, 
         "Element with id " + elemIdPlayer0 + " is null");
   assert(document.getElementById(elemIdPlayer1) != null, 
         "Element with id " + elemIdPlayer1 + " is null");
   assert(document.getElementById(elemIdSpeech0) != null, 
         "Element with id " + elemIdSpeech0 + " is null");
   assert(document.getElementById(elemIdSpeech1) != null, 
         "Element with id " + elemIdSpeech1 + " is null");

   // Drop a disc to its destination.
   var newDisc = document.createElement('div');
   newDisc.setAttribute('id', 'disc' + x + y);
   newDisc.className = "disc" + C4.turn;
   var xOffset = C4.H_SPACE + x * (C4.DISC_SIZE + C4.H_SPACE);
   var yOffset = C4.V_SPACE + y * (C4.DISC_SIZE + C4.V_SPACE);
   newDisc.style.marginLeft = xOffset + "px";
   document.getElementById(elemIdToAddDisk).appendChild(newDisc);
   $("#disc" + x + y).animate({marginTop: '+=' + yOffset}, "slow", (function(gameOver) {
         return function() {
            if (gameOver)  awardPrize(); 
            else {
               // Update avatar and speech bubble for next turn.
               if (C4.turn == 1) {
                  document.getElementById(elemIdPlayer0).className = "player0-myturn";
                  document.getElementById(elemIdPlayer1).className = "player1-normal";
                  document.getElementById(elemIdSpeech0).className = "speech0-myturn";
                  document.getElementById(elemIdSpeech0).innerHTML = C4.STR_MY_TURN;
                  document.getElementById(elemIdSpeech1).className = "speech0-normal";
                  document.getElementById(elemIdSpeech1).innerHTML = "";
               } else if (C4.turn == 0) {
                  document.getElementById(elemIdPlayer0).className = "player0-normal";
                  document.getElementById(elemIdPlayer1).className = "player1-myturn";
                  document.getElementById(elemIdSpeech0).className = "speech0-normal";
                  document.getElementById(elemIdSpeech0).innerHTML = "";
                  document.getElementById(elemIdSpeech1).className = "speech1-myturn";
                  document.getElementById(elemIdSpeech1).innerHTML = C4.STR_MY_TURN;
               }
            }
         }
   })(C4.gameOver));
}

/**
 * Validate a move given the column index.
 * @param col - the column index of the move
 * @return true - if it's a valid move
 *         false - if it's an invalid move
 */
function isValidMove(col) {
   return (C4.board[col][0] == null) ? true : false;
}

/**
 * Check if there is winner given the last move.
 * It also updates the global status, C4.winPath.
 * @param curCol - the column index of the last move.
 *        curRow - the row index of the last move.
 * @return the winner if any; otherwise, null.
 */
function checkWinner(curCol, curRow) {
   // Check row.
   var rowPath = new Array([curCol, curRow]);
   var rowCont = 1 + dCount(curCol-1, curRow, -1, 0, rowPath) + dCount(curCol+1, curRow, 1, 0, rowPath);
   if (rowCont >= 4)    C4.winPath.push(rowPath);

   // Check column.
   var colPath = new Array([curCol, curRow]);
   var colCont = 1 + dCount(curCol, curRow-1, 0, -1, colPath) + dCount(curCol, curRow+1, 0, 1, colPath);
   if (colCont >= 4)    C4.winPath.push(colPath);

   // Check diagonal.
   var diaPath = new Array([curCol, curRow]);
   var diaCont = 1 + dCount(curCol-1, curRow-1, -1, -1, diaPath) + dCount(curCol+1, curRow+1, 1, 1, diaPath);
   if (diaCont >= 4)    C4.winPath.push(diaPath);

   // Check anti-diagonal.
   var adiPath = new Array([curCol, curRow]);
   var adiCont = 1 + dCount(curCol+1, curRow-1, 1, -1, adiPath) + dCount(curCol-1, curRow+1, -1, 1, adiPath);
   if (adiCont >= 4)    C4.winPath.push(adiPath);

   if (rowCont >= 4 || colCont >= 4 || diaCont >= 4 || adiCont >= 4)
      return C4.board[curCol][curRow];
   return null;
}

/**
 * Count the continuous number of an element in a 2D array
 * in a specific direction, and record the path.
 * @param x - the x coord of the start point
 *        y - the y coord of the start point
 *        dx - the x step size of the vector
 *        dy - the y step size of the vector
 * @return the max continuous number of the same element.
 */
function dCount(x, y, dx, dy, path) {
   if (x < 0 || x == C4.COL_SIZE || y < 0 || y == C4.ROW_SIZE || C4.board[x][y] != C4.turn)
      return 0;
   path.push([x, y]);
   return 1 + dCount(x + dx, y + dy, dx, dy, path);
}

/**
 * Show game result at the end.
 * Animate winner's path and show corresponding avatar.
 * @return false if failed.
 */
function awardPrize() {
   var elemIdPlayer0 = 'player0', 
       elemIdPlayer1 = 'player1', 
       elemIdSpeech0 = 'speech0', 
       elemIdSpeech1 = 'speech1';
   assert(document.getElementById(elemIdPlayer0) != null, 
         "Element with id " + elemIdPlayer0 + " is null");
   assert(document.getElementById(elemIdPlayer1) != null, 
         "Element with id " + elemIdPlayer1 + " is null");
   assert(document.getElementById(elemIdSpeech0) != null, 
         "Element with id " + elemIdSpeech0 + " is null");
   assert(document.getElementById(elemIdSpeech1) != null, 
         "Element with id " + elemIdSpeech1 + " is null");

   if (C4.gameOver && C4.winner == null) {            // Tie
      document.getElementById(elemIdPlayer0).className = "player0-win";
      document.getElementById(elemIdPlayer1).className = "player1-win";
      document.getElementById(elemIdSpeech0).className = "speech0-win";
      document.getElementById(elemIdSpeech1).className = "speech1-win";
      document.getElementById(elemIdSpeech0).innerHTML = C4.STR_TIE;
      document.getElementById(elemIdSpeech1).innerHTML = C4.STR_TIE;
   
   } else if (C4.gameOver && C4.winner != null) {     // Someone wins
      // Animate winner's path.
      for (var i = 0; i < C4.COL_SIZE; i++) {
         for (var j = 0; j < C4.ROW_SIZE; j++) {
            $('#disc' + i + j).animate({"opacity": "0.3"}, "slow");
         }
      }
      for (var i = 0; i < C4.winPath.length; i++) {
         for (var j = 0; j < C4.winPath[i].length; j++) {
            var id = '#disc' + C4.winPath[i][j][0] + C4.winPath[i][j][1];
            $(id).animate({"opacity": "1"}, "fast");;
         }
      }

      // Update avatar and speech bubble.
      var winner = C4.winner;
      var loser = (C4.winner == 0) ? 1 : 0;
      document.getElementById('player' + winner).className = "player" + winner + "-win";
      document.getElementById('player' + loser).className = "player" + loser + "-lose";
      document.getElementById('speech' + winner).className = "speech" + winner + "-myturn";
      document.getElementById('speech' + winner).innerHTML = C4.STR_WIN;
      document.getElementById('speech' + loser).className = "speech" + loser + "-normal";
      document.getElementById('speech' + loser).innerHTML = "";
   }
}

function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
   return 'AssertException: ' + this.message;
}

function assert(exp, message) {
   if (!exp) {
      throw new AssertException(message);
   }
}
