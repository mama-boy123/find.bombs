document.addEventListener('DOMContentLoaded', () => {
    const gridSize = 20;
    const minMineCount = 40;
    const mineSweeper = document.getElementById('minesweeper');
    const restartBtn = document.getElementById('restartBtn');
    let grid = [];
    let mineLocations = [];
    let gameOver = false;

    function createBoard() {
        mineSweeper.innerHTML = ''; // 기존 보드 제거
        grid = [];
        mineLocations = [];
        gameOver = false;

        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('id', i);
            cell.classList.add('cell');
            mineSweeper.appendChild(cell);
            grid.push(cell);

            cell.addEventListener('click', () => {
                if (!gameOver) revealCell(cell);
            });

            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (!gameOver) toggleFlag(cell);
            });
        }

        placeMines();
        calculateNumbers();
    }

    function placeMines() {
        const maxMines = Math.min(gridSize * gridSize - 1, minMineCount + Math.floor(Math.random() * 20)); // 최소 40개 이상의 지뢰 설정
        while (mineLocations.length < maxMines) {
            const mineIndex = Math.floor(Math.random() * gridSize * gridSize);
            if (!mineLocations.includes(mineIndex)) {
                mineLocations.push(mineIndex);
            }
        }
    }

    function calculateNumbers() {
        for (let i = 0; i < grid.length; i++) {
            const isMine = mineLocations.includes(i);
            if (!isMine) {
                let total = 0;
                const neighbors = getNeighbors(i);
                neighbors.forEach(neighbor => {
                    if (mineLocations.includes(neighbor)) {
                        total++;
                    }
                });
                if (total > 0) {
                    grid[i].setAttribute('data', total);
                }
            }
        }
    }

    function getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) continue;
                const newRow = row + x;
                const newCol = col + y;
                if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                    neighbors.push(newRow * gridSize + newCol);
                }
            }
        }
        return neighbors;
    }

    function revealCell(cell) {
        const cellId = parseInt(cell.id);
        if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

        cell.classList.add('revealed');
        if (mineLocations.includes(cellId)) {
            cell.textContent = '💣';
            cell.classList.add('mine');
            gameOver = true;
            alert('Game Over!');
            revealMines();
        } else {
            const total = cell.getAttribute('data');
            if (total) {
                cell.textContent = total;
            } else {
                const neighbors = getNeighbors(cellId);
                neighbors.forEach(neighbor => revealCell(grid[neighbor]));
            }
        }
    }

    function toggleFlag(cell) {
        if (!cell.classList.contains('revealed')) {
            if (cell.classList.contains('flag')) {
                cell.classList.remove('flag');
                cell.textContent = '';
            } else {
                cell.classList.add('flag');
                cell.textContent = '🚩';
            }
        }
    }

    function revealMines() {
        mineLocations.forEach(index => {
            grid[index].classList.add('revealed');
            grid[index].textContent = '💣';
        });
    }

    restartBtn.addEventListener('click', createBoard);

    createBoard();
});
