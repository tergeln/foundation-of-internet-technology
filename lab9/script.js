// =========================================================
// Lab 9 - Hangman тоглоом
// =========================================================

// 1. Асуулт, хариултыг массивт хадгална
const questions = [
    { question: "Монгол Улсын нийслэл хот аль вэ?",               answer: "УЛААНБААТАР" },
    { question: "Монголын хамгийн гүн нуур аль вэ?",               answer: "ХӨВСГӨЛ" },
    { question: "Монголчуудын жил бүрийн зун тэмдэглэдэг баяр?",   answer: "НААДАМ" },
    { question: "\"Цөлийн хөлөг\" гэж нэрлэгддэг мал аль вэ?",     answer: "ТЭМЭЭ" },
    { question: "Нарны аймгийн хамгийн том гариг аль вэ?",         answer: "БАРХАСБАДЬ" },
    { question: "Бидний амьдардаг гаригийн нэр юу вэ?",            answer: "ДЭЛХИЙ" },
    { question: "Хүний биеийн хамгийн том эрхтэн юу вэ?",          answer: "АРЬС" },
    { question: "Ус хөлдөхөд юу болдог вэ?",                       answer: "МӨС" },
    { question: "Компьютерийн \"тархи\" гэж аль хэсгийг нэрлэдэг вэ?", answer: "ПРОЦЕССОР" },
    { question: "Монгол үндэстний уламжлалт орон сууц юу вэ?",      answer: "ГЭР" }
];

// Монгол кирилл цагаан толгой (35 үсэг)
const ALPHABET = "АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЩЪЫЬЭЮЯ".split("");
const MAX_LIVES = 5;

// 2. HTML элементүүд
const questionEl = document.getElementById("question");
const wordEl     = document.getElementById("word");
const messageEl  = document.getElementById("message");
const keyboardEl = document.getElementById("keyboard");
const livesEl    = document.getElementById("lives-count");
const heartsEl   = document.getElementById("hearts");
const parts      = document.querySelectorAll(".figure .part");
const resultEl   = document.getElementById("result");
const resultTitle  = document.getElementById("result-title");
const resultAnswer = document.getElementById("result-answer");

// 3. Тоглоомын төлөв
let answer = "";
let guessed = [];      // сонгосон бүх үсэг
let lives = MAX_LIVES;
let gameOver = false;
let lastIndex = -1;    // ижил асуулт дараалан гарахгүй байх

// Тоглоом эхлүүлэх
function startGame() {
    // Санамсаргүй асуулт сонгоно
    let index;
    do {
        index = Math.floor(Math.random() * questions.length);
    } while (index === lastIndex && questions.length > 1);
    lastIndex = index;

    answer = questions[index].answer;
    questionEl.textContent = questions[index].question;

    guessed = [];
    lives = MAX_LIVES;
    gameOver = false;

    parts.forEach(part => part.classList.remove("show"));
    resultEl.classList.add("hidden");
    showMessage("Үсгээ сонгоно уу.", "");

    buildKeyboard();
    renderWord();
    renderLives();
}

// Үсгийн товчнуудыг үүсгэх
function buildKeyboard() {
    keyboardEl.innerHTML = "";
    ALPHABET.forEach(letter => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "key";
        button.textContent = letter;
        button.dataset.letter = letter;
        button.addEventListener("click", () => guess(letter));
        keyboardEl.appendChild(button);
    });
}

// Үгийг харуулах: таагдаагүй үсэг бүрийн оронд "_"
function renderWord() {
    wordEl.innerHTML = "";
    answer.split("").forEach(letter => {
        const box = document.createElement("span");
        box.className = "letter";
        if (guessed.includes(letter)) {
            box.textContent = letter;
            box.classList.add("open");
        } else {
            box.textContent = "_";
        }
        wordEl.appendChild(box);
    });
}

// Амийг тоогоор болон зүрхээр харуулах
function renderLives() {
    livesEl.textContent = lives;
    heartsEl.textContent = "♥".repeat(lives) + "♡".repeat(MAX_LIVES - lives);
}

function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = "message " + type;
}

// 4. Үсэг сонгох
function guess(letter) {
    if (gameOver) return;

    // Өмнө сонгосон үсэг: амь хасахгүй
    if (guessed.includes(letter)) {
        showMessage("\"" + letter + "\" үсгийг өмнө сонгосон байна.", "info");
        return;
    }

    guessed.push(letter);
    const key = keyboardEl.querySelector('[data-letter="' + letter + '"]');

    if (answer.includes(letter)) {
        // Зөв: тухайн үсгийн бүх байрлалыг нээнэ
        const count = answer.split("").filter(l => l === letter).length;
        showMessage("Баяр хүргэе! \"" + letter + "\" үсэг " + count + " удаа орсон байна.", "good");
        if (key) key.classList.add("right");
        renderWord();
    } else {
        // Буруу: нэг амь хасаж, дүрсний нэг хэсгийг зурна
        lives--;
        parts[MAX_LIVES - lives - 1].classList.add("show");
        showMessage("\"" + letter + "\" үсэг байхгүй. Нэг амь хасагдлаа.", "bad");
        if (key) key.classList.add("wrong");
        renderLives();
    }
    if (key) key.disabled = true;

    checkEnd();
}

// 5. Хожсон эсвэл хожигдсон эсэхийг шалгах
function checkEnd() {
    const allFound = answer.split("").every(letter => guessed.includes(letter));

    if (allFound) {
        endGame(true);
    } else if (lives === 0) {
        endGame(false);
    }
}

function endGame(won) {
    gameOver = true;
    keyboardEl.querySelectorAll(".key").forEach(key => key.disabled = true);

    // Хожигдсон бол бүх үсгийг харуулна
    if (!won) {
        guessed = answer.split("");
        renderWord();
    }

    resultTitle.textContent = won ? "Та хожлоо!" : "Та хожигдлоо!";
    resultTitle.className = won ? "win" : "lose";
    resultAnswer.textContent = answer;
    showMessage(won ? "Та хожлоо!" : "Та хожигдлоо!", won ? "good" : "bad");

    setTimeout(() => resultEl.classList.remove("hidden"), 400);
}

// 6. Гарын товчлуураар бас тоглох боломжтой
document.addEventListener("keydown", event => {
    const letter = event.key.toUpperCase();
    if (ALPHABET.includes(letter)) {
        guess(letter);
    }
});

document.getElementById("restart").addEventListener("click", startGame);
document.getElementById("play-again").addEventListener("click", startGame);

startGame();
