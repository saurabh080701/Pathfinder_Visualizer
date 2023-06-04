function maze3 () {

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
    document.getElementById(convertToId(startBoxNumber)).setAttribute("style", "background-color: #42b883;");

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
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: white;");
            }
            else {
                gridBoxes[i].isWall = true;
                //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: black;");
            }

        }

        if (i == 1 || i == numColumns || i == endBoxNumber - 2 || i == endBoxNumber - 1 - numColumns) {
            gridBoxes[i].isWall = false;
            //document.getElementById(gridBoxes[i].divId).setAttribute("style", "background-color: white;");
        }

    }
}