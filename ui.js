const UI_MARGIN = 20;
const UI_WIDTH = 260;
const UI_HEIGHT = 380;
const TEXT_SIZE = 18;
const EDGE_SIZE = 20;
const OFFSET_SPEED = 4;

let star_selector = 0;
let RTF_slider;

function drawUI() {
    let slected_star = generateStar(types_name[star_selector]);
    drawPause();
    fill(200, 200, 200, 50);
    rect(UI_MARGIN, UI_MARGIN, UI_WIDTH, UI_HEIGHT, 20);

    textFont("Courier New");
    textSize(TEXT_SIZE);
    fill(255);
    text("Select a star:", 2 * UI_MARGIN, 2.5 * UI_MARGIN);

    text(
        `Mass: ${formatNumber(slected_star.mass)} Kg`,
        2 * UI_MARGIN,
        3.5 * UI_MARGIN + TEXT_SIZE + m2p(RADIUS_SUN) * 15
    );
    text(
        `Radius: ${formatNumber(slected_star.radius)} m`,
        2 * UI_MARGIN,
        3.5 * UI_MARGIN + TEXT_SIZE * 2 + m2p(RADIUS_SUN) * 15
    );
    text(
        `Temp: ${formatNumber(slected_star.temperature)} K`,
        2 * UI_MARGIN,
        3.5 * UI_MARGIN + TEXT_SIZE * 3 + m2p(RADIUS_SUN) * 15
    );
    text(
        `Abondance: ${formatNumber(slected_star.prob)} %`,
        2 * UI_MARGIN,
        3.5 * UI_MARGIN + TEXT_SIZE * 4 + m2p(RADIUS_SUN) * 15
    );
    text(
        `Type: ${slected_star.type}`,
        2 * UI_MARGIN,
        3.5 * UI_MARGIN + TEXT_SIZE * 5 + m2p(RADIUS_SUN) * 15
    );
    text(
        `Speed: ${formatNumber(RTF)}x`,
        2 * UI_MARGIN,
        5.5 * UI_MARGIN + TEXT_SIZE * 5 + m2p(RADIUS_SUN) * 15
    );

    draw_star_ui(slected_star);
}

function formatNumber(num) {
    return num >= 1 && num <= 100
        ? num
        : float(num.toPrecision(4)).toExponential();
}

function drawPause() {
    if (isPaused) {
        fill(200, 200, 200);
        rect(
            windowWidth - UI_MARGIN * 1.5 - 8,
            UI_MARGIN,
            UI_MARGIN,
            UI_MARGIN + 40,
            20
        );
        rect(
            windowWidth - UI_MARGIN * 1.5 - 40,
            UI_MARGIN,
            UI_MARGIN,
            UI_MARGIN + 40,
            20
        );
    }
}

function draw_star_ui(stats) {
    rectMode(RADIUS);
    fill(0);
    rect(
        UI_MARGIN + UI_WIDTH / 2,
        2.5 * UI_MARGIN + TEXT_SIZE + (m2p(RADIUS_SUN) * 15) / 2,
        65,
        65,
        20
    );
    rectMode(CORNER);
    fill(stats.color);
    circle(
        UI_MARGIN + UI_WIDTH / 2,
        2.5 * UI_MARGIN + TEXT_SIZE + (m2p(RADIUS_SUN) * 15) / 2,
        m2p(stats.radius)
    );
    if (pressed) {
        drawArrow(initial_press, createVector(mouseX, mouseY));
    }
}

function drawArrow(base, vec) {
    push();
    stroke(255);
    strokeWeight(3);
    fill(255);
    line(base.x, base.y, vec.x, vec.y);
    pop();
    text(
        `${formatNumber(p2m(distance(base, vec)))} m/s`,
        vec.x + UI_MARGIN,
        vec.y + UI_MARGIN
    );
    /* translate(base.x, base.y);
    rotate(vec.heading());
    let arrowSize = 7;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);*/
}

function setup_slider() {
    RTF_slider = createSlider(-10, 10, 1);
    RTF_slider.position(
        UI_MARGIN * 2,
        6 * UI_MARGIN + TEXT_SIZE * 5 + m2p(RADIUS_SUN) * 15
    );
    RTF_slider.style("width", `${UI_WIDTH - 2 * UI_MARGIN}px`);
}

function decreaseSelector() {
    star_selector--;
    star_selector =
        ((star_selector % types_name.length) + types_name.length) %
        types_name.length;
}

function increaseSelector() {
    star_selector++;
    star_selector %= types_name.length;
}

function slider2RTF(value) {
    if (value > 0) {
        return value;
    }
    return Math.pow(10, (value - 1) * 0.1);
}

function mouse_is_over_ui() {
    return is_over(mouseX, mouseY, UI_MARGIN, UI_MARGIN, UI_WIDTH, UI_HEIGHT);
}

function mouse_is_over_star_selector() {
    return is_over(
        mouseX,
        mouseY,
        UI_MARGIN + UI_WIDTH / 4,
        UI_MARGIN + (1.5 * UI_MARGIN + TEXT_SIZE + (m2p(RADIUS_SUN) * 15) / 2)/2,
        65*2,
        65*2
    );
}

function is_over(x, y, xbox, ybox, wbox, hbox) {
    if (x > xbox && x < xbox + wbox && y > ybox && y < hbox + ybox) {
        return true;
    }
    return false;
}

function make_offset(){
    if (mouseX<EDGE_SIZE){
        offset.x += OFFSET_SPEED;
    }
    if (mouseX>windowWidth-EDGE_SIZE){
        offset.x -= OFFSET_SPEED;
    }
    if (mouseY<EDGE_SIZE){
        offset.y += OFFSET_SPEED;
    }
    if (mouseY>windowHeight-EDGE_SIZE){
        offset.y -= OFFSET_SPEED;
    }
}
