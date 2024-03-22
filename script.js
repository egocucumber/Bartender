let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let level = document.getElementById("level");
let records = document.getElementById("records");
let score = document.getElementById("score");
let timer = document.getElementById("timer");
let start = document.getElementById("start");
let submitName = document.getElementById("submitName");
let userName = document.getElementById('userName');
let game = false; 
let gameOver = false;
let buttonPressed = false;
let isCheckCollisionsCalled = false;
let keys = new Map();
let difficulty = 2; 
let points = 0; 
let time = 0; 
let interval; 
let mugs = []; 
let drinkers = []; 
let recordTable = []; 
let mugSpeed = 5; 
let drinkerSpeed = 1.5; 
let mugWidth = 50; 
let mugHeight = 50; 
let drinkerWidth = 50; 
let drinkerHeight = 50; 
let barWidth = 100; 
let barHeight = 600; 
let counterWidth = 700; 
let counterHeight = 50; 
let counterX = 100; 
let counterY = 0; 
let barX = 0; 
let barY = 0;
let lastMugTime = [];
let mugDelay = [];
let mugImage = new Image(); 
let drinkerImage = new Image(); 
let barImage = new Image();
barImage.src = 'bar-background.png';
mugImage.src = "mug.png"; 
drinkerImage.src = "customer.png"; 
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close")[0];

// Функция для инициализации игры
function init() {
    loadRecords();
    start.addEventListener("click", startGame);
    level.addEventListener("change", changeLevel);
    records.addEventListener("click", showRecords);
    submitName.addEventListener("click", function() {
        user = userName.value;
        if (user) {
            start.disabled = false;
        } else {
            alert("Пожалуйста, введите ваше имя перед началом игры.");
        }
    });
    drawCanvas();
}

init();

// Функция для запуска игры
function startGame() {
    if (!user) {
        alert("Пожалуйста, введите ваше имя перед началом игры.");
        return;
    }
    if (game) {
        return;
    }
    recordTable.push({name: userName, points: points, time: time});
    canvas.classList.remove('hidden');
    score.classList.remove('hidden');
    timer.classList.remove('hidden');
    controls.classList.add('hidden');
    game = true;
    points = 0;
    time = 0;
    mugs = [];
    drinkers = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    difficulty = parseInt(level.value);
    startTimer();
    updateScore();
    requestAnimationFrame(gameLoop);
    for (let i = 0; i < difficulty; i++) {
        startDrinkerTimer(i + 1);
    }
    for (let i = 0; i < difficulty; i++) {
        lastMugTime[i] = 0;
        mugDelay[i] = Math.random() * 1000 + 500;
    }
}

// Функция для изменения уровня сложности
function changeLevel() {
    if (!game) {
        difficulty = parseInt(level.value);
    }
}

// Функция для обработки нажатия клавиши
window.addEventListener('keydown', function(event) {
    if (!keys.has(event.keyCode)) {
            keys.set(event.keyCode, true);
            let now = Date.now();
            if (now - lastMugTime < mugDelay) {
                return;
            }
            lastMugTime = now;
        switch (event.keyCode) {
            case 49: // Клавиша 1
                sendMug(1);
                break;
                case 50: // Клавиша 2
                sendMug(2);
                break;
            case 51: // Клавиша 3
            sendMug(3);
            break;
            case 52: // Клавиша 4
                sendMug(4);
                break;
            case 53: // Клавиша 5
                sendMug(5);
                break;
            case 54: // Клавиша 6
                sendMug(6);
                break;
            case 55: // Клавиша 7
                sendMug(7);
                break;
            case 56: // Клавиша 8
                sendMug(8);
                break;
        }
    }
});

window.addEventListener('keyup', function(event) {
    keys.delete(event.keyCode); 
});

// Функция для отрисовки холста с баром и стойкой
function drawCanvas() {
    let barPattern = ctx.createPattern(barImage, 'repeat');
    ctx.fillStyle = barPattern;
    ctx.fillRect(barX, barY, barWidth, barHeight);
    for (let i = 0; i < difficulty; i++) {
        ctx.fillRect(counterX, counterY + i * (counterHeight + 29), counterWidth, counterHeight);
    }
}

// Функция для создания случайного количества жаждущих на разных стойках
function createDrinkers(counter) {
    let num = Math.floor(Math.random()) + 1;
    for (let j = 0; j < num; j++) {
        let drinker = {
            x: counterX + counterWidth - drinkerWidth,
            y: counterY + (counter - 1) * (counterHeight + 29), 
            counter: counter, 
            caught: false 
        };
        drinkers.push(drinker);
    }
}

