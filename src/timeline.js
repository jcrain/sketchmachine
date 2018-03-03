let selectLastFrame = false;
let selectFirstFrame = false;

function selectRange (sketch) {
  for (let i = firstFrame; i < lastFrame; i++) {
    onFrame[i] = true;
  }
  if (pause) {
    displayTimeline(timelineSketch);
  }
}

function deselect (sketch) {
  for (let i = 0; i < numFrames; i++) {
    onFrame[i] = false;
  }
  if (pause) {
    displayTimeline(timelineSketch);
  }
}


function displayTimeline (sketch) {

  sketch.drawingContext.clearRect(0, 0, sketch.width, sketch.height);

  let tw = frameDim / numFrames;
  let ty = 12;  // Gap from the top of the canvas
  let tlh = 30;  // Height of the time line
  let th = 40;  // Height of the selection arrows

  let tx = sketch.map(currentFrame, 0, numFrames, 0, sketch.width);

  if (!startDrawing) {
    for (let x = firstFrame; x < lastFrame; x++) {
      let xx = sketch.map(x, 0, numFrames, 0, sketch.width);
      if ((sketch.mouseX > xx && sketch.mouseX < xx + tw && sketch.mouseY > ty && sketch.mouseY < ty + tlh)) {
        if (sketch.mouseIsPressed && sketch.mouseY >= ty && sketch.mouseY <= ty + tlh && !selectFirstFrame && !selectLastFrame) {
          if (!pause) {
            clickPlay()
          }
          currentFrame = x;
          arrowLock = true;
        }
      }
    }
  }

  // DRAW FRAMES THAT ARE "ON", THAT ARE CURRENTLY BEING DRAWING INTO
  for (let i = firstFrame; i < lastFrame; i++) {
    if (onFrame[i]) {
      let tempx = sketch.map(i, 0, numFrames, 0, sketch.width);
      sketch.noStroke();
      sketch.fill(126, 126, 126);
      sketch.rect(tempx, ty, tw, tlh+1);
    }
  }

  // CURRENT FRAME MARKER (MIDDLE)
  sketch.noStroke();
  sketch.fill(0, 0, 255);
  sketch.rect(tx, ty, tw, tlh+1);

  // RANGE OF FRAMES, FIRST TO LAST
  let tty = ty+tlh+6;
  //let tty = ty;
  let ffx = firstFrame * tw;
  let lfx = (lastFrame - 1) * tw;

  // BETWEEN THE IN AND OUT MARKER
  if (sketch.mouseX > ffx + tw && sketch.mouseX < lfx && sketch.mouseY > tty && sketch.mouseY < tty + th && !selectFirstFrame && !selectLastFrame) {
    if (!startDrawing && !arrowLock) {
      sketch.fill(126, 126, 126);
      sketch.noStroke();
      sketch.rect(ffx, tty, lfx-ffx+tw, th);
      timelineRangeSelected = true;
      timelineRangeLock = true;
    }
  } else {
    timelineRangeSelected = false;
  }

  // CONNECT IN AND OUT MARKERS
  sketch.stroke(102);
  sketch.line(firstFrame * tw + tw - 1, tty + th / 2, (lastFrame - 1) * tw, tty + th / 2);

  // IN MARKER
  sketch.fill(51); // Default color overwritten with blue if mouse is over
  sketch.noStroke();
  if (sketch.mouseX > ffx && sketch.mouseX < ffx + tw && sketch.mouseY > tty && sketch.mouseY < tty + th) {
    if (!startDrawing) {
      if (sketch.mouseIsPressed && !selectLastFrame && !arrowLock) {
        selectFirstFrame = true;  // Goes "false" in mouseReleased
        //
      }
      if (!selectLastFrame && !arrowLock) {
        sketch.fill(0, 0, 255);
      }
    }
  }
  if (selectFirstFrame) {
    firstFrame = sketch.floor(sketch.mouseX / tw);
    firstFrame = sketch.constrain(firstFrame, 0, lastFrame - 2);
    if (currentFrame < firstFrame) {
      currentFrame = firstFrame;
    }
    sketch.fill(0, 0, 255);
  }
  sketch.triangle(firstFrame * tw, tty, firstFrame * tw, tty + th, (firstFrame + 1) * tw, tty + th / 2);

  // OUT MARKER
  sketch.fill(51);
  if (sketch.mouseX > lfx && sketch.mouseX < lfx + tw && sketch.mouseY > tty && sketch.mouseY < tty + th) {
    if (!startDrawing) {
      if (sketch.mouseIsPressed && !selectFirstFrame && !arrowLock) {
        selectLastFrame = true;  // Goes "false" in mouseReleased
      }
      if (!selectFirstFrame && !arrowLock){
        sketch.fill(0, 0, 255);
      }
    }
  }
  if (selectLastFrame) {
    lastFrame = sketch.ceil(sketch.mouseX / tw);
    lastFrame = sketch.constrain(lastFrame, firstFrame + 2, numFrames);
    if (currentFrame > lastFrame - 1) {
      currentFrame = lastFrame - 1;
    }
    sketch.fill(0, 0, 255);
  }
  sketch.triangle(lastFrame * tw, tty, lastFrame * tw, tty + th, (lastFrame - 1) * tw, tty + th / 2);



  // TICK MARKS, THE GRID OF FRAMES
  for (let x = 0; x <= numFrames; x++) {

    let xx = sketch.map(x, 0, numFrames, 0, sketch.width);
    if (x < firstFrame || x > lastFrame) {
      sketch.stroke(153);
    } else {
      sketch.stroke(0);
    }
    //sketch.line(xx, ty + th, xx, ty + th2);
    sketch.line(xx, ty, xx, ty + tlh);
  }
  //sketch.line(frameDim-1, ty + th, frameDim-1, ty + th2);
  sketch.line(frameDim-1, ty, frameDim-1, ty + tlh);
}
