let correctA = 0; // 答對題數
let wrongA = 0; // 答錯題數
let questions = []; // 儲存題目資料
let currentQuestionIndex = 0; // 當前題目索引
let radio; // radio 元件
let input; // 填空題輸入框
let resultMessage = ""; // 顯示結果的訊息
let button; // 按鈕

function preload() {
  // 載入 CSV 檔案
  questions = loadTable("questions.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 建立畫布
  background("#170033"); // 背景顏色
  rectMode(CENTER); // 方框模式

  // 建立 radio 元件
  radio = createRadio();
  radio.style('width', '200px');

  // 建立填空題輸入框
  input = createInput();
  input.style('width', '200px');
  input.hide(); // 預設隱藏，僅在填空題時顯示

  // 建立按鈕
  button = createButton("確認作答");
  button.mousePressed(checkAnswer);

  // 動態調整元件位置
  updatePositions();
  loadQuestion(); // 載入第一題
}

function draw() {
  background("#170033"); // 背景顏色

  // 繪製方框
  fill("#7D56AD"); // 方框顏色
  rect(width / 2, height / 2, width / 2, height / 2); // 方框位置與大小

  // 顯示題目
  fill("#FFFFFF"); // 題目文字顏色
  textAlign(CENTER, CENTER);
  textSize(24);
  text(getCurrentQuestion().question, width / 2, height / 2 - 80); // 顯示題目在方框內

  // 顯示結果訊息
  fill("#FFD700"); // 結果文字顏色
  textSize(20);
  text(resultMessage, width / 2, height / 2 + 100); // 顯示結果訊息在方框內

  // 顯示答對題數和答錯題數
  fill("#FFFFFF"); // 白色文字
  textAlign(LEFT, TOP);
  textSize(16);
  text(`答對題數: ${correctA}`, 10, 10);
  text(`答錯題數: ${wrongA}`, 10, 30);
}

function checkAnswer() {
  let questionData = getCurrentQuestion();
  let correctOption = questionData.correct; // 正確答案
  let selected;

  if (questionData.type === "choice") {
    // 選擇題
    selected = radio.value();
  } else if (questionData.type === "fill") {
    // 填空題
    selected = input.value().trim();
  }

  if (selected === correctOption) {
    resultMessage = "答對了！";
    correctA++;
  } else {
    resultMessage = "答錯了！";
    wrongA++;
  }

  // 載入下一題或結束
  if (currentQuestionIndex < questions.getRowCount() - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    resultMessage += " 測驗結束！";
    button.html("再來一次"); // 修改按鈕文字
    button.mousePressed(restartQuiz); // 設定按鈕功能為重新開始
    noLoop(); // 停止 draw
  }
}

function restartQuiz() {
  // 重置測驗
  correctA = 0;
  wrongA = 0;
  currentQuestionIndex = 0;
  resultMessage = "";
  button.html("確認作答"); // 恢復按鈕文字
  button.mousePressed(checkAnswer); // 恢復按鈕功能
  loadQuestion(); // 載入第一題
  loop(); // 恢復 draw
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 調整畫布大小
  updatePositions(); // 更新元件位置
}

function updatePositions() {
  // 動態調整 radio、輸入框和按鈕的位置
  radio.position(width / 2 - 50, height / 2 - 30);
  input.position(width / 2 - 100, height / 2 - 30);
  button.position(width / 2 - 50, height / 2 + 50);
}

function loadQuestion() {
  // 載入當前題目
  let questionData = getCurrentQuestion();

  if (questionData.type === "choice") {
    // 顯示選擇題
    radio.show();
    input.hide();
    radio.html(""); // 清空選項
    radio.option(questionData.option1);
    radio.option(questionData.option2);
    radio.option(questionData.option3);
    radio.option(questionData.option4);
  } else if (questionData.type === "fill") {
    // 顯示填空題
    radio.hide();
    input.show();
    input.value(""); // 清空輸入框
  }
}

function getCurrentQuestion() {
  // 取得當前題目資料
  let row = questions.getRow(currentQuestionIndex);
  return {
    question: row.get("question"),
    option1: row.get("option1"),
    option2: row.get("option2"),
    option3: row.get("option3"),
    option4: row.get("option4"),
    correct: row.get("correct"),
    type: row.get("type"), // 題目類型 (choice 或 fill)
  };
}