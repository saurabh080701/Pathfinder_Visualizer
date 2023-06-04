
var largeDiv = document.getElementById("main-div");
var i;
var startBoxNumber;
var endBoxNumber;
var middleBoxNumber = -1;
var isCheckpointActive = false;
var algoReset = false;
var visualizerToggle = true;
var pathSpeed = 100;
var visualizerSpeed = 0;
var currentSpeed = 3;
var currentMaze = 0;

var windowHeight = window.innerHeight - 170;
document.getElementById('main-div').style.height = windowHeight;
var windowWidth = window.innerWidth - 4;
document.getElementById('main-div').setAttribute("style", "width: 100%;");
document.getElementById('buttonsDiv').style.width = windowWidth;
var boxHeight = 24;
var boxWidth = 22;
var numColumns = Math.floor(Math.floor(windowWidth) / boxWidth);
var numRows = Math.floor((windowHeight) / boxHeight);
var gridSize = numRows * numColumns;

var startBoxStartRow = Math.floor(numRows * 0.5);
var startBoxStartCol = Math.floor(numColumns * 0.1);
var endBoxStartRow = Math.floor(numRows * 0.5);
var endBoxStartCol = Math.floor(numColumns * 0.9);
var middleBoxStartRow = Math.floor(numRows * 0.85);
var middleBoxStartCol = Math.floor(numColumns * 0.5);

window.addEventListener("resize", reset);

// Calculate all necessary metrics
var isDijkstraChosen = false;
var isAStarChosen = false;
var isBreadthFirstChosen = false;
var isDepthFirstChosen = false;

var isPathFound = false;


// get box number
function getBoxNum(id) {
    return parseInt(id.substring(1, id.length));
}

// convert boxNum to id
function convertToId(boxNum) {
    return 'i' + boxNum.toString();
}

var gridBoxes = [];

// Constructor for each box
class Box {
    constructor(divId) {
        this.divId = divId;
        this.boxNum = getBoxNum(divId);
        this.isWall = false;
        this.isStart = false;
        this.isFinish = false;
        this.isCheckpoint = false;
        this.distance = 99999;
        this.previousBoxRow = -1;
        this.previousBoxCol = -1;
        this.visited = false;
        this.row = -1;
        this.col = -1;
        this.f = -1;
        this.g = -1;
    }
}

var currentRow = 0;
var currentCol = 1;

for (i = 1; i <= gridSize; i++) {
    var newDiv = document.createElement("div");
    newDiv.id = 'i' + i.toString();
    newDiv.className = 'gridBox';
    largeDiv.appendChild(newDiv);

    var newBox = new Box(newDiv.id);
    newBox.row = currentRow;
    newBox.col = currentCol;


    if (i == (startBoxStartRow * numColumns) + startBoxStartCol) {
        newBox.isStart = true;
        startBoxNumber = (startBoxStartRow * numColumns) + startBoxStartCol;
        document.getElementById(newDiv.id).setAttribute("style", "background-color: green;");
    }
    if (i == (endBoxStartRow * numColumns) + endBoxStartCol) {
        newBox.isFinish = true;
        endBoxNumber = (endBoxStartRow * numColumns) + endBoxStartCol;
        document.getElementById(newDiv.id).setAttribute("style", "background-color: red;");
    }

    gridBoxes[i - 1] = newBox;

    currentCol++;

    if (currentCol == numColumns + 1) {
        currentCol = 1;
        currentRow++;
    }
}

// get current box number mouse is on
function getCurrentBoxNumber() {
    var evt = window.event;

    if ((evt.clientX >= 2 && evt.clientX <= windowWidth + 2) && (evt.clientY >= 2 && evt.clientY <= windowHeight + 2)) {
        var y;
        var row;
        var col;

        for (y = 1; y <= numColumns; y++) {
            if ((evt.clientX > (y * (boxWidth)) - boxWidth + 2) && (evt.clientX <= (y * (boxWidth)) + 2)) {
                col = y;
            }
        }
        for (y = 1; y <= numRows; y++) {
            if ((evt.clientY >= (y * (boxHeight)) - boxHeight + 2) && (evt.clientY <= (y * (boxHeight)) + 2)) {
                row = y;
            }
        }

        if (prevRow == 0 && prevCol == 0) {
            firstRow = row;
            firstCol = col;
        }

        var boxNumber;
        boxNumber = ((row - 1) * numColumns) + col;

        return boxNumber;
    }
}

//handling walls

var wallClick = false;


window.onclick = function(e) {
    var evt = window.event || e;

    if ((evt.clientX >= 2 && evt.clientX <= this.windowWidth + 2) && (evt.clientY >= 2 && evt.clientY <= this.windowHeight + 2)) {
        var y;
        var row;
        var col;

        for (y = 1; y <= this.numColumns; y++) {
            if ((evt.clientX > (y * (this.boxWidth)) - this.boxWidth + 2) && (evt.clientX <= (y * (this.boxWidth)) + 2)) {
                col = y;
            }
        }
        for (y = 1; y <= this.numRows; y++) {
            if ((evt.clientY >= (y * (this.boxHeight)) - this.boxHeight + 2) && (evt.clientY <= (y * (this.boxHeight)) + 2)) {
                row = y;
            }
        }

        var boxNumber;
        boxNumber = ((row - 1) * this.numColumns) + col;

        if (boxNumber != this.startBoxNumber && boxNumber != this.endBoxNumber && boxNumber != this.middleBoxNumber && this.stack.length == 0) {
            if (this.gridBoxes[boxNumber - 1].isWall == true) {
                this.gridBoxes[boxNumber - 1].isWall = false;
                document.getElementById(this.convertToId(boxNumber)).setAttribute("style", "background-color: white;");
            } else {
                this.gridBoxes[boxNumber - 1].isWall = true;
                document.getElementById(this.convertToId(boxNumber)).setAttribute("style", "background-color: black;");
            }
        }

    }

    console.log("X: " + evt.clientX);
    console.log("Y: " + evt.clientY);
}

var pressDownStart = false;
var pressDownEnd = false;
var pressDownCheckpoint = false;

var prevRow = 0;
var prevCol = 0;

var firstRow;
var firstCol;

function toggleWalls() {
    var evt = window.event;

    if ((evt.clientX >= 2 && evt.clientX <= windowWidth + 2) && (evt.clientY >= 2 && evt.clientY <= windowHeight + 2)) {
        var y;
        var row;
        var col;

        for (y = 1; y <= numColumns; y++) {
            if ((evt.clientX > (y * (boxWidth)) - boxWidth + 2) && (evt.clientX <= (y * (boxWidth)) + 2)) {
                col = y;
            }
        }
        for (y = 1; y <= numRows; y++) {
            if ((evt.clientY >= (y * (boxHeight)) - boxHeight + 2) && (evt.clientY <= (y * (boxHeight)) + 2)) {
                row = y;
            }
        }

        if (prevRow == 0 && prevCol == 0) {
            firstRow = row;
            firstCol = col;
        }

        if (prevRow != row || prevCol != col) {
            var boxNumber;
            boxNumber = ((row - 1) * numColumns) + col;

            if (boxNumber != startBoxNumber && boxNumber != endBoxNumber && boxNumber != middleBoxNumber) {
                if (this.gridBoxes[boxNumber - 1].isWall == true) {
                    this.gridBoxes[boxNumber - 1].isWall = false;
                    document.getElementById(this.convertToId(boxNumber)).setAttribute("style", "background-color: white;");
                } else {
                    this.gridBoxes[boxNumber - 1].isWall = true;
                    document.getElementById(this.convertToId(boxNumber)).setAttribute("style", "background-color: black;");
                }

                prevCol = col;
                prevRow = row;
            }
        }

    }

    console.log("X: " + evt.clientX);
    console.log("Y: " + evt.clientY);
}

function configureWalls() {
    var g;
    for (g = 1; g <= gridSize; g++) {

        if (gridBoxes[g - 1].isWall == true) {
            document.getElementById(convertToId(g)).setAttribute("style", "background-color: black;");
        } else {
            if (g != startBoxNumber && g != endBoxNumber && g != middleBoxNumber) {
                document.getElementById(convertToId(g)).setAttribute("style", "background-color: white;");
            }
        }
    }
}

var pressDownWall = false;

let downListener = () => {
    if (getCurrentBoxNumber() != startBoxNumber && getCurrentBoxNumber() != endBoxNumber && getCurrentBoxNumber() != middleBoxNumber && stack.length == 0) {
        pressDownWall = true;
    }
}

document.getElementById("main-div").addEventListener('mousedown', downListener);

let moveListener = () => {
    if (pressDownWall == true && pressDownStart == false && pressDownEnd == false && pressDownCheckpoint == false && stack.length == 0) {
        toggleWalls();
    }
}

document.getElementById("main-div").addEventListener('mousemove', moveListener);

let upListener = () => {

    if (pressDownStart == false && pressDownEnd == false && pressDownCheckpoint == false && stack.length == 0 && pressDownWall == true) {
        pressDownWall = false;

        // get rid of this whole section + firstrow and firstcol section in togglewalls if problems start to occur
        if (firstRow != prevRow || firstCol != prevCol) {
            var boxNumber;
            boxNumber = ((prevRow - 1) * numColumns) + prevCol;
            if (this.gridBoxes[boxNumber - 1].isWall == true) {
                this.gridBoxes[boxNumber - 1].isWall = false;
                document.getElementById(this.convertToId(boxNumber)).setAttribute("style", "background-color: white;");
            } else {
                this.gridBoxes[boxNumber - 1].isWall = true;
                document.getElementById(this.convertToId(boxNumber)).setAttribute("style", "background-color: black;");
            }

            prevRow = 0;
            prevCol = 0;
        }
    }
}

document.getElementById("main-div").addEventListener('mouseup', upListener);



// move start node and move end node
var currentNumberStart = 0;
var currentNumberEnd = 0;
var currentNumberCheckpoint = 0;

