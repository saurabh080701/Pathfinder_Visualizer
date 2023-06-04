function mazer1() {
  // erase current start and end box (and middle if it exists)
  if (isCheckpointActive == true) {
    document.getElementById(convertToId(middleBoxNumber)).setAttribute(
      "style",
      "background-color: white;"
    );
    document.getElementById("insertCheckpoint").innerHTML = "Insert Checkpoint";
    gridBoxes[middleBoxNumber - 1].isCheckpoint = false;
    middleBoxNumber = -1;
    isCheckpointActive = false;
  }

  // set start
  document.getElementById(convertToId(startBoxNumber)).setAttribute(
    "style",
    "background-color: white;"
  );
  gridBoxes[startBoxNumber - 1].isStart = false;

  startBoxNumber = 1;
  gridBoxes[startBoxNumber - 1].isStart = true;
  document.getElementById(convertToId(startBoxNumber)).setAttribute(
    "style",
    "background-color: green;"
  );

  // set finish
  document.getElementById(convertToId(endBoxNumber)).setAttribute(
    "style",
    "background-color: white;"
  );
  gridBoxes[endBoxNumber - 1].isFinish = false;

  endBoxNumber = gridSize;
  gridBoxes[gridSize - 1].isFinish = true;
  document.getElementById(convertToId(endBoxNumber)).setAttribute(
    "style",
    "background-color: red;"
  );

  // Modify the maze design here
  for (var i = 0; i < gridSize; i++) {
    if (
      (gridBoxes[i].col === 2 && gridBoxes[i].row !== 0) ||
      (gridBoxes[i].col === 4 && gridBoxes[i].row !== numRows - 1) ||
      (gridBoxes[i].col === 6 && gridBoxes[i].row !== 0) ||
      (gridBoxes[i].col === 8 && gridBoxes[i].row !== numRows - 1) ||
      (gridBoxes[i].row === 2 && gridBoxes[i].col !== numColumns - 1) ||
      (gridBoxes[i].row === 4 && gridBoxes[i].col !== 0) ||
      (gridBoxes[i].row === 6 && gridBoxes[i].col !== numColumns - 1) ||
      (gridBoxes[i].row === 8 && gridBoxes[i].col !== 0) ||
      (gridBoxes[i].row === 10 && gridBoxes[i].col !== numColumns - 1) ||
      (gridBoxes[i].row === 12 && gridBoxes[i].col !== 0)
    ) {
      gridBoxes[i].isWall = true;
      document.getElementById(gridBoxes[i].divId).setAttribute(
        "style",
        "background-color: black;"
      );
    } else if (gridBoxes[i].isStart == false && gridBoxes[i].isFinish == false) {
      gridBoxes[i].isWall = false;
      document.getElementById(gridBoxes[i].divId).setAttribute(
        "style",
        "background-color: white;"
      );
    }
  }
}
