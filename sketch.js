let h = 0;
let kiraAudio;
let bakemonoImg, fukidashiImg;

// 🌟 マイクロビットから届くデータを保存する箱
let mRoll = 0;
let mPitch = 0;
let mButtonA = 0; // 0なら離してる、1なら押してる

let stickX, stickY;

// 🌟【最重要】エラーで固まるのを防ぐため、お助けクラスをプログラムの最上部（一番安全な場所）に引っ越しました
class LineBreakTransformer {
    constructor() { this.container = ''; }
    transform(chunk, controller) {
        this.container += chunk;
        const lines = this.container.split('\n');
        this.container = lines.pop();
        lines.forEach(line => controller.enqueue(line));
    }
    flush(controller) { if (this.container) controller.enqueue(this.container); }
}

function preload() {
    bakemonoImg = loadImage("Imgaes/sugoi_bakemono.png");
    fukidashiImg = loadImage("Imgaes/e1139_1.png");
    kiraAudio = loadSound("Sound/Onoma-Sparkle02-1(Low-Short).mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    console.log("まほうのステッキ、きどう！");
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100 ,100);
    background(352, 53, 86, 100);

    // 最初は画面の真ん中からスタート
    stickX = width / 2;
    stickY = height / 2;

    let connectBtn = createButton("ステッキ接続");
    connectBtn.position(10, 10);
    connectBtn.style("font-size", "16px");
    connectBtn.style("padding", "10px");

    connectBtn.mousePressed(async () => {
        try {
            // ブラウザ標準の機能でマイクロビットと接続する
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
            
            // 🌟【ここがフリーズを解く魔法！】
            // 接続したあと、ブラウザの準備が完全に整うまで「2秒間」何もしないでじっと待つ！
            console.log("接続完了！ブラウザの準備を待っています...");
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("準備OK！データの読み込みを開始します。");
            
            // データを受け取るループ処理を開始
            readSerialLoop(port);
        } catch (err) {
            console.error("接続に失敗したよ: ", err);
        }
    });

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

    // 残像を残すために少しだけ背景を重ねる
    background(352, 53, 86, 0.5);

    // 魔法陣の描画
    noFill();
    stroke(0, 0, 100, 20);
    strokeWeight(4);
    circle(cx, cy, 700);
    circle(cx, cy, 500);
    circle(cx, cy, 500 / 2);
    triangle(cx - (125 * sqrt(3)), cy + 125, cx, cy - 250, cx + (125 * sqrt(3)), cy + 125);
    triangle(cx - (125 * sqrt(3)), cy - 125, cx, cy + 250, cx + (125 * sqrt(3)), cy - 125);
    
    for (let a = 0; a < 360; a += 20){
        let x1 = cx + 350 * cos(a);
        let y1 = cy + 350 * sin(a);

        let x2 = cx + 250 * cos(a - 10);
        let y2 = cy + 250 * sin(a - 10);

        let x3 = cx + 250 * cos(a + 10);
        let y3 = cy + 250 * sin(a + 10);

        triangle(x1, y1, x2, y2, x3, y3);
    }

    // 1コマ前の位置を記憶
    let prevStickX = stickX;
    let prevStickY = stickY;
    
    // 🌟 マイクロビットの傾き（-90度〜90度）を、画面のサイズに変換してワープさせる
    stickX = map(mRoll, -90, 90, 0, width);
    stickY = map(mPitch, -90, 90, 0, height);
    
    // 画面外に飛び出さないように画面サイズ内に制限
    stickX = constrain(stickX, 0, width);
    stickY = constrain(stickY, 0, height);

    // 🌟 Aボタンが押されているか(1か)で判断！
    if (mButtonA === 1){
        strokeWeight(25);
        stroke(h, 100, 100, 60);

        if (kiraAudio.isPlaying() === false){
            kiraAudio.loop();
        }

        // ステッキの座標で線を引く！
        line(prevStickX, prevStickY, stickX, stickY);
    }
    else{
        // ボタンを離したら音を止める
        stroke(0, 0, 100, 0);
        kiraAudio.stop();
    }

    // PCテスト用：マウスの右クリック消しゴム
    if (mouseIsPressed && mouseButton === RIGHT){
        strokeWeight(35);
        stroke(352, 53, 86, 100);
        line(pmouseX, pmouseY, mouseX, mouseY);
    }

    h = h + 5;
    if (h > 360){ h = 0; }

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

    // 👇 画面の左上に、マイクロビットから今届いている生データを表示する（デバッグ用）
    textSize(20);
    fill(0, 0, 0, 100); // 黒文字
    text("届いてる左右(Roll): " + int(mRoll), 20, 80);
    text("届いてる前後(Pitch): " + int(mPitch), 20, 110);
    text("ボタンAの状態: " + mButtonA, 20, 140);
    text("ペンの位置: X=" + int(stickX) + ", Y=" + int(stickY), 20, 170);
} 

// 🌟 マイクロビットから届くデータを自動解読するループ関数（絶対に固まらない高速版）
async function readSerialLoop(port) {
    const lineReader = port.readable
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new TransformStream(new LineBreakTransformer()))
        .getReader();

    try {
        while (true) {
            const { value, done } = await lineReader.read();
            if (done) break;
            
            if (value) {
                // 🌟処理を軽くするため、JavaScript標準の「.split()」と「.trim()」で超高速分解します
                let cleaned = value.trim();
                let list = cleaned.split(',');
                
                if (list.length === 3) {
                    mRoll = parseFloat(list[0].trim()) || 0;     // 左右の傾き
                    mPitch = parseFloat(list[1].trim()) || 0;    // 前後の傾き
                    
                    let btnRaw = list[2].trim();
                    if (btnRaw === '1' || btnRaw === 'true') {
                        mButtonA = 1;
                    } else {
                        mButtonA = 0;
                    }
                }
            }
        }
    } catch (error) {
        console.error("データ読み込みエラー: ", error);
    } finally {
        lineReader.releaseLock();
    }
}

function keyPressed(){
    if (key === `Escape`){
        background(352, 53, 86, 100);
    }
}