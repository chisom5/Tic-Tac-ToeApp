"use strict";


//==================================
// HELPER FUNCTIONS
//==================================
function sumArray(array) {
    var sum = 0,
        i = 0;
    for (i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
}

function isInArray(element, array) {
    if (array.indexOf(element) > -1) {
        return true;
    }
    return false;
}

function shuffleArray(array) {
    var counter = array.length,
        temp,
        index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function intRandom(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

// GLOBAL VARIABLES
var moves = 0,
    winner = 0,
    x = 1,
    o = 3,
    player = x,
    computer = o,
    whoseTurn = x,
    result = 0,
    gameOver = false,
    score = {
        ties: 0,
        player: 0,
        computer: 0
    },
    xText = "<span class=\"x\">&times;</class>",
    oText = "<span class=\"o\">o</class>",
    playerText = xText,
    computerText = oText,
    difficulty = 0,
    myGameLayout = null;

// Grid constructor
function GameLayout() {
    this.cells = new Array(9);
}

/*
 public function that enumerates the empty cells 
 @return [Array]: indices of all empty cells

*/
GameLayout.prototype.getFreeCellIndices = function() {

    var indx = [];
    for (var i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === 0) {
            indx.push(i);
        }
    }
    return indx;
};


// Get a row (accepts 0, 1, or 2 as argument).
// Returns the values of the elements.

GameLayout.prototype.getRowValues = function(index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Wrong arg for getRowValues!");
        return undefined;
    }
    var i = index * 3;
    return this.cells.slice(i, i + 3);
};

// Get a row (accepts 0, 1, or 2 as argument).
// Returns an array with the indices, not their values.
GameLayout.prototype.getRowIndices = function(index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Wrong arg for getRowValues!");
        return undefined;
    }
    var row = [];
    index = index * 3;
    row.push(index);
    row.push(index + 1);
    row.push(index + 2);

    return row;

};

// get a column (values)
GameLayout.prototype.getColumnValues = function(index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Wrong arg for getRowValues!");
        return undefined;
    }

    var col = [];
    for (var a = index; a < this.cells.length; a += 3) {
        col.push(this.cells[a]);
    }
    return col;
};

// get a column (indices)
GameLayout.prototype.getColumnIndices = function(index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Wrong arg for getRowValues!");
        return undefined;
    }

    var col = [];
    for (var a = index; a < this.cells.length; a += 3) {
        col.push(a);
    }
    return col;
};

//get the value for Diagonal
GameLayout.prototype.getDiagValues = function(arg) {
    var cellDiag = [];

    if (arg !== 1 && arg !== 0) {

        console.log("wrong arg passed");
        return undefined;

    } else if (arg === 0) {
        cellDiag.push(this.cells[0]);
        cellDiag.push(this.cells[4]);
        cellDiag.push(this.cells[8]);
    } else {
        cellDiag.push(this.cells[2]);
        cellDiag.push(this.cells[4]);
        cellDiag.push(this.cells[6]);
    }
    return cellDiag;
};

//get indices for diagonal
GameLayout.prototype.getDiagIndices = function(arg) {
    if (arg !== 1 && arg !== 0) {
        console.log("wrong arg passed");
        return undefined;
    } else if (arg === 0) {
        return [0, 4, 8];
    } else {
        return [2, 4, 6];
    }
};

