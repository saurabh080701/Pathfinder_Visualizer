function depthFirstSearch (startBox, endBox) {
    var depthStack = [];
    //gridBoxes[startBox - 1].visited = true;
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
            }
            else if (chosenBox.row == 0 && chosenBox.col == 1) {
                searchRight = true;
                searchBottom = true;
            }
            else if (chosenBox.row == (numRows - 1) && chosenBox.col == 1) {
                searchTop = true;
                searchRight = true;
            }
            else if (chosenBox.row == 0 && chosenBox.col == numColumns) {
                searchLeft = true;
                searchBottom = true;
            }
            else if (chosenBox.row == (numRows - 1) && chosenBox.col == numColumns) {
                searchLeft = true;
                searchTop = true;
            }
            else if (chosenBox.row == 0 && chosenBox.col > 1 && chosenBox.col < numColumns) {
                searchLeft = true;
                searchRight = true;
                searchBottom = true;
            }
            else if (chosenBox.row == (numRows - 1) && chosenBox.col > 1 && chosenBox.col < numColumns) {
                searchLeft = true;
                searchRight = true;
                searchTop = true;
            }
            else if (chosenBox.col == 1 && chosenBox.row > 0 && chosenBox.row < (numRows - 1)) {
                searchTop = true;
                searchRight = true;
                searchBottom = true;
            }
            else if (chosenBox.col == numColumns && chosenBox.row > 0 && chosenBox.row < (numRows - 1)) {
                searchTop = true;
                searchLeft = true;
                searchBottom = true;
            }

            if (searchLeft == true) {
                var leftIndex = findBoxNumByRowCol(chosenBox.row, chosenBox.col - 1) - 1;
                if (gridBoxes[leftIndex].isWall == false && gridBoxes[leftIndex].visited == false) {
                    depthStack.push(gridBoxes[leftIndex]);
                    //gridBoxes[leftIndex].visited = true;
                    gridBoxes[leftIndex].previousBoxRow = chosenBox.row;
                    gridBoxes[leftIndex].previousBoxCol = chosenBox.col;
                    console.log("test");
                }
            }
            if (searchBottom == true) {
                var bottomIndex = findBoxNumByRowCol(chosenBox.row + 1, chosenBox.col) - 1;
                if (gridBoxes[bottomIndex].isWall == false && gridBoxes[bottomIndex].visited == false) {
                    depthStack.push(gridBoxes[bottomIndex]);
                    //gridBoxes[bottomIndex].visited = true;
                    gridBoxes[bottomIndex].previousBoxRow = chosenBox.row;
                    gridBoxes[bottomIndex].previousBoxCol = chosenBox.col;
                }
            }
            if (searchRight == true) {
                var rightIndex = findBoxNumByRowCol(chosenBox.row, chosenBox.col + 1) - 1;
                if (gridBoxes[rightIndex].isWall == false && gridBoxes[rightIndex].visited == false) {
                    depthStack.push(gridBoxes[rightIndex]);
                    //gridBoxes[rightIndex].visited = true;
                    gridBoxes[rightIndex].previousBoxRow = chosenBox.row;
                    gridBoxes[rightIndex].previousBoxCol = chosenBox.col;
                }
            }
            if (searchTop == true) {
                var topIndex = findBoxNumByRowCol(chosenBox.row - 1, chosenBox.col) - 1;
                if (gridBoxes[topIndex].isWall == false && gridBoxes[topIndex].visited == false) {
                    depthStack.push(gridBoxes[topIndex]);
                    //gridBoxes[topIndex].visited = true;
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