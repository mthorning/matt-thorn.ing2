import { useReducer } from "react";

type Coords = [number, number];

type Grid = Cell[][];

export type Cell = {
  coords: Coords;
  hasBomb: boolean;
  status: undefined | 'flagged' | number | 'exploded';
};

export type State = {
  status: 'idle' | 'playing' | 'kaboom' | 'clear';
  flagsRemaining: number;
  cellsCleared: number;
  grid: Grid;
};

type Opts = {
  bombs: number,
  grid: {
    rows: number,
    columns: number,
  }
}

type EmptyAction = ['RESTART_GAME'];
type CellAction = ['CLICKED_CELL' | 'FLAG_CELL' | 'UNFLAG_CELL', Cell];
export type Action = EmptyAction | CellAction;

function functions(opts: Opts) {
  function possibleWin(state: State): State {
    if (state.flagsRemaining == 0 && allCellsCleared(state.grid)) {
      return {
        ...state,
        status: 'clear',
      }
    }

    return state;
  }

  function allCellsCleared(grid: Grid): boolean {
    for (const row of grid) {
      for (const cell of row) {
        if (cell.status === undefined) {
          return false
        }
      }
    }
    return true;
  }

  const directions = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [1, -1],
    [1, 1],
    [-1, -1],
  ];

  function walkAbout(grid: Grid, coords: Coords): Grid {
    const [currentRow, currentCol] = coords;
    if (isOutOfBounds([currentRow, currentCol])) return grid;

    const cell = grid[currentRow][currentCol];
    if (cell.status !== undefined) return grid;

    const bombs = countBombs(grid, [currentRow, currentCol]);
    grid = updateGrid(grid, coords, { status: bombs });
    if (bombs > 0) return grid;

    directions.forEach(([rowOffset, colOffset]) => {
      const row = currentRow + rowOffset;
      const col = currentCol + colOffset;
      grid = walkAbout(grid, [row, col]);
    });

    return grid;
  }

  function updateGrid(grid: Grid, coords: Coords, newCell: Partial<Cell>): Grid {
    const [row, col] = coords;
    const newGrid = [...grid.map((col) => [...col])];
    newGrid[row][col] = { ...newGrid[row][col], ...newCell };
    return newGrid;
  }

  function countBombs(grid: Grid, coords: Coords): number {
    const [currentRow, currentCol] = coords;

    return directions.reduce((acc, [rowOffset, colOffset]) => {
      const row = currentRow + rowOffset;
      const col = currentCol + colOffset;
      if (isOutOfBounds([row, col])) {
        return acc;
      }

      const cell = grid[row][col];
      const numBombs = Number(cell.hasBomb);

      return (acc += numBombs);
    }, 0);
  }

  function isOutOfBounds(coords: Coords): boolean {
    const [row, col] = coords;
    return row < 0 || col < 0 || row > opts.grid.rows - 1 || col > opts.grid.columns - 1;
  }

  return { updateGrid, possibleWin, walkAbout };
}

export function newGameState(opts: Opts): State {
  const makeArray = (size: number): undefined[] => new Array(size).fill(undefined);

  const coordsWithBombs: string[] = [];

  const getNewCoords = (): Coords => {
    const makeCoord = (x: number) => Math.floor(Math.random() * x)
    const newCoords = ([opts.grid.rows, opts.grid.columns] as const).map(makeCoord) as Coords;

    const stringCoords = JSON.stringify(newCoords);
    if (coordsWithBombs.includes(stringCoords)) {
      return getNewCoords();
    }

    coordsWithBombs.push(stringCoords);
    return newCoords;
  }

  const bombs = makeArray(opts.bombs).map(
    () => getNewCoords()
  );

  return {
    flagsRemaining: opts.bombs,
    cellsCleared: 0,
    status: 'idle',
    grid: makeArray(opts.grid.rows).map((_, row) =>
      makeArray(opts.grid.columns).map((status, col) => ({
        status,
        hasBomb: bombs.some(([y, x]) => row === y && col === x),
        coords: [row, col],
      }))
    ),
  };
}

export function useGameState({ initialState, opts }: { initialState: State, opts: Opts }) {
  const { updateGrid, possibleWin, walkAbout } = functions(opts);

  const reducer = (state: State, [action, payload]: Action): State => {
    switch (action) {
      case 'CLICKED_CELL':
        if (payload.hasBomb) {
          return {
            ...state,
            grid: updateGrid(state.grid, payload.coords, { status: 'exploded' }),
            status: 'kaboom',
          };
        }
        return possibleWin({
          ...state,
          status: 'playing',
          grid: walkAbout(state.grid, payload.coords),
        });

      case 'FLAG_CELL':
        if (state.flagsRemaining) {
          return possibleWin({
            ...state,
            status: 'playing',
            grid: updateGrid(state.grid, payload.coords, { status: 'flagged' }),
            flagsRemaining: state.flagsRemaining - 1,
          });
        }

        return state;

      case 'UNFLAG_CELL':
        return {
          ...state,
          grid: updateGrid(state.grid, payload.coords, { status: undefined }),
          flagsRemaining: state.flagsRemaining + 1,
        };

      case 'RESTART_GAME':
        return newGameState(opts);

      default:
        return state;
    }
  }

  return useReducer(reducer, initialState);
}