// Get first index with two in a row (accepts computer or player as argument)
GameLayout.prototype.getFirstWithTwoInARow = function(agent) {
    if (agent !== computer && agent !== player) {
        console.error("Function getFirstWithTwoInARow accepts only player or computer as argument.");
        return undefined;
    }
    var sum = agent * 2,
        freeCells = shuffleArray(this.getFreeCellIndices());
    for (var i = 0; i < freeCells.length; i++) {
        for (var j = 0; j < 3; j++) {
            var rowV = this.getRowValues(j);
            var rowI = this.getRowIndices(j);
            var colV = this.getColumnValues(j);
            var colI = this.getColumnIndices(j);
            if (sumArray(rowV) == sum && isInArray(freeCells[i], rowI)) {
                return freeCells[i];
            } else if (sumArray(colV) == sum && isInArray(freeCells[i], colI)) {
                return freeCells[i];
            }
        }
        for (j = 0; j < 2; j++) {
            var diagV = this.getDiagValues(j);
            var diagI = this.getDiagIndices(j);
            if (sumArray(diagV) == sum && isInArray(freeCells[i], diagI)) {
                return freeCells[i];
            }
        }
    }
    return false;
};
//Reset game
GameLayout.prototype.reset = function() {
    for (var i = 0; i < this.cells.length; i++) {
        this.cells[i] = 0;
    }
    return true;
};

//==================================
// MAIN FUNCTIONS
//==================================

// executed when the page loads
function initialize() {
    myGameLayout = new GameLayout();
    moves = 0;
    winner = 0;
    gameOver = false;
    whoseTurn = player; // default, this may change
    for (var i = 0; i <= myGameLayout.cells.length - 1; i++) {
        myGameLayout.cells[i] = 0;
    }
    // setTimeout(assignRoles, 300);
    setTimeout(showOptions, 300);
    // debugger;
}

// Ask player if they want to play as X or O. X goes first.
function assignRoles() {
    askUser("Do you want to go first?");
    document.getElementById("yesBtn").addEventListener("click", makePlayerX);
    document.getElementById("noBtn").addEventListener("click", makePlayerO);
}

//function that response to the assignRole
function askUser(text) {
    document.getElementById("questionText").innerHTML = text;
    document.getElementById("feedback").style.display = "block";
}

//function to Select player turn
function makePlayerX() {
    player = x;
    computer = o;
    whoseTurn = player;
    playerText = xText;
    computerText = oText;
    document.getElementById("feedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
    document.getElementById("noBtn").removeEventListener("click", makePlayerO);

}

//function to Select computer turn
function makePlayerO() {
    player = o;
    computer = x;
    whoseTurn = computer;
    playerText = oText;
    computerText = xText;
    setTimeout(makeComputerMove, 400);
    document.getElementById("feedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
    document.getElementById("noBtn").removeEventListener("click", makePlayerO);
}


function showOptions() {
    if (player == o) {
        document.getElementById("rx").checked = false;
        document.getElementById("ro").checked = true;
    } else if (player == x) {
        document.getElementById("rx").checked = true;
        document.getElementById("ro").checked = false;
    }
    if (difficulty === 0) {
        document.getElementById("r0").checked = true;
        document.getElementById("r1").checked = false;
        document.getElementById("r2").checked = false;
    } else if (difficulty === 1) {
        document.getElementById("r0").checked = false;
        document.getElementById("r1").checked = true;
        document.getElementById("r2").checked = false;
    } else {
        document.getElementById("r0").checked = false;
        document.getElementById("r1").checked = false;
        document.getElementById("r2").checked = true;
    }
    document.getElementById("settingsDlg").style.display = "block";
}

// function for settings
function getSettings() {
    document.getElementById("settings").addEventListener("click", showOptions);

}

function restartGame(ask) {
    if (moves > 0) {
        var response = confirm("Are you sure you want to start over?");
        if (response === false) {
            return;
        }
    }
    gameOver = false;
    moves = 0;
    winner = 0;
    whoseTurn = player;
    myGameLayout.reset();
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.cursor = "pointer";
        document.getElementById(id).classList.remove("win-color");
    }
    if (ask === true) {
        // setTimeout(assignRoles, 200);
        setTimeout(showOptions, 200);
    } else if (whoseTurn == computer) {
        setTimeout(makeComputerMove, 800);
    }
}

function getOptions() {
    var diffs = document.getElementsByName('difficulty');
    for (var i = 0; i < diffs.length; i++) {
        if (diffs[i].checked) {
            difficulty = parseInt(diffs[i].value);
            break;
            // debugger;
        }
    }
    if (document.getElementById('rx').checked === true) {
        player = x;
        computer = o;
        whoseTurn = player;
        playerText = xText;
        computerText = oText;
    } else {
        player = o;
        computer = x;
        whoseTurn = computer;
        playerText = oText;
        computerText = xText;
        setTimeout(makeComputerMove, 400);
    }
    document.getElementById("settingsDlg").style.display = "none";
}

// executed when player clicks one of the table cells
function cellClicked(id) {
    // The last character of the id corresponds to the numeric index in Grid.cells:
    var idName = id.toString();
    var cell = parseInt(idName[idName.length - 1]);
    if (myGameLayout.cells[cell] > 0 || whoseTurn !== player || gameOver) {
        // cell is already occupied or something else is wrong
        return false;
    }
    moves += 1;
    document.getElementById(id).innerHTML = playerText;
    // randomize orientation (for looks only)
    // var rand = Math.random();
    // if (rand < 0.3) {
    //     document.getElementById(id).style.transform = "rotate(180deg)";
    // } else if (rand > 0.6) {
    //     document.getElementById(id).style.transform = "rotate(90deg)";
    // }
    // document.getElementById(id).style.cursor = "default";
    myGameLayout.cells[cell] = player;
    // Test if we have a winner:
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0) {
        whoseTurn = computer;
        makeComputerMove();
    }
    return true;
}

