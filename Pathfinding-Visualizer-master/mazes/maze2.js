function maze2 () {
    // erase current start and end box (and middle if it exists)
    if (isCheckpointActive == true) {
        document.getElementById(convertToId(middleBoxNumber)).setAttribute("style", "background-color: white;");
        document.getElementById('insertCheckpoint').innerHTML = "Insert Checkpoint";
        gridBoxes[middleBoxNumber - 1].isCheckpoint = false;
        middleBoxNumber = -1;
        isCheckpointActive = false;
    }

    var columnWidth = Math.floor(numColumns/10);
    var rowHeight = Math.floor(numRows/5);

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
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].col >= fourthColumn && gridBoxes[i].col <= fifthColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].col >= seventhColumn && gridBoxes[i].col <= ninthColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else {
                gridBoxes[i].isWall = false;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: white;");
            }

        }
        else if (gridBoxes[i].row == secondRow) {

            if (gridBoxes[i].col >= firstColumn && gridBoxes[i].col <= fourthColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].col >= fifthColumn && gridBoxes[i].col <= sixthColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].col >= ninthColumn && gridBoxes[i].col <= tenthColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else {
                gridBoxes[i].isWall = false;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: white;");
            }

        }
        else if (gridBoxes[i].row == thirdRow) {

            if (gridBoxes[i].col >= 0 && gridBoxes[i].col <= firstColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].col >= thirdColumn && gridBoxes[i].col <= fourthColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].col >= sixthColumn && gridBoxes[i].col <= eighthColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else {
                gridBoxes[i].isWall = false;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: white;");
            }

        }
        else if (gridBoxes[i].row == fourthRow) {

            if (gridBoxes[i].col >= firstColumn && gridBoxes[i].col <= thirdColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].col >= fifthColumn && gridBoxes[i].col <= seventhColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].col >= eighthColumn && gridBoxes[i].col <= tenthColumn) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else {
                gridBoxes[i].isWall = false;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: white;");
            }

        }
        else if ((gridBoxes[i].row == 0 && gridBoxes[i].col <= tenthColumn) || (gridBoxes[i].row == fifthRow && gridBoxes[i].col <= tenthColumn) || (gridBoxes[i].col == 1 && gridBoxes[i].row <= fifthRow) || (gridBoxes[i].col == tenthColumn && gridBoxes[i].row <= fifthRow)) {
            gridBoxes[i].isWall = true;
            //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
        }
        else if (gridBoxes[i].isStart == false && gridBoxes[i].isFinish == false) {
            gridBoxes[i].isWall = false;
            //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: white;");
        }

        // scavenger by column
        if (gridBoxes[i].col == firstColumn) {

            if (gridBoxes[i].row >= firstRow && gridBoxes[i].row <= secondRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }

        }
        else if (gridBoxes[i].col == secondColumn) {

            if (gridBoxes[i].row >= secondRow && gridBoxes[i].row <= thirdRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }

        }
        else if (gridBoxes[i].col == thirdColumn) {

            if (gridBoxes[i].row >= 0 && gridBoxes[i].row <= secondRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].row >= thirdRow && gridBoxes[i].row <= fourthRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }

        }
        else if (gridBoxes[i].col == fourthColumn) {

            if (gridBoxes[i].row >= secondRow && gridBoxes[i].row <= thirdRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].row >= fourthRow && gridBoxes[i].row <= fifthRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }

        }
        else if (gridBoxes[i].col == fifthColumn) {

            if (gridBoxes[i].row >= firstRow && gridBoxes[i].row <= secondRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].row >= thirdRow && gridBoxes[i].row <= fourthRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }

        }
        else if (gridBoxes[i].col == sixthColumn) {

            if (gridBoxes[i].row >= secondRow && gridBoxes[i].row <= thirdRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].row >= fourthRow && gridBoxes[i].row <= fifthRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }

        }
        else if (gridBoxes[i].col == seventhColumn) {

            if (gridBoxes[i].row >= firstRow && gridBoxes[i].row <= secondRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
            else if (gridBoxes[i].row >= thirdRow && gridBoxes[i].row <= fourthRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }

        }
        else if (gridBoxes[i].col == eighthColumn) {

            if (gridBoxes[i].row >= firstRow && gridBoxes[i].row <= thirdRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }
        }
        else if (gridBoxes[i].col == ninthColumn) {

            if (gridBoxes[i].row >= secondRow && gridBoxes[i].row <= thirdRow) {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }

        }

        if ((gridBoxes[i].row == firstRow && gridBoxes[i].col == 1) || (gridBoxes[i].row == secondRow && gridBoxes[i].col == 1) || (gridBoxes[i].row == fourthRow && gridBoxes[i].col == 1) || 
        (gridBoxes[i].row == firstRow && gridBoxes[i].col == tenthColumn) || (gridBoxes[i].row == secondRow && gridBoxes[i].col == tenthColumn) || (gridBoxes[i].row == thirdRow && gridBoxes[i].col == tenthColumn) || 
        gridBoxes[i].row == numRows - 1) {
            gridBoxes[i].isWall = true;
            //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
        }

        if (gridBoxes[i].col > tenthColumn) {
            gridBoxes[i].isWall = false;
        }

    }
}