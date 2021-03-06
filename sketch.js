let objets = [];

const FPS = 144;
const DT = 1 / FPS;
const MASS_SUN = 1.989 * 10e30;
const RADIUS_SUN = 6.963 * 10e5;
const G = 6.67408 * 10e-11;

let isPaused = false;
let showUI = true;
let initial_press = { x: 0, y: 0 };
let pressed = false;
let RTF = 1;
let offset;
let delta_wheel = 0;

class Star {
    constructor(x, y, vx, vy, stats) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = 0;
        this.ay = 0;
        if (stats == undefined) {
            this.stats = generateStar(types_name[star_selector]);
        } else {
            this.stats = generateStar(stats.type);
        }
    }

    draw() {
        fill(this.stats.color);
        circle(m2p(this.x)+offset.x, m2p(this.y)+offset.y, m2p(this.stats.radius));
    }
}

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    offset = createVector(0,0);
    cnv.style("display", "block");
    background(0);
    frameRate(FPS);
    setup_slider();
}

function draw() {
    background(0);
    RTF = slider2RTF(RTF_slider.value());
    make_offset();
    for (let i = 0; i < objets.length; i++) {
        objets[i].draw();
    }
    if (!isPaused) {
        tick(DT * RTF);
    }
    if (showUI) {
        drawUI();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    if (mouse_is_over_star_selector() && showUI) {
        increaseSelector();
    }
    if (!(mouse_is_over_ui() && showUI)) {
        initial_press.x = mouseX;
        initial_press.y = mouseY;
        pressed = true;
    }
}

function mouseReleased() {
    if (!(mouse_is_over_ui() && showUI)) {
        objets.push(
            new Star(
                p2m(initial_press.x - offset.x),
                p2m(initial_press.y - offset.y),
                p2m(mouseX - initial_press.x),
                p2m(mouseY - initial_press.y)
            )
        );
        pressed = false;
    }
}

function keyPressed() {
    if (keyCode === 32) {
        // corresponds to spacebar
        isPaused = !isPaused;
    }
    if (key === "r") {
        objets = [];
        offset.x = 0;
        offset.y = 0;
    }
    if (key === "u") {
        showUI = !showUI;
        if (showUI) {
            RTF_slider.show();
        } else {
            RTF_slider.hide();
        }
    }
    if (keyCode === DOWN_ARROW) {
        decreaseSelector();
    }
    if (keyCode === UP_ARROW) {
        increaseSelector();
    }
    if (key === "s") {
        saveJSON(objets, "simulator-state.json");
    }
    if (key === "l") {
        loadJSON(objets);
    }
}

function mouseWheel(event) {
 delta_wheel += event.delta;
 if(delta_wheel>=100){
  increaseSelector();
  delta_wheel = 0;
 }
 if(delta_wheel<=-100){
  decreaseSelector();
  delta_wheel = 0;
 }
}

function tick(dt) {
    for (let i = 0; i < objets.length; i++) {
        //compute acceleration
        let { ax, ay } = compute_acceleration(objets[i], i);
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

function distance(A, B) {
    return Math.sqrt((A.x - B.x) * (A.x - B.x) + (A.y - B.y) * (A.y - B.y));
}

function compute_acceleration_i(A, B) {
    let dist = max(distance(A, B), A.stats.radius + B.stats.radius); // prevent infinite acceleration when overlap
    return {
        ax: (G * B.stats.mass * (B.x - A.x)) / Math.pow(dist, 3),
        ay: (G * B.stats.mass * (B.y - A.y)) / Math.pow(dist, 3),
    };
}

function compute_acceleration(star, index) {
    let result = { ax: 0, ay: 0 };
    for (let i = 0; i < objets.length; i++) {
        if (i != index) {
            let tmp = compute_acceleration_i(star, objets[i]);
            result.ax += tmp.ax;
            result.ay += tmp.ay;
        }
    }
    return result;
}

function m2p(num) {
    return (num * 10) / RADIUS_SUN;
}

function p2m(num) {
    return (num / 10) * RADIUS_SUN;
}