// The core logic of the game AI:
function makeComputerMove() {
    // debugger;
    if (gameOver) {
        return false;
    }
    var cell = -1,
        myArr = [],
        corners = [0, 2, 6, 8];
    if (moves >= 3) {
        cell = myGameLayout.getFirstWithTwoInARow(computer);
        if (cell === false) {
            cell = myGameLayout.getFirstWithTwoInARow(player);
        }
        if (cell === false) {
            if (myGameLayout.cells[4] === 0 && difficulty == 1) {
                cell = 4;
            } else {
                myArr = myGameLayout.getFreeCellIndices();
                cell = myArr[intRandom(0, myArr.length - 1)];
            }
        }
        //medium play
        // if (cell === false) {
        //     if (myGameLayout.cells[4] === 0 && difficulty == 2) {
        //         cell = 4;
        //     } else {
        //         myArr = myGameLayout.getFreeCellIndices();
        //         cell = myArr[intRandom(0, myArr.length - 1)];
        //     }
        // }


        // Avoid a catch-22 situation:
        if (moves == 3 && myGameLayout.cells[4] == computer && player == x && difficulty == 1) {
            if (myGameLayout.cells[7] == player && (myGameLayout.cells[0] == player || myGameLayout.cells[2] == player)) {
                myArr = [6, 8];
                cell = myArr[intRandom(0, 1)];
            } else if (myGameLayout.cells[5] == player && (myGameLayout.cells[0] == player || myGameLayout.cells[6] == player)) {
                myArr = [2, 8];
                cell = myArr[intRandom(0, 1)];
            } else if (myGameLayout.cells[3] == player && (myGameLayout.cells[2] == player || myGameLayout.cells[8] == player)) {
                myArr = [0, 6];
                cell = myArr[intRandom(0, 1)];
            } else if (myGameLayout.cells[1] == player && (myGameLayout.cells[6] == player || myGameLayout.cells[8] == player)) {
                myArr = [0, 2];
                cell = myArr[intRandom(0, 1)];
            }
        } else if (moves == 3 && myGameLayout.cells[4] == player && player == x && difficulty == 1) {
            if (myGameLayout.cells[2] == player && myGameLayout.cells[6] == computer) {
                cell = 8;
            } else if (myGameLayout.cells[0] == player && myGameLayout.cells[8] == computer) {
                cell = 6;
            } else if (myGameLayout.cells[8] == player && myGameLayout.cells[0] == computer) {
                cell = 2;
            } else if (myGameLayout.cells[6] == player && myGameLayout.cells[2] == computer) {
                cell = 0;
            }
        }
    } else if (moves === 1 && myGameLayout.cells[4] == player && difficulty == 1) {
        // if player is X and played center, play one of the corners
        cell = corners[intRandom(0, 3)];
    } else if (moves === 2 && myGameLayout.cells[4] == player && computer == x && difficulty == 1) {
        // if player is O and played center, take two opposite corners
        if (myGameLayout.cells[0] == computer) {
            cell = 8;
        } else if (myGameLayout.cells[2] == computer) {
            cell = 6;
        } else if (myGameLayout.cells[6] == computer) {
            cell = 2;
        } else if (myGameLayout.cells[8] == computer) {
            cell = 0;
        }
    } else if (moves === 0 && intRandom(1, 10) < 8) {
        // if computer is X, start with one of the corners sometimes
        cell = corners[intRandom(0, 3)];
    } else {
        // choose the center of the board if possible
        if (myGameLayout.cells[4] === 0 && difficulty == 1) {
            cell = 4;
        } else {
            myArr = myGameLayout.getFreeCellIndices();
            cell = myArr[intRandom(0, myArr.length - 1)];
        }
    }
    var id = "cell" + cell.toString();
    // console.log("computer chooses " + id);
    document.getElementById(id).innerHTML = computerText;
    document.getElementById(id).style.cursor = "default";

    myGameLayout.cells[cell] = computer;
    moves += 1;
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0 && !gameOver) {
        whoseTurn = player;
    }
}

