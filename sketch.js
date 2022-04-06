let mySynth;
let a, d, s, r;
let firstX;
let x = [];
let y = [];
let stepArray = [];
let index = 0;
let drawer = 0;
let step;
let bpm = 80;
let loopBeat;
let mouseoff = false;
let stepStart = 0,
  steptEnd = 0;
let lineLength, cellsUsed;
let counter = 0,
  bcounter = 0;
let newLine = false;
let drawing = false;
let tranPoints = [];
let drawPoint;
let j = 0,
  bj = 0;
songCounter = 0;
let noteTriggered;
let loopCounter = 1;
let bassNote = 1;

let nextColor;
var curColor;
var gridOn = true;

var xPos=1;
var changePos;
let releaseNo=0;

function setup() {
  
  let begin = createButton("  START  ");
  
  begin.mousePressed(() => {
    
    begin.hide();
    releaseNo=1;
    setup2();
    
  });}

function setup2() {
  const lightBlue = color("#bde0fe");
  const darkBlue = color("#0081a7");
  const green = color("#bee1e6");
  const orange = color(254, 200, 154);
  const purple = color("#d5c6e0");
  curColor = lightBlue;

  let I = createButton("  I  ");
  I.position(10, 450);
  I.mousePressed(() => {
    bassNote = 1;
    curColor = lightBlue;
    setMatrix();
  });
  let II = createButton("  II  ");
  II.position(30, 450);
  II.mousePressed(() => {
    bassNote = 2;
    curColor = darkBlue;
    setMatrix();
  });

  let IV = createButton("  IV  ");
  IV.position(60, 450);
  IV.mousePressed(() => {
    bassNote = 4;
    curColor = purple;
    setMatrix();
  });
  let V = createButton("  V  ");
  V.position(90, 450);
  V.mousePressed(() => {
    bassNote = 5;
    curColor = orange;
    setMatrix();
  });
  let VI = createButton("  VI  ");
  VI.position(120, 450);
  VI.mousePressed(() => {
    bassNote = 6;
    curColor = green;
    setMatrix();
  });
  let gridToggle = createButton("Grid on OFF");
  gridToggle.position(550, 450);
  gridToggle.mousePressed(() => {
    gridOn = !gridOn;
    console.log(gridOn);
    setMatrix();
  });

  //synth
  mySynth = new Tone.MonoSynth();

  mySynth.set({
    voice: Tone.MonoSynth,

    oscillator: {
      type: "sawtooth", //
    },

    envelope: {
      attack: 0.0098,
      decay: 60,
      sustain: 0.9,
      release: 4,
    },

    filter: {
      Q: 3,
      //frequency : 10,
      type: "lowpass",
      rolloff: -12,
    },

    filterEnvelope: {
      attack: 0.0098,
      decay: 0.8,
      sustain: 0.8,
      release: 3,
      baseFrequency: 100,
      octaves: 1,
      exponent: 2,
    },
  });

  bassSynth = new Tone.MonoSynth().toMaster();

  bassSynth.set({
    voice: Tone.MonoSynth,

    oscillator: {
      type: "sawtooth", //
    },

    envelope: {
      attack: 0.0098,
      decay: 10,
      sustain: 0.1,
      release: 2.49,
    },

    filter: {
      Q: 3,
      //frequency : 10,
      type: "lowpass",
      rolloff: -12,
    },

    filterEnvelope: {
      attack: 0.0098,
      decay: 0.8,
      sustain: 0.9,
      release: 2,
      baseFrequency: 100,
      octaves: 1,
      exponent: 2,
    },
  });

  let gainLead = new Tone.Gain(0.85).toMaster();

  const postFilter = new Tone.Filter(2200, "lowpass").connect(gainLead);
  let drive = new Tone.Distortion(0.3).connect(postFilter);
  mySynth.connect(drive);

  createCanvas(600, 400);
  setMatrix();

  strokeWeight(2);

  loopBeat = new Tone.Loop(song, "4n");
  //loopBeat= new Tone.Loop(visuals, '4n');
  Tone.Transport.bpm.value = bpm;
  Tone.Transport.start();
  loopBeat.start(0);

  flutterAndWow(9, 6, 1.6, 20);
}

function draw() {
  xPos=(xPos+1)%600+1;
}

function flutterAndWow(flutFreq, flutRange, wowFreq, wowRange) {
  let flutter = new Tone.LFO(flutFreq, -flutRange, flutRange);

  let wow = new Tone.LFO(wowFreq, -wowRange, wowRange);
  //changing lfo setting
  flutter.connect(mySynth.detune);
  wow.connect(mySynth.detune);
  flutter.start();
  wow.start();
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    x = [];
    y = [];
    stepArray = [];
    tranPoints = [];
    j = 0;
    bj = 0;
    counter = 0;
    noteTriggered = 0;

    mouseoff = false;

    rightMostX = mouseX;
    bcounter = 0;
    drawer = 0;
    loopCounter = 1;

    //mySynth.triggerAttack("A4");
    setMatrix();
  }
}

function mouseReleased() {
  
  if (releaseNo>=1){
    if (mouseX > 0 && mouseY > 0 && mouseY < height) {
      step = Math.round(x.length * 0.1);
      //console.log("step", step);
      //console.log(x[index]);
      mouseoff = true;
      console.log("firstcell is", firstCell());
      console.log("lastcell is", lastCell());
      findTranPoints();
      console.log(tranPoints);
      songCounter = firstCell();
      newLine = true;
    }
  }
  releaseNo+=1;
}