function startDrinkerTimer(counter) {
    let delay = Math.random() * 3000 + 1000 - time * 10;
    setTimeout(function() {
        createDrinkers(counter);
        startDrinkerTimer(counter);
    }, delay);
}


// Функция для отправки кружки с пивом по заданной стойке
function sendMug(counter) {
    if (counter > difficulty){
        return;
    }
    let mug = {
        x: barX + barWidth, 
        y: counterY + (counter - 1) * (counterHeight + 29),
        counter: counter, 
        caught: false 
    };
    mugs.push(mug);
}

// Функция для запуска таймера
function startTimer() {
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(function () {
        time++;
        timer.textContent = "Время: " + time;
        drinkerSpeed += 0.06;
    }, 1000);
}


// Функция для обновления счета
function updateScore() {
    score.textContent = "Очки: " + points;
}

// Функция для игрового цикла
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCanvas();
    for (let i = 0; i < mugs.length; i++) {
        let mug = mugs[i];
        mug.x += mugSpeed;
        ctx.drawImage(mugImage, mug.x, mug.y, mugWidth, mugHeight);
    }
    for (let i = 0; i < drinkers.length; i++) {
        let drinker = drinkers[i];
        if (!drinker.caught) {
            drinker.x -= drinkerSpeed;
        }
        ctx.drawImage(drinkerImage, drinker.x, drinker.y, drinkerWidth, drinkerHeight);
    }
    checkCollisions();
    if (game) {
        requestAnimationFrame(gameLoop);
    }
    for (let i = 0; i < drinkers.length; i++) {
        let drinker = drinkers[i];
        if (drinker.x <= barX + barWidth) {
            endGame();
        }
    }
}

// Функция для проверки столкновений между кружками и жаждущими
function checkCollisions() {
    for (let i = 0; i < mugs.length; i++) {
        let mug = mugs[i];
        for (let j = 0; j < drinkers.length; j++) {
            let drinker = drinkers[j];
            if (mug.counter === drinker.counter) {
                if (Math.abs(mug.x - drinker.x) < mugWidth) {
                    mug.caught = true;
                    drinker.caught = true;
                    points+=10;
                    updateScore();
                }
            }
        }
    }
    mugs = mugs.filter(mug => !mug.caught);
    drinkers = drinkers.filter(drinker => !drinker.caught);
}

function showRecords() {
    if (!game) {
        recordTable.sort((a, b) => b.points - a.points);
        let recordString = "Таблица рекордов:<br>";
        for (let i = 0; i < Math.min(10, recordTable.length); i++) {
            recordString += `${i + 1}. ${recordTable[i].name} - ${recordTable[i].points} очков за ${recordTable[i].time} секунд<br>`;
        }
        let recordDiv = document.createElement('div');
        recordDiv.id = 'recordTable';
        recordDiv.innerHTML = recordString;
        modal.appendChild(recordDiv);
        modal.style.display = "block";
        span.onclick = function() {
            modal.style.display = "none";
        }
    }
}

function saveRecords() {
    localStorage.setItem("records", JSON.stringify(recordTable));
    recordTable.push({name: user, points: points, time: time});
    recordTable.sort((a, b) => b.points - a.points);
    if (recordTable.length > 10) {
        recordTable.length = 10;
    }
    localStorage.setItem("records", JSON.stringify(recordTable));
}

// Загрузить таблицу рекордов из localStorage
function loadRecords() {
    let records = localStorage.getItem("records");
    if (records) {
        recordTable = JSON.parse(records);
    } else {
        recordTable = [];
    }
}

mugImage.onload = function() {
};
mugImage.onerror = function() {
    alert("Ошибка при загрузке изображения кружки.");
};

drinkerImage.onload = function() {
};
drinkerImage.onerror = function() {
    alert("Ошибка при загрузке изображения жаждущего.");
};

function endGame() {
    if (gameOver) {
        return; 
    }
    game = false;
    gameOver = true;
    clearInterval(interval);
    document.getElementById('endGameMessage').textContent = "Игра окончена! Ваш счет: " + points;
    document.getElementById('endGameModal').style.display = "block";
}
document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('endGameModal').style.display = "none";
    loadRecords();
    resetGame();
});

function resetGame() {
    saveRecords();
    canvas.classList.add('hidden');
    score.classList.add('hidden');
    timer.classList.add('hidden');
    controls.classList.remove('hidden');
    game = false;
    gameOver = false;
    points = 0;
    time = 0;
    mugs = [];
    drinkers = [];
    lastMugTime = [];
    mugDelay = [];
    start.disabled = true;
    userName.value = '';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}