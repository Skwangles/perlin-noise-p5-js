var hist;
let slider;
let button;
var cols;
var rows;
var scl = 20;

var currentVisualisation = 0;
var isDrawGrid = false;
var isWave = false;
var isWorm = false;
var isCircleNoise = false;
var is2DNoise = false;

function setup() {
  // put setup code here
  hist = [];
  createCanvas(400, 400);

  text = createP("Drag Slider to increase noise detail/speed");
  text.position(500, 20);
  slider = createSlider(0.001, 0.9, 0.05, 0.01);
  slider.position(500, 10);
  slider.size(100);

  checkbox = createCheckbox("Draw Grid (Hidden by '2D Noise')", false);
  checkbox.position(500, 55);
  checkbox.changed(() => {
    isDrawGrid = !isDrawGrid;
  });
  checkbox2 = createCheckbox("Wave", false);
  checkbox2.position(500, 75);
  checkbox2.changed(() => {
    isWave = !isWave;
  });
  checkbox3 = createCheckbox("Worm", false);
  checkbox3.position(500, 95);
  checkbox3.changed(() => {
    isWorm = !isWorm;
  });
  checkbox4 = createCheckbox("Circle Noise", false);
  checkbox4.position(500, 115);
  checkbox4.changed(() => {
    isCircleNoise = !isCircleNoise;
  });
  checkbox5 = createCheckbox("2D Noise", false);
  checkbox5.position(500, 135);
  checkbox5.changed(() => {
    is2DNoise = !is2DNoise;
  });

  // Default selection
  checkbox5.checked(true);
  is2DNoise = true;

  cols = floor(width / scl);
  rows = floor(height / scl);
}

var speed = 0.01;
var offset = 0.005;
var start = 0;

function draw() {
  frameRate(10);
  offset = slider.value();
  background(30);
  fill(255);

  if (isDrawGrid) {
    drawGrid(offset);
  }
  if (is2DNoise) {
    twoDNoise(offset);
  }
  if (isWave) {
    wave(offset, start);
    start += offset;
  }
  if (isWorm) {
    worm(offset);
  }
  if (isCircleNoise) {
    circleNoise(offset);
  }
}

var grid_offset = 0;
function drawGrid(offset) {
  let yoff = 0 + grid_offset;
  for (var y = 0; y < rows; y++) {
    let xoff = 0 + grid_offset;
    for (var x = 0; x < cols; x++) {
      let r = noise(xoff, yoff) * 255;
      xoff += offset;
      fill(r);
      rect(x * scl, y * scl, scl, scl);
    }
    yoff += offset;
  }
  grid_offset += offset;
}

// 1D noise line going in X direction
function wave(offset, inlineOffset) {
  beginShape();
  noFill();
  stroke(255);
  for (var x = 0; x < width; x++) {
    var y = noise(inlineOffset) * height;
    vertex(x, y);
    inlineOffset += offset;
  }
  endShape();
  inlineOffset += offset;
}

// 1D noise line going in X and Y directions
var x_off = 0.0;
var y_off = 1000.0;
function worm(offset) {
  var x = noise(x_off) * width;
  var y = noise(y_off) * height;
  x_off += offset;
  y_off += offset;

  ellipse(x, y, 5, 5);

  stroke(250);
  hist.push({ x: x, y: y });

  for (var i = 1; i < hist.length; i++) {
    var pos = hist[i];
    var prev = hist[i - 1];
    line(prev.x, prev.y, pos.x, pos.y);
  }

  if (hist.length > 100) {
    hist.splice(0, 1);
  }
}

var angle_off = 0.0;
var phase = 0.0;
function circleNoise(offset) {
  translate(width / 2, height / 2);
  stroke(255);
  noFill();
  beginShape();
  for (let a = 0; a < 2 * PI; a += 0.01) {
    let xoff = map(cos(a + phase), -1, 1, 0, 1);
    let yoff = map(sin(a + phase), -1, 1, 0, 1);
    let r = noise(xoff, yoff, angle_off) * 100;
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);
  angle_off += offset;
  phase += 0.01;
  console.log(angle_off);
}

// 2D noise field
var x_important = 0.005;
var y_important = 0.005;
var inc = 0.04;
function twoDNoise(offset) {
  loadPixels();
  let d = pixelDensity();
  let width_val = width * d;
  let height_val = height * d;
  for (let y = 0; y < height_val; y++) {
    for (let x = 0; x < width_val; x++) {
      let index = (x + y * width_val) * 4;
      let val = noise(x * x_important, y * y_important, inc) * 255;
      pixels[index] = val;
      pixels[index + 1] = val;
      pixels[index + 2] = val;
      pixels[index + 3] = 255;
    }
  }
  inc += offset;
  updatePixels();
}