let downListenerStart = () => {
    if (startBoxNumber == getCurrentBoxNumber() && stack.length == 0) {
        pressDownStart = true;
        currentNumberStart = startBoxNumber;
        console.log("hellooooooo");
    } else if (endBoxNumber == getCurrentBoxNumber() && stack.length == 0) {
        pressDownEnd = true;
        currentNumberEnd = endBoxNumber;
    } else if (middleBoxNumber == getCurrentBoxNumber() && isCheckpointActive == true && stack.length == 0) {
        pressDownCheckpoint = true;
        currentNumberCheckpoint = middleBoxNumber;
    }
}

document.getElementById("main-div").addEventListener('mousedown', downListenerStart);



let moveListenerStart = () => {
    if (pressDownStart == true && getCurrentBoxNumber() != endBoxNumber && getCurrentBoxNumber() != middleBoxNumber && stack.length == 0) {
        this.gridBoxes[currentNumberStart - 1].isStart = false;
        document.getElementById(this.convertToId(currentNumberStart)).setAttribute("style", "background-color: white;");
        this.gridBoxes[getCurrentBoxNumber() - 1].isStart = true;
        this.gridBoxes[getCurrentBoxNumber() - 1].isWall = false;
        document.getElementById(convertToId(getCurrentBoxNumber())).setAttribute("style", "background-color: green;");
        startBoxNumber = getCurrentBoxNumber();
        currentNumberStart = getCurrentBoxNumber();
        console.log("startBoxNumber: " + startBoxNumber);
    } else if (pressDownEnd == true && getCurrentBoxNumber() != startBoxNumber && getCurrentBoxNumber() != middleBoxNumber && stack.length == 0) {
        this.gridBoxes[currentNumberEnd - 1].isFinish = false;
        document.getElementById(this.convertToId(currentNumberEnd)).setAttribute("style", "background-color: white;");
        this.gridBoxes[getCurrentBoxNumber() - 1].isFinish = true;
        this.gridBoxes[getCurrentBoxNumber() - 1].isWall = false;
        document.getElementById(convertToId(getCurrentBoxNumber())).setAttribute("style", "background-color: red;");
        endBoxNumber = getCurrentBoxNumber();
        currentNumberEnd = getCurrentBoxNumber();
        console.log("endBoxNumber: " + endBoxNumber);
    } else if (pressDownCheckpoint == true && getCurrentBoxNumber() != startBoxNumber && getCurrentBoxNumber() != endBoxNumber && isCheckpointActive == true && stack.length == 0) {
        this.gridBoxes[currentNumberCheckpoint - 1].isCheckpoint = false;
        document.getElementById(this.convertToId(currentNumberCheckpoint)).setAttribute("style", "background-color: white;");
        this.gridBoxes[getCurrentBoxNumber() - 1].isCheckpoint = true;
        this.gridBoxes[getCurrentBoxNumber() - 1].isWall = false;
        document.getElementById(convertToId(getCurrentBoxNumber())).setAttribute("style", "background-color: blue;");
        middleBoxNumber = getCurrentBoxNumber();
        currentNumberCheckpoint = getCurrentBoxNumber();
    }

    if (stack.length == 0 && algoReset == true) {

        if (isDijkstraChosen == true) {
            if (isCheckpointActive == true) {
                resetAlgoStats();
                runDijkstraAlgo(startBoxNumber, middleBoxNumber);

                if (isPathFound == true) {
                    updateShortestPath(middleBoxNumber);
                    resetAlgoStatsWithCheckpoint();
                    runDijkstraAlgo(middleBoxNumber, endBoxNumber);

                    if (isPathFound == true) {
                        updateShortestPath(endBoxNumber);
                    }
                }
            } else {
                resetAlgoStats();
                runDijkstraAlgo(startBoxNumber, endBoxNumber);
                if (isPathFound == true) {
                    updateShortestPath(endBoxNumber);
                }
            }
        } else if (isAStarChosen == true) {
            if (isCheckpointActive == true) {
                resetAlgoStats();
                aStarAlgo(startBoxNumber, middleBoxNumber);

                if (isPathFound == true) {
                    updateShortestPath(middleBoxNumber);
                    resetAlgoStatsWithCheckpoint();
                    aStarAlgo(middleBoxNumber, endBoxNumber);

                    if (isPathFound == true) {
                        updateShortestPath(endBoxNumber);
                    }
                }
            } else {
                resetAlgoStats();
                aStarAlgo(startBoxNumber, endBoxNumber);
                if (isPathFound == true) {
                    updateShortestPath(endBoxNumber);
                }
            }
        } else if (isBreadthFirstChosen == true) {
            if (isCheckpointActive == true) {
                resetAlgoStats();
                breadthFirstSearch(startBoxNumber, middleBoxNumber);

                if (isPathFound == true) {
                    updateShortestPath(middleBoxNumber);
                    resetAlgoStatsWithCheckpoint();
                    breadthFirstSearch(middleBoxNumber, endBoxNumber);

                    if (isPathFound == true) {
                        updateShortestPath(endBoxNumber);
                    }
                }
            } else {
                resetAlgoStats();
                breadthFirstSearch(startBoxNumber, endBoxNumber);
                if (isPathFound == true) {
                    updateShortestPath(endBoxNumber);
                }
            }
        } else if (isDepthFirstChosen == true) {
            if (isCheckpointActive == true) {
                resetAlgoStats();
                depthFirstSearch(startBoxNumber, middleBoxNumber);

                if (isPathFound == true) {
                    updateShortestPath(middleBoxNumber);
                    resetAlgoStatsWithCheckpoint();
                    depthFirstSearch(middleBoxNumber, endBoxNumber);

                    if (isPathFound == true) {
                        updateShortestPath(endBoxNumber);
                    }
                }
            } else {
                resetAlgoStats();
                depthFirstSearch(startBoxNumber, endBoxNumber);
                if (isPathFound == true) {
                    updateShortestPath(endBoxNumber);
                }
            }
        }
    }
}

document.getElementById("main-div").addEventListener('mousemove', moveListenerStart);

let upListenerStart = () => {
    if (pressDownStart == true && stack.length == 0) {
        pressDownStart = false;
        console.log("currentNumberStart: " + getCurrentBoxNumber());
        console.log("isStart: " + gridBoxes[startBoxNumber - 1].isStart);
    } else if (pressDownEnd == true && stack.length == 0) {
        pressDownEnd = false;
    } else if (pressDownCheckpoint == true && isCheckpointActive == true && stack.length == 0) {
        pressDownCheckpoint = false;
    }
}

document.getElementById("main-div").addEventListener('mouseup', upListenerStart);

function findBoxNumByRowCol(row, col) {
    var m;
    for (m = 0; m < gridBoxes.length; m++) {
        if (gridBoxes[m].row == row && gridBoxes[m].col == col) {
            return gridBoxes[m].boxNum;
        }
    }
}

var visualQueue = [];
var changeColor = false;
var counter = 0;
var changeAt;

