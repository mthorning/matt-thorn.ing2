import { useReducer, createContext, useContext, type Dispatch } from 'react';
import classes from './minesweeper.module.css';
import { FaBomb, FaFlag, FaUndoAlt } from 'react-icons/fa';
import { GiBrightExplosion } from 'react-icons/gi';
import type { Route } from './+types/minesweeper';

type Coords = [number, number];

type Cell = {
  coords: Coords;
  hasBomb: boolean;
  status: undefined | 'flagged' | number | 'exploded';
};

type Grid = Cell[][];

type State = {
  status: 'idle' | 'playing' | 'kaboom' | 'clear';
  flagsRemaining: number;
  cellsCleared: number;
  grid: Grid;
};

type EmptyAction = ['RESTART_GAME'];
type CellAction = ['CLICKED_CELL' | 'FLAG_CELL' | 'UNFLAG_CELL', Cell];
type Action = EmptyAction | CellAction;

const GRID_ROWS = 10;
const GRID_COLS = 10;
const TOTAL_BOMBS = 10;

function newGameState(): State {
  const coordsWithBombs: string[] = [];

  const getNewCoords = (): Coords => {
    const makeCoord = (x: number) => Math.floor(Math.random() * x)
    const newCoords = ([GRID_ROWS, GRID_COLS] as const).map(makeCoord) as Coords;

    const stringCoords = JSON.stringify(newCoords);
    if (coordsWithBombs.includes(stringCoords)) {
      return getNewCoords();
    }

    coordsWithBombs.push(stringCoords);
    return newCoords;
  }

  const bombs = makeArray(TOTAL_BOMBS).map(
    () => getNewCoords()
  );

  return {
    flagsRemaining: TOTAL_BOMBS,
    cellsCleared: 0,
    status: 'idle',
    grid: makeArray(GRID_ROWS).map((_, row) =>
      makeArray(GRID_COLS).map((status, col) => ({
        status,
        hasBomb: bombs.some(([y, x]) => row === y && col === x),
        coords: [row, col],
      }))
    ),
  };
}

export function loader() {
  return newGameState();
}


function Toolbar() {
  const { state, dispatch } = useContext(context);
  return (
    <div className={classes.toolbar}>
      Flags remaining: {state.flagsRemaining}
      {state.status !== 'idle' && (
        <button onClick={() => dispatch(['RESTART_GAME'])}>
          <FaUndoAlt />
        </button>
      )}
    </div>
  );
}
function Cell({ cell }: { cell: Cell }) {
  const { state, dispatch } = useContext(context);

  return (
    <div className={classes.cell}>
      {state.status === 'kaboom' &&
        cell.hasBomb &&
        cell.status !== 'exploded' ? (
        <div>
          <FaBomb />
        </div>
      ) : (
        (() => {
          switch (cell.status) {
            case undefined:
              if (state.status === 'kaboom') return '';

              return (
                <button
                  className={classes.button}
                  onContextMenu={(e) => e.preventDefault()}
                  onMouseDown={(e) => {
                    dispatch([
                      e.button === 2 ? 'FLAG_CELL' : 'CLICKED_CELL',
                      cell,
                    ]);
                  }}
                />
              );
            case 'flagged':
              if (state.status === 'kaboom') return '';

              return state.status === 'clear' ? (
                <FaFlag />
              ) : (
                <button
                  className={classes.button}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 2) {
                      dispatch(['UNFLAG_CELL', cell]);
                    }
                  }}
                >
                  <FaFlag />
                </button>
              );
            case 'exploded':
              return (
                <div className={classes.exploded}>
                  <span className={classes.explosion}>
                    <GiBrightExplosion />
                  </span>
                </div>
              );

            default:
              return ['kaboom', 'clear'].includes(state.status) ? '' : (cell.status || '');
          }
        })()
      )}
    </div>
  );
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

function isOutOfBounds(coords: Coords): boolean {
  const [row, col] = coords;
  return row < 0 || col < 0 || row > GRID_ROWS - 1 || col > GRID_COLS - 1;
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

function updateGrid(grid: Grid, coords: Coords, newCell: Partial<Cell>): Grid {
  const [row, col] = coords;
  const newGrid = [...grid.map((col) => [...col])];
  newGrid[row][col] = { ...newGrid[row][col], ...newCell };
  return newGrid;
}

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

function reducer(state: State, [action, payload]: Action): State {
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
      return newGameState();

    default:
      return state;
  }
}

const makeArray = (size: number): undefined[] => new Array(size).fill(undefined);

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

const context = createContext<{ state: State; dispatch: Dispatch<Action> }>({
  state: {
    status: 'idle',
    flagsRemaining: 0,
    cellsCleared: 0,
    grid: [],
  },
  dispatch: () => undefined,
});

export default function Minesweeper({ loaderData}: Route.ComponentProps) {
  const [state, dispatch] = useReducer(reducer, loaderData);
  return (
    <context.Provider value={{ state, dispatch }}>
      <div className={classes.container}>
        <Toolbar />
        <div className={classes.grid}>
          {state.status === 'clear' && (
            <div className={classes.successMessage}>
              <h1>Clear!</h1>
            </div>
          )}
          {state.grid.map((row: Cell[], i: number) => (
            <div
              key={i}
              className={classes.row}
            >
              {row.map((cell) => (
                <Cell
                  key={cell.coords.toString()}
                  cell={cell}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </context.Provider>
  );
}
