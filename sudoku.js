class SudokuSolver {
    constructor() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(''));
        this.solvedGrid = null;
        this.initializeGrid();
        this.initializeEventListeners();
    }

    initializeGrid() {
        const gridContainer = document.getElementById('sudokuGrid');
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('input');
                cell.type = 'text';
                cell.maxLength = 1;
                cell.className = 'sudoku-cell';
                cell.id = `cell-${row}-${col}`;
                
                // Add thick borders for 3x3 sections
                if (col === 2 || col === 5) {
                    cell.classList.add('thick-right');
                }
                if (row === 2 || row === 5) {
                    cell.classList.add('thick-bottom');
                }
                
                cell.addEventListener('input', (e) => this.handleInput(row, col, e.target.value));
                gridContainer.appendChild(cell);
            }
        }
    }

    initializeEventListeners() {
        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        });

        // Solve button
        document.getElementById('solveBtn').addEventListener('click', () => this.solvePuzzle());
        
        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => this.clearGrid());
    }

    handleInput(row, col, value) {
        if (value === '' || (value >= '1' && value <= '9')) {
            this.grid[row][col] = value;
            this.solvedGrid = null;
            this.updateDisplay();
        } else {
            // Reset to previous value if invalid
            document.getElementById(`cell-${row}-${col}`).value = this.grid[row][col];
        }
    }

    updateDisplay() {
        const displayGrid = this.solvedGrid || this.grid;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.getElementById(`cell-${row}-${col}`);
                const isUserInput = this.grid[row][col] !== '';
                
                cell.value = displayGrid[row][col];
                cell.disabled = this.solvedGrid !== null;
                
                // Update styling
                cell.classList.remove('user-input', 'solved');
                if (isUserInput) {
                    cell.classList.add('user-input');
                } else if (this.solvedGrid && displayGrid[row][col] !== '') {
                    cell.classList.add('solved');
                }
            }
        }
        
        // Update solve button state
        const solveBtn = document.getElementById('solveBtn');
        solveBtn.disabled = this.solvedGrid !== null;
    }

    solvePuzzle() {
        // Convert grid to numeric format
        const numericGrid = this.grid.map(row => 
            row.map(cell => cell === '' ? 0 : parseInt(cell))
        );

        if (!this.isValidSudoku(numericGrid)) {
            alert('Invalid Sudoku configuration. Please check your input.');
            return;
        }

        const solution = this.solveSudoku(numericGrid);
        if (solution) {
            this.solvedGrid = solution.map(row => row.map(cell => cell.toString()));
            this.updateDisplay();
            alert('We are solving for you!');
        } else {
            alert('The Input is not valid');
        }
    }

    clearGrid() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(''));
        this.solvedGrid = null;
        this.updateDisplay();
        alert('Grid is going to be reset.');
    }

    isValidSudoku(grid) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] !== 0) {
                    const num = grid[i][j];
                    grid[i][j] = 0;
                    if (!this.isValidMove(grid, i, j, num)) {
                        grid[i][j] = num;
                        return false;
                    }
                    grid[i][j] = num;
                }
            }
        }
        return true;
    }

    isValidMove(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) {
                return false;
            }
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) {
                return false;
            }
        }

        // Check 3x3 box
        const startRow = row - (row % 3);
        const startCol = col - (col % 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    findEmptyLocation(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }

    solveSudoku(grid) {
        const gridCopy = grid.map(row => [...row]);
        
        if (this.solveSudokuHelper(gridCopy)) {
            return gridCopy;
        }
        return null;
    }

    solveSudokuHelper(grid) {
        const emptyLocation = this.findEmptyLocation(grid);
        
        if (!emptyLocation) {
            return true;
        }

        const [row, col] = emptyLocation;

        for (let num = 1; num <= 9; num++) {
            if (this.isValidMove(grid, row, col, num)) {
                grid[row][col] = num;

                if (this.solveSudokuHelper(grid)) {
                    return true;
                }

                grid[row][col] = 0;
            }
        }

        return false;
    }
}

// Initialize the Sudoku solver when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuSolver();
});