function runDijkstraAlgo(startBox, endBox) {
    var unvisitedNodes = [];
    var unvisitedSetLength;

    gridBoxes[startBox - 1].distance = 0;

    var index;
    for (index = 0; index < gridBoxes.length; index++) {
        gridBoxes[index].visited = false;
        unvisitedNodes.push(gridBoxes[index]);

    }

    unvisitedSetLength = unvisitedNodes.length
    // iterate through all unvisited boxes until finish box is found
    while (unvisitedSetLength != 0) {

        // find shortest distance box in unvisited set
        var minDistanceBox = 99999;
        var chosenBox;
        for (index = 0; index < gridBoxes.length; index++) {
            if (gridBoxes[index].distance < minDistanceBox && gridBoxes[index].visited == false) {
                minDistanceBox = gridBoxes[index].distance;
                chosenBox = index;
            }
        }

        // remove chosen box from unvisited set
        gridBoxes[chosenBox].visited = true;
        delete unvisitedNodes[chosenBox];
        unvisitedSetLength--;

        if (gridBoxes[chosenBox].boxNum == endBox) {
            isPathFound = true;
            break;
        }

        if (chosenBox + 1 != startBox) {
            visualQueue.push(gridBoxes[chosenBox]);
            counter++;
        }

        // for each neighbor do the following
        var searchTop = false;
        var searchLeft = false;
        var searchBottom = false;
        var searchRight = false;

        // Neighbors depend on location of box
        if (gridBoxes[chosenBox].row > 0 && gridBoxes[chosenBox].row < (numRows - 1) && gridBoxes[chosenBox].col > 1 && gridBoxes[chosenBox].col < numColumns) {
            searchTop = true;
            searchLeft = true;
            searchBottom = true;
            searchRight = true;
        } else if (gridBoxes[chosenBox].row == 0 && gridBoxes[chosenBox].col == 1) {
            searchRight = true;
            searchBottom = true;
        } else if (gridBoxes[chosenBox].row == (numRows - 1) && gridBoxes[chosenBox].col == 1) {
            searchTop = true;
            searchRight = true;
        } else if (gridBoxes[chosenBox].row == 0 && gridBoxes[chosenBox].col == numColumns) {
            searchLeft = true;
            searchBottom = true;
        } else if (gridBoxes[chosenBox].row == (numRows - 1) && gridBoxes[chosenBox].col == numColumns) {
            searchLeft = true;
            searchTop = true;
        } else if (gridBoxes[chosenBox].row == 0 && gridBoxes[chosenBox].col > 1 && gridBoxes[chosenBox].col < numColumns) {
            searchLeft = true;
            searchRight = true;
            searchBottom = true;
        } else if (gridBoxes[chosenBox].row == (numRows - 1) && gridBoxes[chosenBox].col > 1 && gridBoxes[chosenBox].col < numColumns) {
            searchLeft = true;
            searchRight = true;
            searchTop = true;
        } else if (gridBoxes[chosenBox].col == 1 && gridBoxes[chosenBox].row > 0 && gridBoxes[chosenBox].row < (numRows - 1)) {
            searchTop = true;
            searchRight = true;
            searchBottom = true;
        } else if (gridBoxes[chosenBox].col == numColumns && gridBoxes[chosenBox].row > 0 && gridBoxes[chosenBox].row < (numRows - 1)) {
            searchTop = true;
            searchLeft = true;
            searchBottom = true;
        }

        // for each neighbor
        if (searchTop == true) {
            var topIndex = (findBoxNumByRowCol(gridBoxes[chosenBox].row - 1, gridBoxes[chosenBox].col) - 1);
            console.log('index: ' + topIndex);
            var testDistance;
            console.log('index: ' + topIndex);
            if (gridBoxes[topIndex].visited == false) {
                if (gridBoxes[topIndex].isWall == true) {
                    testDistance = gridBoxes[chosenBox].distance + 99999;
                } else {
                    testDistance = gridBoxes[chosenBox].distance + 1;
                }

                if (testDistance < gridBoxes[topIndex].distance) {
                    gridBoxes[topIndex].distance = testDistance;
                    gridBoxes[topIndex].previousBoxRow = gridBoxes[chosenBox].row;
                    gridBoxes[topIndex].previousBoxCol = gridBoxes[chosenBox].col;
                }

            }
        }

        if (searchLeft == true) {
            var leftIndex = (findBoxNumByRowCol(gridBoxes[chosenBox].row, gridBoxes[chosenBox].col - 1) - 1);
            var testDistance;
            if (gridBoxes[leftIndex].visited == false) {
                if (gridBoxes[leftIndex].isWall == true) {
                    testDistance = gridBoxes[chosenBox].distance + 99999;
                } else {
                    testDistance = gridBoxes[chosenBox].distance + 1;
                }

                if (testDistance < gridBoxes[leftIndex].distance) {
                    gridBoxes[leftIndex].distance = testDistance;
                    gridBoxes[leftIndex].previousBoxRow = gridBoxes[chosenBox].row;
                    gridBoxes[leftIndex].previousBoxCol = gridBoxes[chosenBox].col;
                }

            }
        }

        if (searchRight == true) {
            var rightIndex = (findBoxNumByRowCol(gridBoxes[chosenBox].row, gridBoxes[chosenBox].col + 1) - 1);
            var testDistance;
            if (gridBoxes[rightIndex].visited == false) {
                if (gridBoxes[rightIndex].isWall == true) {
                    testDistance = gridBoxes[chosenBox].distance + 99999;
                } else {
                    testDistance = gridBoxes[chosenBox].distance + 1;
                }

                if (testDistance < gridBoxes[rightIndex].distance) {
                    gridBoxes[rightIndex].distance = testDistance;
                    gridBoxes[rightIndex].previousBoxRow = gridBoxes[chosenBox].row;
                    gridBoxes[rightIndex].previousBoxCol = gridBoxes[chosenBox].col;
                }

            }
        }

        if (searchBottom == true) {
            var bottomIndex = (findBoxNumByRowCol(gridBoxes[chosenBox].row + 1, gridBoxes[chosenBox].col) - 1);
            var testDistance;
            if (gridBoxes[bottomIndex].visited == false) {
                if (gridBoxes[bottomIndex].isWall == true) {
                    testDistance = gridBoxes[chosenBox].distance + 99999;
                } else {
                    testDistance = gridBoxes[chosenBox].distance + 1;
                }

                if (testDistance < gridBoxes[bottomIndex].distance) {
                    gridBoxes[bottomIndex].distance = testDistance;
                    gridBoxes[bottomIndex].previousBoxRow = gridBoxes[chosenBox].row;
                    gridBoxes[bottomIndex].previousBoxCol = gridBoxes[chosenBox].col;
                }

            }
        }
    }

    if (changeColor == false) {
        changeColor = true;
        changeAt = counter;
    }

}

var stack = [];
stack.push(1);
var stack2 = [];

function storeShortestPath(endBox) {
    if (gridBoxes[endBox - 1].previousBoxRow != -1) {
        var currentBox = gridBoxes[endBox - 1];

        while (currentBox != null) {

            if (currentBox.boxNum != startBoxNumber && currentBox.boxNum != endBoxNumber && currentBox.boxNum != middleBoxNumber) {
                stack.push(currentBox);
            }

            if (currentBox.isStart == true) {
                currentBox = null;
            } else {
                currentBox = gridBoxes[findBoxNumByRowCol(currentBox.previousBoxRow, currentBox.previousBoxCol) - 1];
            }
        }
    }
}

function storeShortestPath2(startBox, endBox) {
    if (gridBoxes[endBox - 1].previousBoxRow != -1) {
        var currentBox = gridBoxes[endBox - 1];

        while (currentBox != null) {

            if (currentBox.boxNum != startBoxNumber && currentBox.boxNum != endBoxNumber && currentBox.boxNum != middleBoxNumber) {

                if (endBox == middleBoxNumber) {
                    stack.push(currentBox);
                } else if (endBox == endBoxNumber) {
                    stack2.push(currentBox);
                }
            }

            if (currentBox.boxNum == startBox) {
                currentBox = null;
            } else {
                currentBox = gridBoxes[findBoxNumByRowCol(currentBox.previousBoxRow, currentBox.previousBoxCol) - 1];
            }
        }
    }
}

function updateShortestPath(endBox) {
    if (gridBoxes[endBox - 1].previousBoxRow != -1) {
        var currentBox = gridBoxes[endBox - 1];

        while (currentBox != null) {

            if (currentBox.boxNum != startBoxNumber && currentBox.boxNum != endBoxNumber && currentBox.boxNum != middleBoxNumber) {
                document.getElementById(currentBox.divId).setAttribute("style", "background-color: #f96d00;");
            }

            if (currentBox.isStart == true) {
                currentBox = null;
            } else {
                currentBox = gridBoxes[findBoxNumByRowCol(currentBox.previousBoxRow, currentBox.previousBoxCol) - 1];
            }
        }
    }
}

var pace;
var secondStack = [];
var isEndFound = false;


function printPath() {
    setTimeout(function() {
        var currentBox = stack.pop();
        if (currentBox != null) {

            if (currentBox.boxNum != startBoxNumber && currentBox.boxNum != endBoxNumber && currentBox.boxNum != middleBoxNumber) {
                document.getElementById(currentBox.divId).setAttribute("style", "background-color: #f96d00;");
            }

            if (currentBox.isStart == true) {
                currentBox = null;
            } else {
                currentBox = gridBoxes[findBoxNumByRowCol(currentBox.previousBoxRow, currentBox.previousBoxCol) - 1];
                printPath(currentBox);
            }
        }

        if (isCheckpointActive == false) {
            pace = (pathSpeed) / 2;
        } else {
            pace = pathSpeed;
        }

    }, pace)
}

var i = 0;

function printVisual() {
    setTimeout(function() {
        var currentBox = visualQueue[i];
        if (currentBox != null) {
            i++;
            if (currentBox.boxNum != startBoxNumber && currentBox.boxNum != endBoxNumber && currentBox.boxNum != middleBoxNumber) {

                if (i <= changeAt) {
                    document.getElementById(currentBox.divId).setAttribute("style", "background-color: #6643b5;");
                } else {
                    document.getElementById(currentBox.divId).setAttribute("style", "background-color: #a393eb;");
                }

            }
            printVisual();
        } else {

            if (isCheckpointActive == true) {
                stack = [];
                resetAlgoStatsWithCheckpoint();
                runDijkstraAlgo(middleBoxNumber, endBoxNumber);
                storeShortestPath(endBoxNumber);
                resetAlgoStatsWithCheckpoint();
                runDijkstraAlgo(startBoxNumber, middleBoxNumber);
                storeShortestPath(middleBoxNumber);
            }

            printPath();
            visualQueue = [];
            i = 0;
        }
    }, visualizerSpeed)
}

function callDijkstra() {

    if (algoReset == false && mazeSetupDone == true) {

        if (isCheckpointActive == true) {

            if (visualizerToggle == true) {
                runDijkstraAlgo(startBoxNumber, middleBoxNumber);

                if (isPathFound == true) {
                    storeShortestPath(middleBoxNumber);
                    resetAlgoStatsWithCheckpoint();
                    runDijkstraAlgo(middleBoxNumber, endBoxNumber);

                    if (isPathFound == true) {
                        storeShortestPath(endBoxNumber);

                        printVisual();
                    }
                }
            } else {
                resetAlgoStatsWithCheckpoint();
                runDijkstraAlgo(middleBoxNumber, endBoxNumber);

                if (isPathFound == true) {
                    storeShortestPath(endBoxNumber);
                    resetAlgoStatsWithCheckpoint();
                    runDijkstraAlgo(startBoxNumber, middleBoxNumber);

                    if (isPathFound == true) {
                        storeShortestPath(middleBoxNumber);
                        printPath();
                    }
                }
            }



        } else {
            runDijkstraAlgo(startBoxNumber, endBoxNumber);

            if (isPathFound == true) {
                storeShortestPath(endBoxNumber);

                if (visualizerToggle == true) {
                    printVisual();
                } else {
                    printPath();
                }
            }
        }
        algoReset = true;
    }
}