function mouseDragged() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    stroke(0);
    if (mouseX >= rightMostX && pmouseX >= rightMostX) {
      line(pmouseX, pmouseY, mouseX, mouseY);
      rightMostX = mouseX;
      x.push(mouseX);
      y.push(mouseY);
      if (mouseX % 75 === 0) {
        stepArray.push(mouseX);
      }
    }
  }
}

function redLine() {
  strokeWeight(3);
  stroke(175, 154, 250);

  while (x[j] < x[tranPoints[counter + 1]]) {
    line(x[j + 1], y[j + 1], x[j], y[j]);
    j++;
  }
}
function blackLine() {
  strokeWeight(3);
  stroke(0);

  if (counter === 1) {
    bcounter = 0;
    bj = 0;
  }
  while (x[bj] < x[tranPoints[bcounter + 1]]) {
    line(x[bj + 1], y[bj + 1], x[bj], y[bj]);
    bj++;
  }
}

function setMatrix() {
  background(curColor);
  if (gridOn === true) {
    push();
    stroke(120);
    strokeWeight(1);

    for (let i = 0; i <= 8; i++) {
      line((i * width) / 8, 0, (i * width) / 8, height);
    }
    for (let i = 0; i <= 12; i++) {
      line(0, (i * height) / 12, width, (i * height) / 12);
    }
    pop();
  }
}

function song(time) {
  //counter=counter%(stepArray.length-1)
  if (mouseoff === true) {
    if (songCounter == firstCell()) {
      bassSynth.triggerAttackRelease(playRoot(bassNote), "6");
    }
  }
  if (mouseoff === true) {
    if (songCounter >= firstCell() && songCounter <= lastCell()) {
      //if(cellToPitch(noteTriggered + 1)!==cellToPitch(noteTriggered )){
      mySynth.triggerAttackRelease(cellToPitch(noteTriggered + 1), "6n", time);
      //}

      noteTriggered = noteTriggered + 1;
      if (songCounter === lastCell()) {
        noteTriggered = 0;
      }
    }

    blackLine();
    redLine();

    counter = (counter + 1) % 8;
    if (newLine === false) {
      bcounter = (bcounter + 1) % 8;
    }
    songCounter = (songCounter + 1) % 8;
    //j++;
    if (counter % 8 === 0) {
      j = 0;
      loopCounter++;
      console.log(loopCounter);
    }
  }
  newLine = false;
}

function firstCell() {
  if (x.length !== 0) {
    //console.log(x[0]);

    let index = 1;
    while (index * 75 < x[0]) {
      index++;
    }
    return index - 1;
  } else {
    return "not yet";
  }
}

function lastCell() {
  if (x.length !== 0) {
    //  console.log(x[x.length - 1]);

    let index = 1;
    while (index * 75 < x[x.length - 1]) {
      index++;
    }
    return index - 1;
  } else {
    return "not yet";
  }
}

function findTranPoints() {
  for (let i = 1; i < 9; i++) {
    for (let j = 0; j < x.length; j++) {
      if (x[j + 1] > i * 75 && x[j] <= i * 75) {
        if (x[j] === i * 75) {
          tranPoints.push(j);
        } else {
          tranPoints.push(j + 1);
        }
      }
    }
  }
  tranPoints.unshift(0);
  tranPoints.push(x.length - 1);
}

function cellToPitch(beat) {
  let cellHeight = 1;
  let cellNumber = 0;
  let index1 = 1;

  while (cellHeight <= y[tranPoints[beat]]) {
    cellHeight = cellHeight + height / 12;
    cellNumber++;
    index1++;
  }
  // cellHeight= Math.floor(cellHeight/ (height/12));
  //console.log('cellheightis',cellHeight);

  if (cellNumber === 12) {
    return "C4";
  }
  if (cellNumber === 11) {
    return "D4";
  }
  if (cellNumber === 10) {
    return "E4";
  }
  if (cellNumber === 9) {
    return "G4";
  }
  if (cellNumber === 8) {
    return "A4";
  }
  if (cellNumber === 7) {
    return "B4";
  }
  if (cellNumber === 6) {
    return "C5";
  }
  if (cellNumber === 5) {
    return "D5";
  }
  if (cellNumber === 4) {
    return "E5";
  }
  if (cellNumber === 3) {
    return "G5";
  }
  if (cellNumber === 2) {
    return "A5";
  }
  if (cellNumber === 1) {
    console.log("yo");
    return "B5";
  }
}

function playRoot(roman) {
  if (roman == 1) {
    return "C3";
  }
  if (roman == 2) {
    return "D3";
  }
  if (roman == 4) {
    return "F3";
  }
  if (roman == 5) {
    return "G3";
  }
  if (roman == 6) {
    return "A3";
  }
}


function doGradient(){
  
    timeLeft= (width-initialX)/rectVel;
    console.log(timeLeft);
  
   for ( let i=start;i<start+150;i++){
    n=map(i,start,start+150,0,1);
    let lineColor=lerpColor(leftColor,rightColor,n);
    stroke(lineColor);
    line(i,0,i,height);
  }
  let gradVel=width/timeLeft;
  
  
   if(start>=width){
      background(leftColor);}
    else {
      start+=width/timeLeft;}
  
}
