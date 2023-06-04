function runDijkstraAlgo (startBox, endBox) {
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
        }
        else if (gridBoxes[chosenBox].row == 0 && gridBoxes[chosenBox].col == 1) {
            searchRight = true;
            searchBottom = true;
        }
        else if (gridBoxes[chosenBox].row == (numRows - 1) && gridBoxes[chosenBox].col == 1) {
            searchTop = true;
            searchRight = true;
        }
        else if (gridBoxes[chosenBox].row == 0 && gridBoxes[chosenBox].col == numColumns) {
            searchLeft = true;
            searchBottom = true;
        }
        else if (gridBoxes[chosenBox].row == (numRows - 1) && gridBoxes[chosenBox].col == numColumns) {
            searchLeft = true;
            searchTop = true;
        }
        else if (gridBoxes[chosenBox].row == 0 && gridBoxes[chosenBox].col > 1 && gridBoxes[chosenBox].col < numColumns) {
            searchLeft = true;
            searchRight = true;
            searchBottom = true;
        }
        else if (gridBoxes[chosenBox].row == (numRows - 1) && gridBoxes[chosenBox].col > 1 && gridBoxes[chosenBox].col < numColumns) {
            searchLeft = true;
            searchRight = true;
            searchTop = true;
        }
        else if (gridBoxes[chosenBox].col == 1 && gridBoxes[chosenBox].row > 0 && gridBoxes[chosenBox].row < (numRows - 1)) {
            searchTop = true;
            searchRight = true;
            searchBottom = true;
        }
        else if (gridBoxes[chosenBox].col == numColumns && gridBoxes[chosenBox].row > 0 && gridBoxes[chosenBox].row < (numRows - 1)) {
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
                }
                else {
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
                }
                else {
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
                }
                else {
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
                }
                else {
                    testDistance = gridBoxes[chosenBox].distance + 1;
                }

                if (testDistance < gridBoxes[bottomIndex].distance) {
                    gridBoxes[bottomIndex].distance = testDistance;
                    gridBoxes[bottomIndex].previousBoxRow = gridBoxes[chosenBox].row;
                    gridBoxes[bottomIndex].previousBoxCol = gridBoxes[chosenBox].col;
                }

            }
        }
        //if (gridBoxes[chosen])
    }

    if (changeColor == false) {
        changeColor = true;
        changeAt = counter;
    }

}