function reset() {
    //location.reload();
    largeDiv = document.getElementById("main-div");
    middleBoxNumber = -1;
    isCheckpointActive = false;
    algoReset = false;
    visualizerToggle = true;
    pathSpeed = 100;
    visualizerSpeed = 0;
    currentSpeed = 3;
    currentMaze = 0;

    isDijkstraChosen = false;
    isAStarChosen = false;
    isBreadthFirstChosen = false;
    isDepthFirstChosen = false;

    isPathFound = false;

    currentRow = 0;
    currentCol = 1;

    for (var i = 1; i <= gridSize; i++) {
        gridBoxes[i - 1].isWall = false;
        gridBoxes[i - 1].isStart = false;
        gridBoxes[i - 1].isFinish = false;
        gridBoxes[i - 1].isCheckpoint = false;
        gridBoxes[i - 1].distance = 99999;
        gridBoxes[i - 1].previousBoxRow = -1;
        gridBoxes[i - 1].previousBoxCol = -1;
        gridBoxes[i - 1].visited = false;
        gridBoxes[i - 1].row = -1;
        gridBoxes[i - 1].col = -1;
        gridBoxes[i - 1].f = -1;
        gridBoxes[i - 1].g = -1;

        gridBoxes[i - 1].row = currentRow;
        gridBoxes[i - 1].col = currentCol;

        document.getElementById(gridBoxes[i - 1].divId).setAttribute("style", "background-color: white;");

        if (i == (startBoxStartRow * numColumns) + startBoxStartCol) {
            gridBoxes[i - 1].isStart = true;
            startBoxNumber = (startBoxStartRow * numColumns) + startBoxStartCol;
            document.getElementById(gridBoxes[i - 1].divId).setAttribute("style", "background-color: green;");
        }
        if (i == (endBoxStartRow * numColumns) + endBoxStartCol) {
            gridBoxes[i - 1].isFinish = true;
            endBoxNumber = (endBoxStartRow * numColumns) + endBoxStartCol;
            document.getElementById(gridBoxes[i - 1].divId).setAttribute("style", "background-color: red;");
        }

        currentCol++;

        if (currentCol == numColumns + 1) {
            currentCol = 1;
            currentRow++;
        }
    }

    wallClick = false;

    pressDownStart = false;
    pressDownEnd = false;
    pressDownCheckpoint = false;

    prevRow = 0;
    prevCol = 0;

    pressDownWall = false;

    currentNumberStart = 0;
    currentNumberEnd = 0;
    currentNumberCheckpoint = 0;

    visualQueue = [];
    changeColor = false;
    counter = 0;
    stack = [];
    stack2 = [];

    secondStack = [];
    isEndFound = false;

    i = 0;

    mazeSetupDone = true;
    w = 0;

    document.getElementById('insertCheckpoint').innerHTML = "Insert Checkpoint";
    document.getElementById('dijkstraBtn').innerHTML = "Choose Algorithm";
    document.getElementById('visualizerToggle').innerHTML = "Visualizer: On";
    document.getElementById('speedBtn').innerHTML = "Speed: Fast";
    document.getElementById('mazeBtn').innerHTML = "Maze Options";
}

function resetAlgoStats() {

    var z;
    isPathFound = false;
    for (z = 0; z < gridSize; z++) {
        gridBoxes[z].distance = 99999;
        gridBoxes[z].previousBoxRow = -1;
        gridBoxes[z].previousBoxCol = -1;
        gridBoxes[z].visited = false;
        gridBoxes[z].f = -1;
        gridBoxes[z].g = -1;
        document.getElementById(gridBoxes[z].divId).setAttribute("style", "background-color: white;");

        if (gridBoxes[z].isWall == true) {
            document.getElementById(gridBoxes[z].divId).setAttribute("style", "background-color: black;");
        }
        if (gridBoxes[z].isStart == true) {
            document.getElementById(gridBoxes[z].divId).setAttribute("style", "background-color: green;");
        }
        if (gridBoxes[z].isFinish == true) {
            document.getElementById(gridBoxes[z].divId).setAttribute("style", "background-color: red;");
        }
        if (gridBoxes[z].isCheckpoint == true) {
            document.getElementById(gridBoxes[z].divId).setAttribute("style", "background-color: blue;");
        }
    }

}

function resetAlgoStatsWithCheckpoint() {
    var z;
    isPathFound = false;
    for (z = 0; z < gridSize; z++) {
        gridBoxes[z].distance = 99999;
        gridBoxes[z].previousBoxRow = -1;
        gridBoxes[z].previousBoxCol = -1;
        gridBoxes[z].visited = false;
        gridBoxes[z].f = -1;
        gridBoxes[z].g = -1;
    }
}

document.getElementById('insertCheckpoint').addEventListener('click', function() {
    if (isCheckpointActive == false && algoReset == false) {
        if (gridBoxes[((middleBoxStartRow * numColumns) + middleBoxStartCol) - 1].isStart == false && gridBoxes[((middleBoxStartRow * numColumns) + middleBoxStartCol) - 1].isFinish == false) {
            gridBoxes[((middleBoxStartRow * numColumns) + middleBoxStartCol) - 1].isWall = false;
            gridBoxes[((middleBoxStartRow * numColumns) + middleBoxStartCol) - 1].isCheckpoint = true;
            document.getElementById(convertToId(((middleBoxStartRow * numColumns) + middleBoxStartCol))).setAttribute("style", "background-color: blue;");
        } else {
            gridBoxes[((startBoxStartRow * numColumns) + startBoxStartCol) - 1].isWall = false;
            gridBoxes[((startBoxStartRow * numColumns) + startBoxStartCol) - 1].isStart = true;
            startBoxNumber = ((startBoxStartRow * numColumns) + startBoxStartCol);
            document.getElementById(convertToId(((startBoxStartRow * numColumns) + startBoxStartCol))).setAttribute("style", "background-color: green;");

            gridBoxes[((endBoxStartRow * numColumns) + endBoxStartCol) - 1].isWall = false;
            gridBoxes[((endBoxStartRow * numColumns) + endBoxStartCol) - 1].isFinish = true;
            endBoxNumber = ((endBoxStartRow * numColumns) + endBoxStartCol);
            document.getElementById(convertToId(((endBoxStartRow * numColumns) + endBoxStartCol))).setAttribute("style", "background-color: red;");

            gridBoxes[((middleBoxStartRow * numColumns) + middleBoxStartCol) - 1].isWall = false;
            gridBoxes[((middleBoxStartRow * numColumns) + middleBoxStartCol) - 1].isCheckpoint = true;
            document.getElementById(convertToId(((middleBoxStartRow * numColumns) + middleBoxStartCol))).setAttribute("style", "background-color: blue;");
        }
        middleBoxNumber = ((middleBoxStartRow * numColumns) + middleBoxStartCol);
        isCheckpointActive = true;
        document.getElementById('insertCheckpoint').innerHTML = "Delete Checkpoint";
    } else if (isCheckpointActive == true && algoReset == false) {
        gridBoxes[middleBoxNumber - 1].isCheckpoint = false;
        document.getElementById(convertToId(middleBoxNumber)).setAttribute("style", "background-color: white;");
        middleBoxNumber = -1;
        document.getElementById('insertCheckpoint').innerHTML = "Insert Checkpoint";
        isCheckpointActive = false;
    }
});

document.getElementById('reset').addEventListener('click', function() {
    reset();
});

function toggleVisualizer() {

    if (stack.length == 0) {
        if (visualizerToggle == true) {
            visualizerToggle = false;
            document.getElementById('visualizerToggle').innerHTML = "Visualizer: Off";
        } else {
            visualizerToggle = true;
            document.getElementById('visualizerToggle').innerHTML = "Visualizer: On";
        }
    }

}

function toggleSpeed() {

    if (true) {
        currentSpeed++;
        if (currentSpeed == 4) {
            currentSpeed = 1;
        }

        if (currentSpeed == 1) {
            pathSpeed = 300;
            visualizerSpeed = 100;
            document.getElementById('speedBtn').innerHTML = "Speed: Slow";
        } else if (currentSpeed == 2) {
            pathSpeed = 200;
            visualizerSpeed = 50;
            document.getElementById('speedBtn').innerHTML = "Speed: Moderate";
        } else if (currentSpeed == 3) {
            pathSpeed = 100;
            visualizerSpeed = 0;
            document.getElementById('speedBtn').innerHTML = "Speed: Fast";
        }
    }

}

function mazer1() {

    // erase current start and end box (and middle if it exists)
    if (isCheckpointActive == true) {
        document.getElementById(convertToId(middleBoxNumber)).setAttribute("style", "background-color: white;");
        document.getElementById('insertCheckpoint').innerHTML = "Insert Checkpoint";
        gridBoxes[middleBoxNumber - 1].isCheckpoint = false;
        middleBoxNumber = -1;
        isCheckpointActive = false;
    }

    // set start
    document.getElementById(convertToId(startBoxNumber)).setAttribute("style", "background-color: white;");
    gridBoxes[startBoxNumber - 1].isStart = false;

    startBoxNumber = 1;
    gridBoxes[startBoxNumber - 1].isStart = true;
    document.getElementById(convertToId(startBoxNumber)).setAttribute("style", "background-color: green;");

    // set finish
    document.getElementById(convertToId(endBoxNumber)).setAttribute("style", "background-color: white;");
    gridBoxes[endBoxNumber - 1].isFinish = false;

    endBoxNumber = gridSize;
    gridBoxes[gridSize - 1].isFinish = true;
    document.getElementById(convertToId(endBoxNumber)).setAttribute("style", "background-color: red;");

    var firstCol = Math.floor(0.3333 * numColumns);
    var secondCol = 2 * firstCol;
    var rowHeight = Math.floor(numRows / 9);
    var colWidth = Math.floor(firstCol / 3);

    var firstRow = rowHeight;
    var secondRow = rowHeight * 2;
    var thirdRow = rowHeight * 3;
    var fourthRow = rowHeight * 4;
    var fifthRow = rowHeight * 5;
    var sixthRow = rowHeight * 6;
    var seventhRow = rowHeight * 7;
    var eighthRow = rowHeight * 8;

    var firstRCol = firstCol + colWidth;
    var secondRCol = firstRCol + colWidth;
    var thirdRCol = secondRCol + colWidth;
    var fourthRCol = thirdRCol + colWidth;

    for (var i = 0; i < gridSize; i++) {

        if (gridBoxes[i].col == firstCol && gridBoxes[i].row != (numRows - 1)) {
            gridBoxes[i].isWall = true;
        } else if (gridBoxes[i].col == secondCol && gridBoxes[i].row != 0) {
            gridBoxes[i].isWall = true;
        } else if ((gridBoxes[i].row == firstRow || gridBoxes[i].row == thirdRow || gridBoxes[i].row == fifthRow || gridBoxes[i].row == seventhRow) && ((gridBoxes[i].col < firstCol - 1) || (gridBoxes[i].col > secondCol && gridBoxes[i].col < numColumns - 1))) {
            gridBoxes[i].isWall = true;
        } else if ((gridBoxes[i].row == secondRow || gridBoxes[i].row == fourthRow || gridBoxes[i].row == sixthRow || gridBoxes[i].row == eighthRow) && ((gridBoxes[i].col < firstCol && gridBoxes[i].col > 1) || (gridBoxes[i].col > secondCol + 1 && gridBoxes[i].col <= numColumns))) {
            gridBoxes[i].isWall = true;
        } else if ((gridBoxes[i].col == firstRCol) && gridBoxes[i].row != 0) {
            gridBoxes[i].isWall = true;
        } else if ((gridBoxes[i].col == secondRCol) && gridBoxes[i].row != (numRows - 1)) {
            gridBoxes[i].isWall = true;
        } else if (gridBoxes[i].isStart == false && gridBoxes[i].isFinish == false) {
            gridBoxes[i].isWall = false;
        }

    }

}

