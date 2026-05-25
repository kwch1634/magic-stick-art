let h = 0;
let kiraAudio;

function preload() {
    bakemonoImg = loadImage("Imgaes/sugoi_bakemono.png");
    fukidashiImg = loadImage("Imgaes/e1139_1.png");
    kiraAudio = loadSound("Sound/Onoma-Sparkle02-1(Low-Short).mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    console.log("まほうのステッキ、きどう！");
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100 ,100)
    background(352, 53, 86, 100);

    // 右クリックしたときにブラウザのメニューが出るのを禁止する命令
    forbidRightClick();

    function forbidRightClick() {
        document.oncontextmenu = function() {
            return false;
        }
    }
    kiraAudio.setVolume(0.3);

}

function draw() {
    let cx = width / 2;
    let cy = height / 2;

    background(352, 53, 86, 0.5);

    noFill();
    stroke(0, 0, 100, 20);
    strokeWeight(4)
    circle(cx, cy, 700)
    circle(cx, cy, 500)
    circle(cx, cy, 500 / 2)
    triangle(cx - (125 * sqrt(3)), cy + 125, cx, cy - 250, cx + (125 * sqrt(3)), cy + 125)
    triangle(cx - (125 * sqrt(3)), cy - 125, cx, cy + 250, cx + (125 * sqrt(3)), cy - 125)
    
    for (let a = 0; a < 360; a += 20){
        let x1 = cx + 350 * cos(a);
        let y1 = cy + 350 * sin(a);

        let x2 = cx + 250 * cos(a - 10);
        let y2 = cy + 250 * sin(a - 10);

        let x3 = cx + 250 * cos(a + 10);
        let y3 = cy + 250 * sin(a + 10);

        triangle(x1, y1, x2, y2, x3, y3);
    }

    if (mouseIsPressed){
        if (mouseButton === LEFT){
            strokeWeight(25);
            stroke(h, 100, 100, 60);

            if (kiraAudio.isPlaying() === false){
                kiraAudio.loop();
            }
        }
        if (mouseButton === RIGHT){
            strokeWeight(35);
            stroke(352, 53, 86, 100);
        }
    }
    else{
        stroke(0, 0, 100, 0);
        kiraAudio.stop();
    }

    h = h + 5;

    if (h > 360){
        h = 0;
    }

    
    line(pmouseX, pmouseY, mouseX, mouseY);

    let imgW = 200;
    let imgH = 240;

    image(bakemonoImg, width - imgW - 20, height - imgH - 20, imgW, imgH);

    let FimgW = 512 / 2;
    let FimgH = 209 / 2;

    image(fukidashiImg, width - FimgW - 100, height - FimgH - 250, FimgW, FimgH);

    textSize(25);
    noStroke();
    fill(360, 100, 0, 100);
    text("自由に書いてね！", width - FimgW - 70, height - FimgH - 190);
    

    //console.log(`x:${mouseX}, :${mouseY}`);
    //ellipse(mouseX, mouseY, 50, 50);
}

function keyPressed(){
    if (key === `Escape`){
        background(352, 53, 86, 100);
    }
}