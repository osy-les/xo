document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restartBtn');
    
    let gameBoard = Array(3).fill().map(() => Array(3).fill(''));
    let currentPlayer = 'X';
    let gameActive = true;
    
    // Создаем игровое поле
    function createBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                board.appendChild(cell);
            }
        }
    }
    
    // Обработка клика по клетке
    function handleCellClick(e) {
        if (!gameActive) return;
        
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        // Если клетка уже занята, ничего не делаем
        if (gameBoard[row][col] !== '') return;
        
        // Делаем ход игрока
        makeMove(row, col, currentPlayer);
        
        // Проверяем результат после хода игрока
        if (checkWin(gameBoard, currentPlayer)) {
            status.textContent = `Вы победили!`;
            gameActive = false;
            return;
        }
        
        if (checkDraw(gameBoard)) {
            status.textContent = `Ничья!`;
            gameActive = false;
            return;
        }
        
        // Переключаем игрока
        currentPlayer = 'O';
        status.textContent = `Ход компьютера (O)...`;
        
        // Ход компьютера с небольшой задержкой для лучшего UX
        setTimeout(() => {
            if (!gameActive) return;
            
            const [compRow, compCol] = getComputerMove();
            makeMove(compRow, compCol, currentPlayer);
            
            // Проверяем результат после хода компьютера
            if (checkWin(gameBoard, currentPlayer)) {
                status.textContent = `Компьютер победил!`;
                gameActive = false;
                return;
            }
            
            if (checkDraw(gameBoard)) {
                status.textContent = `Ничья!`;
                gameActive = false;
                return;
            }
            
            // Возвращаем ход игроку
            currentPlayer = 'X';
            status.textContent = `Ваш ход (X)`;
        }, 500);
    }

    // Выполнение хода
    function makeMove(row, col, player) {
        gameBoard[row][col] = player;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.textContent = player;
        cell.style.pointerEvents = 'none';
    }
    
    // Ход компьютера
    function getComputerMove() {
        // 1. Проверяем, может ли компьютер выиграть
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard[i][j] === '') {
                    gameBoard[i][j] = 'O';
                    if (checkWin(gameBoard, 'O')) {
                        gameBoard[i][j] = '';
                        return [i, j];
                    }
                    gameBoard[i][j] = '';
                }
            }
        }
        
        // 2. Проверяем, нужно ли блокировать игрока
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard[i][j] === '') {
                    gameBoard[i][j] = 'X';
                    if (checkWin(gameBoard, 'X')) {
                        gameBoard[i][j] = '';
                        return [i, j];
                    }
                    gameBoard[i][j] = '';
                }
            }
        }
        
        // 3. Если центр свободен, занимаем его
        if (gameBoard[1][1] === '') {
            return [1, 1];
        }
        
        // 4. Случайный ход
        const emptyCells = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard[i][j] === '') {
                    emptyCells.push([i, j]);
                }
            }
        }
        
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }
    
    // Проверка победы
    function checkWin(board, player) {
        // Проверка строк
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
                return true;
            }
        }
        
        // Проверка столбцов
        for (let j = 0; j < 3; j++) {
            if (board[0][j] === player && board[1][j] === player && board[2][j] === player) {
                return true;
            }
        }
        
        // Проверка диагоналей
        if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
            return true;
        }
        
        if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
            return true;
        }
        
        return false;
    }
    
    // Проверка ничьи
    function checkDraw(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    return false;
                }
            }
        }
        return true;
    }
    
    // Начало новой игры
    function restartGame() {
        gameBoard = Array(3).fill().map(() => Array(3).fill(''));
        currentPlayer = 'X';
        gameActive = true;
        status.textContent = 'Ваш ход (X)';
        createBoard();
    }
    
    // Инициализация игры
    restartBtn.addEventListener('click', restartGame);
    createBoard();
});