function maze2() {
    // erase current start and end box (and middle if it exists)
    if (isCheckpointActive == true) {
        document.getElementById(convertToId(middleBoxNumber)).setAttribute("style", "background-color: white;");
        document.getElementById('insertCheckpoint').innerHTML = "Insert Checkpoint";
        gridBoxes[middleBoxNumber - 1].isCheckpoint = false;
        middleBoxNumber = -1;
        isCheckpointActive = false;
    }

    var columnWidth = Math.floor(numColumns / 10);
    var rowHeight = Math.floor(numRows / 5);

    var firstColumn = columnWidth;
    var secondColumn = firstColumn + columnWidth;
    var thirdColumn = secondColumn + columnWidth;
    var fourthColumn = thirdColumn + columnWidth;
    var fifthColumn = fourthColumn + columnWidth;
    var sixthColumn = fifthColumn + columnWidth;
    var seventhColumn = sixthColumn + columnWidth;
    var eighthColumn = seventhColumn + columnWidth;
    var ninthColumn = eighthColumn + columnWidth;
    var tenthColumn = ninthColumn + columnWidth;

    var firstRow = rowHeight;
    var secondRow = firstRow + rowHeight;
    var thirdRow = secondRow + rowHeight;
    var fourthRow = thirdRow + rowHeight;
    var fifthRow = fourthRow + rowHeight;

    // set start
    document.getElementById(convertToId(startBoxNumber)).setAttribute("style", "background-color: white;");
    gridBoxes[startBoxNumber - 1].isStart = false;

    startBoxNumber = (1 * numColumns) + 2;
    gridBoxes[startBoxNumber - 1].isStart = true;
    document.getElementById(convertToId(startBoxNumber)).setAttribute("style", "background-color: green;");

    // set finish
    document.getElementById(convertToId(endBoxNumber)).setAttribute("style", "background-color: white;");
    gridBoxes[endBoxNumber - 1].isFinish = false;

    // if mouse stopping dijkstra after running it change 1 to 2
    endBoxNumber = ((fifthRow - 2) * numColumns) + (tenthColumn - 1);
    gridBoxes[endBoxNumber - 1].isFinish = true;
    document.getElementById(convertToId(endBoxNumber)).setAttribute("style", "background-color: red;");

    for (var i = 0; i < gridSize; i++) {

        // scavenger by row
        if (gridBoxes[i].row == firstRow) {

            if (gridBoxes[i].col >= firstColumn && gridBoxes[i].col <= secondColumn) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].col >= fourthColumn && gridBoxes[i].col <= fifthColumn) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].col >= seventhColumn && gridBoxes[i].col <= ninthColumn) {
                gridBoxes[i].isWall = true;
            } else {
                gridBoxes[i].isWall = false;
            }

        } else if (gridBoxes[i].row == secondRow) {

            if (gridBoxes[i].col >= firstColumn && gridBoxes[i].col <= fourthColumn) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].col >= fifthColumn && gridBoxes[i].col <= sixthColumn) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].col >= ninthColumn && gridBoxes[i].col <= tenthColumn) {
                gridBoxes[i].isWall = true;
            } else {
                gridBoxes[i].isWall = false;
            }

        } else if (gridBoxes[i].row == thirdRow) {

            if (gridBoxes[i].col >= 0 && gridBoxes[i].col <= firstColumn) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].col >= thirdColumn && gridBoxes[i].col <= fourthColumn) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].col >= sixthColumn && gridBoxes[i].col <= eighthColumn) {
                gridBoxes[i].isWall = true;
            } else {
                gridBoxes[i].isWall = false;
            }

        } else if (gridBoxes[i].row == fourthRow) {

            if (gridBoxes[i].col >= firstColumn && gridBoxes[i].col <= thirdColumn) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].col >= fifthColumn && gridBoxes[i].col <= seventhColumn) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].col >= eighthColumn && gridBoxes[i].col <= tenthColumn) {
                gridBoxes[i].isWall = true;
            } else {
                gridBoxes[i].isWall = false;
            }

        } else if ((gridBoxes[i].row == 0 && gridBoxes[i].col <= tenthColumn) || (gridBoxes[i].row == fifthRow && gridBoxes[i].col <= tenthColumn) || (gridBoxes[i].col == 1 && gridBoxes[i].row <= fifthRow) || (gridBoxes[i].col == tenthColumn && gridBoxes[i].row <= fifthRow)) {
            gridBoxes[i].isWall = true;
        } else if (gridBoxes[i].isStart == false && gridBoxes[i].isFinish == false) {
            gridBoxes[i].isWall = false;
        }

        // scavenger by column
        if (gridBoxes[i].col == firstColumn) {

            if (gridBoxes[i].row >= firstRow && gridBoxes[i].row <= secondRow) {
                gridBoxes[i].isWall = true;
            }

        } else if (gridBoxes[i].col == secondColumn) {

            if (gridBoxes[i].row >= secondRow && gridBoxes[i].row <= thirdRow) {
                gridBoxes[i].isWall = true;
            }

        } else if (gridBoxes[i].col == thirdColumn) {

            if (gridBoxes[i].row >= 0 && gridBoxes[i].row <= secondRow) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].row >= thirdRow && gridBoxes[i].row <= fourthRow) {
                gridBoxes[i].isWall = true;
            }

        } else if (gridBoxes[i].col == fourthColumn) {

            if (gridBoxes[i].row >= secondRow && gridBoxes[i].row <= thirdRow) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].row >= fourthRow && gridBoxes[i].row <= fifthRow) {
                gridBoxes[i].isWall = true;
            }

        } else if (gridBoxes[i].col == fifthColumn) {

            if (gridBoxes[i].row >= firstRow && gridBoxes[i].row <= secondRow) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].row >= thirdRow && gridBoxes[i].row <= fourthRow) {
                gridBoxes[i].isWall = true;
            }

        } else if (gridBoxes[i].col == sixthColumn) {

            if (gridBoxes[i].row >= secondRow && gridBoxes[i].row <= thirdRow) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].row >= fourthRow && gridBoxes[i].row <= fifthRow) {
                gridBoxes[i].isWall = true;
            }

        } else if (gridBoxes[i].col == seventhColumn) {

            if (gridBoxes[i].row >= firstRow && gridBoxes[i].row <= secondRow) {
                gridBoxes[i].isWall = true;
            } else if (gridBoxes[i].row >= thirdRow && gridBoxes[i].row <= fourthRow) {
                gridBoxes[i].isWall = true;
            }

        } else if (gridBoxes[i].col == eighthColumn) {

            if (gridBoxes[i].row >= firstRow && gridBoxes[i].row <= thirdRow) {
                gridBoxes[i].isWall = true;
            }
        } else if (gridBoxes[i].col == ninthColumn) {

            if (gridBoxes[i].row >= secondRow && gridBoxes[i].row <= thirdRow) {
                gridBoxes[i].isWall = true;
            }

        }

        if ((gridBoxes[i].row == firstRow && gridBoxes[i].col == 1) || (gridBoxes[i].row == secondRow && gridBoxes[i].col == 1) || (gridBoxes[i].row == fourthRow && gridBoxes[i].col == 1) ||
            (gridBoxes[i].row == firstRow && gridBoxes[i].col == tenthColumn) || (gridBoxes[i].row == secondRow && gridBoxes[i].col == tenthColumn) || (gridBoxes[i].row == thirdRow && gridBoxes[i].col == tenthColumn) ||
            gridBoxes[i].row == numRows - 1) {
            gridBoxes[i].isWall = true;
        }

        if (gridBoxes[i].col > tenthColumn) {
            gridBoxes[i].isWall = false;
        }

    }
}

function maze3() {

    // erase current start and end box (and middle if it exists)
    if (isCheckpointActive == true) {
        document.getElementById(convertToId(middleBoxNumber)).setAttribute("style", "background-color: white;");
        document.getElementById('insertCheckpoint').innerHTML = "Insert Checkpoint";
        gridBoxes[middleBoxNumber - 1].isCheckpoint = false;
        middleBoxNumber = -1;
        isCheckpointActive = false;
    }

    // set start
    document.getElementById(convertToId(startBoxNumber)).setAttribute("style", "background-color: white;");
    gridBoxes[startBoxNumber - 1].isStart = false;

    startBoxNumber = 1;
    gridBoxes[startBoxNumber - 1].isStart = true;
    document.getElementById(convertToId(startBoxNumber)).setAttribute("style", "background-color: green;");

    // set finish
    document.getElementById(convertToId(endBoxNumber)).setAttribute("style", "background-color: white;");
    gridBoxes[endBoxNumber - 1].isFinish = false;

    endBoxNumber = gridSize;
    gridBoxes[gridSize - 1].isFinish = true;
    document.getElementById(convertToId(endBoxNumber)).setAttribute("style", "background-color: red;");

    var randomNum;

    // randomize each box for wall(15%) or no wall(85%)
    for (var i = 0; i < gridSize; i++) {

        if (gridBoxes[i].isStart == false && gridBoxes[i].isFinish == false) {

            randomNum = Math.random();

            if (randomNum <= 0.85) {
                gridBoxes[i].isWall = false;
            } else {
                gridBoxes[i].isWall = true;
            }

        }

        if (i == 1 || i == numColumns || i == endBoxNumber - 2 || i == endBoxNumber - 1 - numColumns) {
            gridBoxes[i].isWall = false;
        }

    }
}