//check winners
function checkWin() {
    winner = 0;

    //check rows
    for (var i = 0; i <= 2; i++) {
        var row = myGameLayout.getRowValues(i);
        if (row[0] > 0 && row[0] == row[1] && row[0] == row[2]) {
            if (row[0] == computer) {
                score.computer++;
                winner = computer;
                // console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                // console.log("player wins");
            }
            // Give the winning row/column/diagonal a different bg-color
            var tmpAr = myGameLayout.getRowIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    //check column
    for (var i = 0; i <= 2; i++) {
        var col = myGameLayout.getColumnValues(i);
        if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
            if (col[0] == computer) {
                score.computer++;
                winner = computer;
                // console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                // console.log("player wins");
            }
            // Give the winning row/column/diagonal a different bg-color
            var tmpAr = myGameLayout.getColumnIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    //check diagonal
    for (var i = 0; i <= 1; i++) {
        var diagonal = myGameLayout.getDiagValues(i);
        if (diagonal[0] > 0 && diagonal[0] == diagonal[1] && diagonal[0] == diagonal[2]) {
            if (diagonal[0] == computer) {
                score.computer++;
                winner = computer;
                // console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                // console.log("player wins");
            }
            // Give the winning row/column/diagonal a different bg-color
            var tmpAr = myGameLayout.getDiagIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }

    }
    // If we haven't returned a winner by now, and the board is full, it's a tie
    var myArr = myGameLayout.getFreeCellIndices();
    if (myArr.length === 0) {
        winner = 10;
        score.ties++;
        endGame(winner);
        return winner;
    }

    return winner;
}
// Announce winner 
function announceWinner(text) {
    document.getElementById("winText").innerHTML = text;
    document.getElementById("winAnnounce").style.display = 'block';
    setTimeout(closeModal, 1400, "winAnnounce");
}

// close modal
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

//end game
function endGame(who) {
    if (who == player) {
        announceWinner("Congratulations, you won!");
    } else if (who == computer) {
        announceWinner("Computer wins!");
    } else {
        announceWinner("It's a tie!");
    }
    gameOver = true;
    whoseTurn = 0;
    moves = 0;
    winner = 0;
    document.getElementById("computer-score").innerHTML = score.computer;
    document.getElementById("tie-score").innerHTML = score.ties;
    document.getElementById("player-score").innerHTML = score.player;
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).style.cursor = "default";
    }
    setTimeout(restartGame, 800);
}