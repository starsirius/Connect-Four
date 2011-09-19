/**
 * Connect Four game unit testing.
 * Connect Four game unit testing is a collection of unit tests
 * that test core functions of the Connect Four game javascript.
 * It uses QUnit javascript unit teseting framework.
 * 
 * @version 1.0
 * @auther Chung-Yi Chi
 * @date Sep 5, 2011
 */ 

function testCases() {
   module("Core");

   test("Global environment", function() {
         expect(11);
         notEqual(C4.COL_SIZE, undefined, "Column size is not undefined");
         notEqual(C4.ROW_SIZE, undefined, "Row size is not undefined");
         notEqual(C4.H_SPACE, undefined, "H space is not undefined");
         notEqual(C4.V_SPACE, undefined, "V space is not undefined");
         notEqual(C4.DISC_SIZE, undefined, "Disc size is not undefined");
         notDeepEqual(C4.board, undefined, "Board is not undefined");
         notDeepEqual(C4.moves, undefined, "Current toatl moves is not undefined");
         notDeepEqual(C4.turn, undefined, "Turn is not undefined");
         notDeepEqual(C4.winner, undefined, "Winner is not undefined");
         notDeepEqual(C4.winPath, undefined, "Winner's path is not undefined");
         notDeepEqual(C4.gameOver, undefined, "Game over is not undefined");
   });

   test("Game Core Initialization", function() {
         gameCoreInit();
         var length = 0;
         for (var i = 0; i < C4.board.length; i++) {
            length += C4.board[i].length;
         }
         equal(length, C4.COL_SIZE * C4.ROW_SIZE, "Board size is equal to the constant");

         gameCoreReset();
         for (var i = 0; i < C4.board.length; i++) {
            for (var j = 0; j < C4.board[i].length; j++) {
               deepEqual(C4.board[i][j], null, "Element (" + i + ", " + j + ") is null");
            }
         }
         equal(C4.turn, -1, "Initial turn is -1");
         equal(C4.moves, 0, "Initial moves is 0");
         deepEqual(C4.winner, null, "Winner is null");
         deepEqual(C4.winPath instanceof Array, true, "Winner's path is an array");
         deepEqual(C4.winPath.length, 0, "Winner's path is empty");
         equal(C4.gameOver, false, "It's not game over");
   });

   test("Check Winner", function() {
         C4.turn = 0;
         C4.winPath = new Array();
         C4.board = [ [null, null, null, null, null,    0], 
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null] ];
                      
         deepEqual(checkWinner(0, 5), null, "No winner for the first drop");
         deepEqual(C4.winPath.length, 0, "The winner's path is empty");


         C4.board = [ [null, null, null, null, null,    0], 
                      [null, null, null, null,    0,    1],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null] ];

         deepEqual(checkWinner(0, 5), null, "No winner for the second drop");
         deepEqual(checkWinner(1, 4), null, "No winner for the second drop");
         deepEqual(C4.winPath.length, 0, "The winner's path is empty");

         C4.board = [ [null, null, null, null,    1,    0], 
                      [null, null, null,    1,    1,    1],
                      [null, null, null, null,    0,    0],
                      [null, null, null, null,    1,    0],
                      [null, null, null, null, null,    0],
                      [null, null, null, null, null,    0],
                      [null, null, null, null, null, null] ];

         deepEqual(checkWinner(2, 4), null, "No winner for the drop");
         C4.winPath = new Array();
         deepEqual(checkWinner(4, 5),    0, "Winner 0 for the drop");
         deepEqual(C4.winPath[0].sort(), [[2, 5], [3, 5], [4, 5], [5, 5]], "Path is correct");
         C4.winPath = new Array();
         deepEqual(checkWinner(5, 5),    0, "Winner 0 for the drop");
         deepEqual(C4.winPath[0].sort(), [[2, 5], [3, 5], [4, 5], [5, 5]], "Path is correct");


         C4.board = [ [null, null, null, null,    1,    0], 
                      [null, null, null,    1,    1,    1],
                      [null, null,    0,    0,    0,    0],
                      [null, null, null, null,    1,    0],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null] ];

         C4.winPath = new Array();
         deepEqual(checkWinner(2, 2),    0, "Winner 0 for the drop");
         deepEqual(C4.winPath[0].sort(), [[2, 2], [2, 3], [2, 4], [2, 5]], "Path is correct");


         C4.board = [ [null, null, null, null,    1,    1], 
                      [null, null, null,    1,    1,    0],
                      [null, null, null,    0,    0,    0],
                      [null, null, null,    0,    1,    0],
                      [null, null,    0,    1,    0,    1],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null] ];

         deepEqual(checkWinner(2, 3), null, "No winner for the move")
         C4.winPath = new Array();
         deepEqual(checkWinner(3, 3),    0, "Winner 0 for the drop");
         deepEqual(C4.winPath[0].sort(), [[1, 5], [2, 4], [3, 3], [4, 2]], "Path is correct");
         C4.winPath = new Array();
         deepEqual(checkWinner(4, 2),    0, "Winner 0 for the drop");
         deepEqual(C4.winPath[0].sort(), [[1, 5], [2, 4], [3, 3], [4, 2]], "Path is correct");


         C4.board = [ [null, null, null,    1,    1,    1], 
                      [null, null,    0,    1,    1,    0],
                      [null, null, null,    0,    1,    1],
                      [null, null, null,    0,    0,    0],
                      [null, null,    0,    1,    0,    0],
                      [null, null, null, null, null, null],
                      [null, null, null, null, null, null] ];

         deepEqual(checkWinner(3, 3), null, "No winner for the move")
         deepEqual(checkWinner(4, 2), null, "No winner for the move")
         C4.winPath = new Array();
         deepEqual(checkWinner(1, 2),    0, "Winner 0 for the drop");
         deepEqual(C4.winPath[0].sort(), [[1, 2], [2, 3], [3, 4], [4, 5]], "Path is correct");
         C4.winPath = new Array();
         deepEqual(checkWinner(2, 3),    0, "Winner 0 for the drop");
         deepEqual(C4.winPath[0].sort(), [[1, 2], [2, 3], [3, 4], [4, 5]], "Path is correct");


         C4.board = [ [   1,    0,    1,    0,    1,    0], 
                      [   0,    1,    0,    1,    0,    1],
                      [   0,    1,    0,    1,    0,    1],
                      [   1,    0,    1,    0,    1,    0],
                      [   1,    0,    1,    0,    1,    0],
                      [   0,    1,    0,    1,    0,    1],
                      [   0,    1,    0,    1,    0,    1] ];

         deepEqual(checkWinner(1, 0), null, "No winner for the move")
         deepEqual(checkWinner(2, 0), null, "No winner for the move")
         deepEqual(checkWinner(5, 0), null, "No winner for the move")
         deepEqual(checkWinner(6, 0), null, "No winner for the move")
   });

   test("This Move", function() {
         var dropArea = document.createElement('div');
         dropArea.setAttribute('id', 'drop-area');
         document.body.appendChild(dropArea);
         var board = document.createElement('div');
         board.setAttribute('id', 'board');
         document.body.appendChild(board);
         var boardContainer = document.createElement('div');
         boardContainer.setAttribute('id', 'board-inside');
         document.body.appendChild(boardContainer);
         var player0 = document.createElement('div');
         player0.setAttribute('id', 'player0');
         document.body.appendChild(player0);
         var player1 = document.createElement('div');
         player1.setAttribute('id', 'player1');
         document.body.appendChild(player1);
         var speech0 = document.createElement('div');
         speech0.setAttribute('id', 'speech0');
         document.body.appendChild(speech0);
         var speech1 = document.createElement('div');
         speech1.setAttribute('id', 'speech1');
         document.body.appendChild(speech1);
         var replay = document.createElement('div');
         replay.setAttribute('id', 'replay');
         document.body.appendChild(replay);
         
         gameInit();

         var answer = [ [null, null, null, null,    1,    0], 
                        [null, null, null,    1,    1,    1],
                        [null, null,    1,    0,    0,    0],
                        [null, null, null, null,    0,    0],
                        [null, null, null, null, null, null],
                        [null, null, null, null, null, null],
                        [null, null, null, null, null, null] ];
         thisMove(0);   // player 0
         thisMove(1);
         thisMove(2);   // player 0
         thisMove(0);
         thisMove(2);   // player 0
         thisMove(1);
         thisMove(2);   // player 0
         thisMove(1);
         thisMove(3);   // player 0
         thisMove(2);
         thisMove(3);   // player 0

         deepEqual(C4.board, answer, "The board is correct");
         deepEqual(C4.winner, null, "No winner");
         deepEqual(C4.winPath.length, 0, "No winner's path");
         deepEqual(C4.turn, 0, "Last one is player 0's turn");
         deepEqual(C4.moves, 11, "Total moves is correct");
   });

}