function setAllWhite() {
    for (var i = 0; i < gridSize; i++) {
        document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: white;");
    }
}

var mazeSetupDone = true;
var w = 0;

function visualMazeSetup() {
    setTimeout(function() {
        mazeSetupDone = false;
        if (w < gridSize) {
            if (gridBoxes[w].isStart == true) {
                document.getElementById(gridBoxes[w].divId).setAttribute("style", "background-color: green;");
            } else if (gridBoxes[w].isFinish == true) {
                document.getElementById(gridBoxes[w].divId).setAttribute("style", "background-color: red;");
            } else if (gridBoxes[w].isWall == true) {
                document.getElementById(gridBoxes[w].divId).setAttribute("style", "background-color: black;");
            }
            w++;
            visualMazeSetup();
        } else {
            w = 0;
            mazeSetupDone = true;
        }
    }, visualizerSpeed)
}

function mazeButton() {
    if (stack.length == 0 && algoReset == false && mazeSetupDone == true) {

        if (currentMaze == 1) {
            setAllWhite();
            mazer1();
            document.getElementById('mazeBtn').innerHTML = "Maze 1";
            visualMazeSetup();
        } else if (currentMaze == 2) {
            setAllWhite();
            maze2();
            document.getElementById('mazeBtn').innerHTML = "Maze 2";
            visualMazeSetup();
        } else if (currentMaze == 3) {
            setAllWhite();
            maze3();
            document.getElementById('mazeBtn').innerHTML = "Random";
            visualMazeSetup();
        }
    }
}

function pressMaze1() {
    currentMaze = 1;
    mazeButton();
}

function pressMaze2() {
    currentMaze = 2;
    mazeButton();
}

function pressMaze3() {
    currentMaze = 3;
    mazeButton();
}

function chooseDijkstra() {
    isDijkstraChosen = true;
    document.getElementById('dijkstraBtn').innerHTML = "Run Dijkstra's Algo";

    isAStarChosen = false;
    isBreadthFirstChosen = false;
    isDepthFirstChosen = false;

}

function chooseAStar() {
    isAStarChosen = true;
    var aStar = "<sup>*</sup>";
    document.getElementById('dijkstraBtn').innerHTML = 'Run A* Search';

    isDijkstraChosen = false;
    isBreadthFirstChosen = false;
    isDepthFirstChosen = false;
}

function chooseBreadthFirst() {
    isBreadthFirstChosen = true;
    document.getElementById('dijkstraBtn').innerHTML = "Run BF Search";

    isDijkstraChosen = false;
    isAStarChosen = false;
    isDepthFirstChosen = false;
}

function chooseDepthFirst() {
    isDepthFirstChosen = true;
    document.getElementById('dijkstraBtn').innerHTML = "Run DF Search";

    isDijkstraChosen = false;
    isAStarChosen = false;
    isBreadthFirstChosen = false;
}

function heuristicFunction(row1, col1, row2, col2) {
    var a = row2 - row1;
    var b = col2 - col1;

    var distance = 10 * (Math.abs(a) + Math.abs(b));

    return distance;
}

function aStarAlgo(startBox, endBox) {
    var open = [];
    var close = [];
    var openLength = 0;

    var currentF = heuristicFunction(gridBoxes[startBox - 1].row + 1, gridBoxes[startBox - 1].col, gridBoxes[endBox - 1].row + 1, gridBoxes[endBox - 1].col);
    gridBoxes[startBox - 1].f = currentF;
    gridBoxes[startBox - 1].g = 0;
    open.push(gridBoxes[startBox - 1]);
    openLength++;

    for (var i = 0; i < gridSize; i++) {
        if (i != startBox - 1) {
            gridBoxes[i].f = 99999;
            gridBoxes[i].g = 99999;
        }
    }

    while (openLength != 0) {

        var lowestF = 99999;
        var chosenBox = null;
        var index = -1;
        for (var i = 0; i < openLength; i++) {
            if (open[i].f < lowestF) {
                lowestF = open[i].f;
                chosenBox = open[i];
                index = i;
            }
        }

        if (chosenBox.boxNum == endBox) {
            isPathFound = true;
            break;
        }

        if (chosenBox.boxNum != startBox) {
            visualQueue.push(chosenBox);
            counter++;
        }

        open.splice(index, 1);
        openLength--;
        close.push(chosenBox);

        // for each neighbor do the following
        var searchTop = false;
        var searchLeft = false;
        var searchBottom = false;
        var searchRight = false;

        // Neighbors depend on location of box
        if (chosenBox.row > 0 && chosenBox.row < (numRows - 1) && chosenBox.col > 1 && chosenBox.col < numColumns) {
            searchTop = true;
            searchLeft = true;
            searchBottom = true;
            searchRight = true;
        } else if (chosenBox.row == 0 && chosenBox.col == 1) {
            searchRight = true;
            searchBottom = true;
        } else if (chosenBox.row == (numRows - 1) && chosenBox.col == 1) {
            searchTop = true;
            searchRight = true;
        } else if (chosenBox.row == 0 && chosenBox.col == numColumns) {
            searchLeft = true;
            searchBottom = true;
        } else if (chosenBox.row == (numRows - 1) && chosenBox.col == numColumns) {
            searchLeft = true;
            searchTop = true;
        } else if (chosenBox.row == 0 && chosenBox.col > 1 && chosenBox.col < numColumns) {
            searchLeft = true;
            searchRight = true;
            searchBottom = true;
        } else if (chosenBox.row == (numRows - 1) && chosenBox.col > 1 && chosenBox.col < numColumns) {
            searchLeft = true;
            searchRight = true;
            searchTop = true;
        } else if (chosenBox.col == 1 && chosenBox.row > 0 && chosenBox.row < (numRows - 1)) {
            searchTop = true;
            searchRight = true;
            searchBottom = true;
        } else if (chosenBox.col == numColumns && chosenBox.row > 0 && chosenBox.row < (numRows - 1)) {
            searchTop = true;
            searchLeft = true;
            searchBottom = true;
        }

        if (searchTop == true) {
            var newDistance;
            var tentativeScore;
            var topIndex = findBoxNumByRowCol(chosenBox.row - 1, chosenBox.col) - 1;
            if (gridBoxes[topIndex].isWall == true) {
                newDistance = 99999;
            } else {
                newDistance = 1;
            }

            tentativeScore = chosenBox.g + newDistance;

            if (tentativeScore < gridBoxes[topIndex].g) {
                gridBoxes[topIndex].previousBoxRow = chosenBox.row;
                gridBoxes[topIndex].previousBoxCol = chosenBox.col;

                gridBoxes[topIndex].g = tentativeScore;
                gridBoxes[topIndex].f = gridBoxes[topIndex].g + heuristicFunction(gridBoxes[topIndex].row + 1, gridBoxes[topIndex].col, gridBoxes[endBox - 1].row + 1, gridBoxes[endBox - 1].col);

                var existsInA = false;
                for (var i = 0; i < openLength; i++) {
                    if (open[i].boxNum == gridBoxes[topIndex].boxNum) {
                        existsInA = true;
                    }
                }

                if (existsInA == false) {
                    open.push(gridBoxes[topIndex]);
                    openLength++;
                    console.log("row: " + gridBoxes[topIndex].row + " col: " + gridBoxes[topIndex].col + "    success");
                    console.log("f: " + gridBoxes[topIndex].f);
                }
            }
        }

        if (searchLeft == true) {
            var newDistance;
            var tentativeScore;
            var leftIndex = findBoxNumByRowCol(chosenBox.row, chosenBox.col - 1) - 1;
            if (gridBoxes[leftIndex].isWall == true) {
                newDistance = 99999;
            } else {
                newDistance = 1;
            }

            tentativeScore = chosenBox.g + newDistance;

            if (tentativeScore < gridBoxes[leftIndex].g) {
                gridBoxes[leftIndex].previousBoxRow = chosenBox.row;
                gridBoxes[leftIndex].previousBoxCol = chosenBox.col;

                gridBoxes[leftIndex].g = tentativeScore;
                gridBoxes[leftIndex].f = gridBoxes[leftIndex].g + heuristicFunction(gridBoxes[leftIndex].row + 1, gridBoxes[leftIndex].col, gridBoxes[endBox - 1].row + 1, gridBoxes[endBox - 1].col);

                var existsInA = false;
                for (var i = 0; i < openLength; i++) {
                    if (open[i].boxNum == gridBoxes[leftIndex].boxNum) {
                        existsInA = true;
                    }
                }

                if (existsInA == false) {
                    open.push(gridBoxes[leftIndex]);
                    openLength++;
                    console.log("row: " + gridBoxes[leftIndex].row + " col: " + gridBoxes[leftIndex].col + "    success");
                    console.log("f: " + gridBoxes[leftIndex].f);
                }
            }
        }

        if (searchBottom == true) {
            var newDistance;
            var tentativeScore;
            var bottomIndex = findBoxNumByRowCol(chosenBox.row + 1, chosenBox.col) - 1;
            if (gridBoxes[bottomIndex].isWall == true) {
                newDistance = 99999;
            } else {
                newDistance = 1;
            }

            tentativeScore = chosenBox.g + newDistance;

            if (tentativeScore < gridBoxes[bottomIndex].g) {
                gridBoxes[bottomIndex].previousBoxRow = chosenBox.row;
                gridBoxes[bottomIndex].previousBoxCol = chosenBox.col;

                gridBoxes[bottomIndex].g = tentativeScore;
                gridBoxes[bottomIndex].f = gridBoxes[bottomIndex].g + heuristicFunction(gridBoxes[bottomIndex].row + 1, gridBoxes[bottomIndex].col, gridBoxes[endBox - 1].row + 1, gridBoxes[endBox - 1].col);

                var existsInA = false;
                for (var i = 0; i < openLength; i++) {
                    if (open[i].boxNum == gridBoxes[bottomIndex].boxNum) {
                        existsInA = true;
                    }
                }

                if (existsInA == false) {
                    open.push(gridBoxes[bottomIndex]);
                    openLength++;
                    console.log("row: " + gridBoxes[bottomIndex].row + " col: " + gridBoxes[bottomIndex].col + "    success");
                    console.log("f: " + gridBoxes[bottomIndex].f);
                }
            }
        }

        if (searchRight == true) {
            var newDistance;
            var tentativeScore;
            var rightIndex = findBoxNumByRowCol(chosenBox.row, chosenBox.col + 1) - 1;
            if (gridBoxes[rightIndex].isWall == true) {
                newDistance = 99999;
            } else {
                newDistance = 1;
            }

            tentativeScore = chosenBox.g + newDistance;

            if (tentativeScore < gridBoxes[rightIndex].g) {
                gridBoxes[rightIndex].previousBoxRow = chosenBox.row;
                gridBoxes[rightIndex].previousBoxCol = chosenBox.col;

                gridBoxes[rightIndex].g = tentativeScore;
                gridBoxes[rightIndex].f = gridBoxes[rightIndex].g + heuristicFunction(gridBoxes[rightIndex].row + 1, gridBoxes[rightIndex].col, gridBoxes[endBox - 1].row + 1, gridBoxes[endBox - 1].col);

                var existsInA = false;
                for (var i = 0; i < openLength; i++) {
                    if (open[i].boxNum == gridBoxes[rightIndex].boxNum) {
                        existsInA = true;
                    }
                }

                if (existsInA == false) {
                    open.push(gridBoxes[rightIndex]);
                    openLength++;
                    console.log("row: " + gridBoxes[rightIndex].row + " col: " + gridBoxes[rightIndex].col + "    success");
                    console.log("f: " + gridBoxes[rightIndex].f);
                }
            }
        }
    }

    if (changeColor == false) {
        changeColor = true;
        changeAt = counter;
    }
}

