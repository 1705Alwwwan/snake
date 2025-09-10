// Ambil elemen canvas dan context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ambil elemen tombol dan skor
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');

// Konstanta dan variabel permainan
const box = 20; // Ukuran setiap kotak dalam piksel
let snake = []; // Array untuk tubuh ular
let food = {}; // Posisi makanan
let direction = 'right'; // Arah awal
let score = 0; // Skor awal
let game; // Variabel untuk interval permainan

// Inisialisasi game
function initGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = score;
    createFood();
}

// Buat posisi makanan secara acak
function createFood() {
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

// Tangani input keyboard untuk mengubah arah
document.addEventListener('keydown', changeDirection);
function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== 'right') { // Panah kiri
        direction = 'left';
    } else if (key === 38 && direction !== 'down') { // Panah atas
        direction = 'up';
    } else if (key === 39 && direction !== 'left') { // Panah kanan
        direction = 'right';
    } else if (key === 40 && direction !== 'up') { // Panah bawah
        direction = 'down';
    }
}

// Gambar semua elemen game
function draw() {
    // Bersihkan canvas
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gambar ular
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? '#4cd1c0' : '#27ae60';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = '#2c3e50';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Gambar makanan
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x, food.y, box, box);

    // Gerakkan ular
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'left') snakeX -= box;
    if (direction === 'up') snakeY -= box;
    if (direction === 'right') snakeX += box;
    if (direction === 'down') snakeY += box;

    // Periksa apakah ular memakan makanan
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreDisplay.textContent = score;
        createFood();
    } else {
        snake.pop(); // Hapus ekor
    }

    let newHead = { x: snakeX, y: snakeY };

    // Periksa tabrakan
    if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        startButton.disabled = false;
        alert('Game Over! Skor Anda: ' + score);
    }

    snake.unshift(newHead); // Tambahkan kepala baru
}

// Fungsi untuk mendeteksi tabrakan dengan diri sendiri
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Tangani tombol mulai
startButton.addEventListener('click', () => {
    initGame();
    startButton.disabled = true;
    if (game) clearInterval(game);
    game = setInterval(draw, 100);
});

// Mulai permainan saat halaman dimuat
window.onload = () => {
    initGame();
};
