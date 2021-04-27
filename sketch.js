let objets = [];
let reverse = false;
const RTF = 1;
const FPS = 144;
const DT = 1 / FPS;
const MASS_SUN = 1.989 * 10E30;
const RADIUS_SUN = 6.963 * 10E5;
const G = 6.67408 * 10E-11;
let isPaused = false;

let center;

// 1m = 1 pixel

class Star{
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ax = 0;
    this.ay = 0;
    this.stats = generateStar(sampleStar())
  }

  draw(){
    fill(this.stats.color);
    circle(m2p(this.x), m2p(this.y), m2p(this.stats.radius));
  }

}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  background(0);
  frameRate(FPS);
  center = {x: p2m(windowWidth/2), y: p2m(windowHeight/2)};
}

function draw() {
  background(0);
  fill(255);
  circle(m2p(center.x),m2p(center.y), 10)

  for (let i = 0; i < objets.length; i++){
    objets[i].draw();
  }
  if(!isPaused){
    tick(DT);
  }
}

function mouseClicked() {
  objets.push(new Star(p2m(mouseX), p2m(mouseY), random(-RADIUS_SUN*10,RADIUS_SUN*10), random(-RADIUS_SUN*10,RADIUS_SUN*10)));
}

function keyPressed() {
  if (keyCode === 32) { // corresponds to spacebar
    isPaused = !isPaused;
  }
  if (keyCode === 82) { // corresponds to r
    objets = [];
  }
}

function tick(dt){
  for (let i = 0; i < objets.length; i++){
    //compute acceleration
    let {ax,ay} = compute_acceleration(MASS_SUN * 10, objets[i], center);
    objets[i].ax = ax;
    objets[i].ay = ay;
    //update speed
    objets[i].vx += objets[i].ax * dt * RTF;
    objets[i].vy += objets[i].ay * dt * RTF;
    //update position
    objets[i].x += objets[i].vx * dt * RTF;
    objets[i].y += objets[i].vy * dt * RTF;
  }
}

function distance(A, B){
  return Math.sqrt((A.x-B.x)*(A.x-B.x)+(A.y-B.y)*(A.y-B.y))
}

function compute_acceleration(Ma, A, B){
  let dist = distance(A, B);
  return {
    ax: G * Ma * (B.x - A.x)/ Math.pow(dist, 3),
    ay: G * Ma * (B.y - A.y)/ Math.pow(dist, 3)
  }
}

function m2p(num){
  return num * 10 / RADIUS_SUN;
}

function p2m(num){
  return num / 10 * RADIUS_SUN;
}