function breadthFirstSearch(startBox, endBox) {
    var queue = [];
    gridBoxes[startBox - 1].visited = true;
    queue.splice(0, 0, gridBoxes[startBox - 1]);

    while (queue.length != 0) {
        var chosenBox = queue[queue.length - 1];
        queue.splice(queue.length - 1, 1);

        if (chosenBox.boxNum == endBox) {
            isPathFound = true;
            break;
        }

        if (chosenBox.boxNum != startBox) {
            visualQueue.push(chosenBox);
            counter++;
        }

        // for each neighbor do the following
        var searchTop = false;
        var searchLeft = false;
        var searchBottom = false;
        var searchRight = false;

        // Neighbors depend on location of box
        if (chosenBox.row > 0 && chosenBox.row < (numRows - 1) && chosenBox.col > 1 && chosenBox.col < numColumns) {
            searchTop = true;
            searchLeft = true;
            searchBottom = true;
            searchRight = true;
        } else if (chosenBox.row == 0 && chosenBox.col == 1) {
            searchRight = true;
            searchBottom = true;
        } else if (chosenBox.row == (numRows - 1) && chosenBox.col == 1) {
            searchTop = true;
            searchRight = true;
        } else if (chosenBox.row == 0 && chosenBox.col == numColumns) {
            searchLeft = true;
            searchBottom = true;
        } else if (chosenBox.row == (numRows - 1) && chosenBox.col == numColumns) {
            searchLeft = true;
            searchTop = true;
        } else if (chosenBox.row == 0 && chosenBox.col > 1 && chosenBox.col < numColumns) {
            searchLeft = true;
            searchRight = true;
            searchBottom = true;
        } else if (chosenBox.row == (numRows - 1) && chosenBox.col > 1 && chosenBox.col < numColumns) {
            searchLeft = true;
            searchRight = true;
            searchTop = true;
        } else if (chosenBox.col == 1 && chosenBox.row > 0 && chosenBox.row < (numRows - 1)) {
            searchTop = true;
            searchRight = true;
            searchBottom = true;
        } else if (chosenBox.col == numColumns && chosenBox.row > 0 && chosenBox.row < (numRows - 1)) {
            searchTop = true;
            searchLeft = true;
            searchBottom = true;
        }

        if (searchTop == true) {
            var topIndex = findBoxNumByRowCol(chosenBox.row - 1, chosenBox.col) - 1;

            if (gridBoxes[topIndex].isWall == false && gridBoxes[topIndex].visited == false) {
                gridBoxes[topIndex].visited = true;
                gridBoxes[topIndex].previousBoxRow = chosenBox.row;
                gridBoxes[topIndex].previousBoxCol = chosenBox.col;
                queue.splice(0, 0, gridBoxes[topIndex]);
            }
        }

        if (searchLeft == true) {
            var leftIndex = findBoxNumByRowCol(chosenBox.row, chosenBox.col - 1) - 1;

            if (gridBoxes[leftIndex].isWall == false && gridBoxes[leftIndex].visited == false) {
                gridBoxes[leftIndex].visited = true;
                gridBoxes[leftIndex].previousBoxRow = chosenBox.row;
                gridBoxes[leftIndex].previousBoxCol = chosenBox.col;
                queue.splice(0, 0, gridBoxes[leftIndex]);
            }
        }

        if (searchBottom == true) {
            var bottomIndex = findBoxNumByRowCol(chosenBox.row + 1, chosenBox.col) - 1;

            if (gridBoxes[bottomIndex].isWall == false && gridBoxes[bottomIndex].visited == false) {
                gridBoxes[bottomIndex].visited = true;
                gridBoxes[bottomIndex].previousBoxRow = chosenBox.row;
                gridBoxes[bottomIndex].previousBoxCol = chosenBox.col;
                queue.splice(0, 0, gridBoxes[bottomIndex]);
            }
        }

        if (searchRight == true) {
            var rightIndex = findBoxNumByRowCol(chosenBox.row, chosenBox.col + 1) - 1;

            if (gridBoxes[rightIndex].isWall == false && gridBoxes[rightIndex].visited == false) {
                gridBoxes[rightIndex].visited = true;
                gridBoxes[rightIndex].previousBoxRow = chosenBox.row;
                gridBoxes[rightIndex].previousBoxCol = chosenBox.col;
                queue.splice(0, 0, gridBoxes[rightIndex]);
                console.log("hi");
            }
        }
    }

    if (changeColor == false) {
        changeColor = true;
        changeAt = counter;
    }
}

function depthFirstSearch(startBox, endBox) {
    var depthStack = [];
    depthStack.push(gridBoxes[startBox - 1]);

    while (depthStack.length != 0) {
        var chosenBox = depthStack.pop();

        if (chosenBox.boxNum == endBox) {
            console.log("finish");
            isPathFound = true;
            break;
        }

        if (chosenBox.boxNum != startBox) {
            visualQueue.push(chosenBox);
            counter++;
        }

        if (chosenBox.visited == false) {
            chosenBox.visited = true;

            // for each neighbor do the following
            var searchTop = false;
            var searchLeft = false;
            var searchBottom = false;
            var searchRight = false;

            // Neighbors depend on location of box
            if (chosenBox.row > 0 && chosenBox.row < (numRows - 1) && chosenBox.col > 1 && chosenBox.col < numColumns) {
                searchTop = true;
                searchLeft = true;
                searchBottom = true;
                searchRight = true;
            } else if (chosenBox.row == 0 && chosenBox.col == 1) {
                searchRight = true;
                searchBottom = true;
            } else if (chosenBox.row == (numRows - 1) && chosenBox.col == 1) {
                searchTop = true;
                searchRight = true;
            } else if (chosenBox.row == 0 && chosenBox.col == numColumns) {
                searchLeft = true;
                searchBottom = true;
            } else if (chosenBox.row == (numRows - 1) && chosenBox.col == numColumns) {
                searchLeft = true;
                searchTop = true;
            } else if (chosenBox.row == 0 && chosenBox.col > 1 && chosenBox.col < numColumns) {
                searchLeft = true;
                searchRight = true;
                searchBottom = true;
            } else if (chosenBox.row == (numRows - 1) && chosenBox.col > 1 && chosenBox.col < numColumns) {
                searchLeft = true;
                searchRight = true;
                searchTop = true;
            } else if (chosenBox.col == 1 && chosenBox.row > 0 && chosenBox.row < (numRows - 1)) {
                searchTop = true;
                searchRight = true;
                searchBottom = true;
            } else if (chosenBox.col == numColumns && chosenBox.row > 0 && chosenBox.row < (numRows - 1)) {
                searchTop = true;
                searchLeft = true;
                searchBottom = true;
            }

            if (searchLeft == true) {
                var leftIndex = findBoxNumByRowCol(chosenBox.row, chosenBox.col - 1) - 1;
                if (gridBoxes[leftIndex].isWall == false && gridBoxes[leftIndex].visited == false) {
                    depthStack.push(gridBoxes[leftIndex]);
                    gridBoxes[leftIndex].previousBoxRow = chosenBox.row;
                    gridBoxes[leftIndex].previousBoxCol = chosenBox.col;
                    console.log("test");
                }
            }
            if (searchBottom == true) {
                var bottomIndex = findBoxNumByRowCol(chosenBox.row + 1, chosenBox.col) - 1;
                if (gridBoxes[bottomIndex].isWall == false && gridBoxes[bottomIndex].visited == false) {
                    depthStack.push(gridBoxes[bottomIndex]);
                    gridBoxes[bottomIndex].previousBoxRow = chosenBox.row;
                    gridBoxes[bottomIndex].previousBoxCol = chosenBox.col;
                }
            }
            if (searchRight == true) {
                var rightIndex = findBoxNumByRowCol(chosenBox.row, chosenBox.col + 1) - 1;
                if (gridBoxes[rightIndex].isWall == false && gridBoxes[rightIndex].visited == false) {
                    depthStack.push(gridBoxes[rightIndex]);
                    gridBoxes[rightIndex].previousBoxRow = chosenBox.row;
                    gridBoxes[rightIndex].previousBoxCol = chosenBox.col;
                }
            }
            if (searchTop == true) {
                var topIndex = findBoxNumByRowCol(chosenBox.row - 1, chosenBox.col) - 1;
                if (gridBoxes[topIndex].isWall == false && gridBoxes[topIndex].visited == false) {
                    depthStack.push(gridBoxes[topIndex]);
                    gridBoxes[topIndex].previousBoxRow = chosenBox.row;
                    gridBoxes[topIndex].previousBoxCol = chosenBox.col;
                }
            }
        }
    }
    if (changeColor == false) {
        changeColor = true;
        changeAt = counter;
    }
    console.log("exit");
    console.log("size of visual queue: " + visualQueue.length);
}

document.getElementById('dijkstraBtn').addEventListener('click', function() {
    if (isDijkstraChosen == true && algoReset == false) {
        callDijkstra();
    } else if (isAStarChosen == true && algoReset == false) {
        if (algoReset == false && mazeSetupDone == true) {

            if (isCheckpointActive == true) {

                if (visualizerToggle == true) {
                    aStarAlgo(startBoxNumber, middleBoxNumber);

                    if (isPathFound == true) {
                        storeShortestPath(middleBoxNumber);
                        resetAlgoStatsWithCheckpoint();
                        aStarAlgo(middleBoxNumber, endBoxNumber);

                        if (isPathFound == true) {
                            storeShortestPath(endBoxNumber);

                            printVisual();
                        }
                    }
                } else {
                    resetAlgoStatsWithCheckpoint();
                    aStarAlgo(middleBoxNumber, endBoxNumber);

                    if (isPathFound == true) {
                        storeShortestPath(endBoxNumber);
                        resetAlgoStatsWithCheckpoint();
                        aStarAlgo(startBoxNumber, middleBoxNumber);

                        if (isPathFound == true) {
                            storeShortestPath(middleBoxNumber);
                            printPath();
                        }
                    }
                }
            } else {
                aStarAlgo(startBoxNumber, endBoxNumber);

                if (isPathFound == true) {
                    storeShortestPath(endBoxNumber);

                    if (visualizerToggle == true) {
                        printVisual();
                    } else {
                        printPath();
                    }
                }
            }
            algoReset = true;
        }
    } else if (isBreadthFirstChosen == true && algoReset == false) {

        if (algoReset == false && mazeSetupDone == true) {

            if (isCheckpointActive == true) {

                if (visualizerToggle == true) {
                    breadthFirstSearch(startBoxNumber, middleBoxNumber);

                    if (isPathFound == true) {
                        storeShortestPath(middleBoxNumber);
                        resetAlgoStatsWithCheckpoint();
                        breadthFirstSearch(middleBoxNumber, endBoxNumber);

                        if (isPathFound == true) {
                            storeShortestPath(endBoxNumber);

                            printVisual();
                        }
                    }
                } else {
                    resetAlgoStatsWithCheckpoint();
                    breadthFirstSearch(middleBoxNumber, endBoxNumber);

                    if (isPathFound == true) {
                        storeShortestPath(endBoxNumber);
                        resetAlgoStatsWithCheckpoint();
                        breadthFirstSearch(startBoxNumber, middleBoxNumber);

                        if (isPathFound == true) {
                            storeShortestPath(middleBoxNumber);
                            printPath();
                        }
                    }
                }
            } else {
                breadthFirstSearch(startBoxNumber, endBoxNumber);

                if (isPathFound == true) {
                    storeShortestPath(endBoxNumber);

                    if (visualizerToggle == true) {
                        printVisual();
                    } else {
                        printPath();
                    }
                }
            }
            algoReset = true;
        }
    } else if (isDepthFirstChosen == true && algoReset == false) {

        if (algoReset == false && mazeSetupDone == true) {

            if (isCheckpointActive == true) {

                if (visualizerToggle == true) {
                    depthFirstSearch(startBoxNumber, middleBoxNumber);

                    if (isPathFound == true) {
                        storeShortestPath(middleBoxNumber);
                        resetAlgoStatsWithCheckpoint();
                        depthFirstSearch(middleBoxNumber, endBoxNumber);

                        if (isPathFound == true) {
                            storeShortestPath(endBoxNumber);

                            printVisual();
                        }
                    }
                } else {
                    resetAlgoStatsWithCheckpoint();
                    depthFirstSearch(middleBoxNumber, endBoxNumber);

                    if (isPathFound == true) {
                        storeShortestPath(endBoxNumber);
                        resetAlgoStatsWithCheckpoint();
                        depthFirstSearch(startBoxNumber, middleBoxNumber);

                        if (isPathFound == true) {
                            storeShortestPath(middleBoxNumber);
                            printPath();
                        }
                    }
                }
            } else {
                depthFirstSearch(startBoxNumber, endBoxNumber);

                if (isPathFound == true) {
                    storeShortestPath(endBoxNumber);

                    if (visualizerToggle == true) {
                        printVisual();
                    } else {
                        printPath();
                    }
                }
            }
            algoReset = true;
        }
    }
});

// Adding Tutorial functionality
function startUp() {

    if (document.refreshForm.visited.value == "") {
        document.querySelector('.modal1').setAttribute("style", "display: flex;");
        document.refreshForm.visited.value = "1";
    } else {
        document.querySelector('.modal1').setAttribute("style", "display: none;");
        console.log("cookie test");
    }

}

function skipTutorial() {
    document.querySelector('.modal1').setAttribute("style", "display: none;");
    document.querySelector('.modal2').setAttribute("style", "display: none;");
    document.querySelector('.modal3').setAttribute("style", "display: none;");
    document.querySelector('.modal4').setAttribute("style", "display: none;");
    document.querySelector('.modal5').setAttribute("style", "display: none;");
    document.querySelector('.modal6').setAttribute("style", "display: none;");
    document.querySelector('.modal7').setAttribute("style", "display: none;");
    document.querySelector('.modal8').setAttribute("style", "display: none;");
    document.querySelector('.modal9').setAttribute("style", "display: none;");
    stack.pop();
}

// Slide 1 functionality
function slide1Next() {
    document.querySelector('.modal1').setAttribute("style", "display: none;");
    document.querySelector('.modal2').setAttribute("style", "display: flex;");
}

// Slide 2 functionality
function slide2Prev() {
    document.querySelector('.modal2').setAttribute("style", "display: none;");
    document.querySelector('.modal1').setAttribute("style", "display: flex;");
}

function slide2Next() {
    document.querySelector('.modal2').setAttribute("style", "display: none;");
    document.querySelector('.modal3').setAttribute("style", "display: flex;");
}

// Slide 3 functionality
function slide3Prev() {
    document.querySelector('.modal3').setAttribute("style", "display: none;");
    document.querySelector('.modal2').setAttribute("style", "display: flex;");
}

function slide3Next() {
    document.querySelector('.modal3').setAttribute("style", "display: none;");
    document.querySelector('.modal4').setAttribute("style", "display: flex;");
}

// Slide 4 functionality
function slide4Prev() {
    document.querySelector('.modal4').setAttribute("style", "display: none;");
    document.querySelector('.modal3').setAttribute("style", "display: flex;");
}

function slide4Next() {
    document.querySelector('.modal4').setAttribute("style", "display: none;");
    document.querySelector('.modal5').setAttribute("style", "display: flex;");
}

// Slide 5 functionality
function slide5Prev() {
    document.querySelector('.modal5').setAttribute("style", "display: none;");
    document.querySelector('.modal4').setAttribute("style", "display: flex;");
}

function slide5Next() {
    document.querySelector('.modal5').setAttribute("style", "display: none;");
    document.querySelector('.modal6').setAttribute("style", "display: flex;");
}

// Slide 6 functionality
function slide6Prev() {
    document.querySelector('.modal6').setAttribute("style", "display: none;");
    document.querySelector('.modal5').setAttribute("style", "display: flex;");
}

function slide6Next() {
    document.querySelector('.modal6').setAttribute("style", "display: none;");
    document.querySelector('.modal7').setAttribute("style", "display: flex;");
}

// Slide 7 functionality
function slide7Prev() {
    document.querySelector('.modal7').setAttribute("style", "display: none;");
    document.querySelector('.modal6').setAttribute("style", "display: flex;");
}

function slide7Next() {
    document.querySelector('.modal7').setAttribute("style", "display: none;");
    document.querySelector('.modal8').setAttribute("style", "display: flex;");
}

// Slide 8 functionality
function slide8Prev() {
    document.querySelector('.modal8').setAttribute("style", "display: none;");
    document.querySelector('.modal7').setAttribute("style", "display: flex;");
}

function slide8Next() {
    document.querySelector('.modal8').setAttribute("style", "display: none;");
    document.querySelector('.modal9').setAttribute("style", "display: flex;");
}

// Slide 9 functionality
function slide9Prev() {
    document.querySelector('.modal9').setAttribute("style", "display: none;");
    document.querySelector('.modal8').setAttribute("style", "display: flex;");
}

function slide9Next() {
    document.querySelector('.modal9').setAttribute("style", "display: none;");
    stack.pop();
}

// Title functionality
function titleClick() {
    document.querySelector('.modal1').setAttribute("style", "display: flex;");
    stack.push(1);
}