import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
} from 'react';
import classes from './minesweeper.module.css';
import { FaBomb, FaFlag, FaUndoAlt } from 'react-icons/fa';
import { GiBrightExplosion } from 'react-icons/gi';
import { newGameState, useGameState } from './state';
import type { Action, Cell, State } from './state';
import type { Route } from './+types/minesweeper';

const GRID_ROWS = 10;
const GRID_COLS = 10;
const TOTAL_BOMBS = 10;

export function loader() {
  const opts = {
    bombs: TOTAL_BOMBS,
    grid: {
      rows: GRID_ROWS,
      columns: GRID_COLS,
    },
  };
  const initialState = newGameState(opts);

  return { initialState, opts };
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

type Time = [number, number];
function calcTime(start: number, end: number) {
  const diffInSeconds = (end - start) / 1000;
  const time = [diffInSeconds / 60, diffInSeconds % 60];

  return time.map(Math.floor) as Time;
}

function formatTime(time: Time): string {
  return time.map((t) => String(t).padStart(2, '0')).join(':');
}

function Timer() {
  const { state } = useContext(context);
  const [time, setTime] = useState<Time>([0, 0]);

  const deps = state.status === 'idle'
    ? [undefined, undefined] : state.status === 'playing'
      ? [state.startTime, undefined]
      : [state.startTime, state.endTime]

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.status !== 'idle') {
      interval = setInterval(() => {
        const end = state.status !== 'playing' ? state.endTime : Date.now();
        const time = calcTime(state.startTime, end);
        setTime(time);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, deps);

  return <p>{formatTime(time)}</p>;
}

function Toolbar() {
  const { state, dispatch } = useContext(context);
  return (
    <div className={classes.toolbar}>
      <p>Flags remaining: {state.flagsRemaining}</p>
      {state.status !== 'idle' && (
        <span>
          <Timer />
          <button onClick={() => dispatch(['RESTART_GAME'])}>
            <FaUndoAlt />
          </button>
        </span>
      )}
    </div>
  );
}

function Cell({ cell }: { cell: Cell }) {
  const { state, dispatch } = useContext(context);

  return (
    <div className={classes.cell}>
      {(() => {
        switch (state.status) {
          case 'kaboom':
            switch (cell.status) {
              case 'flagged':
                return cell.hasBomb ? <FaFlag color="var(--accent)" /> : '';
              case 'exploded':
                return (
                  <GiBrightExplosion className={classes.exploded} />
                );
              case undefined:
                if (cell.hasBomb) return <FaBomb />;
              default:
                return '';
            }
          case 'clear':
            switch (cell.status) {
              case 'flagged':
                return <FaFlag color="var(--accent)" />;
            }
          default:
            switch (cell.status) {
              case undefined:
                return (
                  <button
                    className={classes.button}
                    onContextMenu={(e) => e.preventDefault()}
                    onMouseDown={(e) => {
                      if (state.status === 'idle') {
                        dispatch(['START_GAME']);
                      }
                      dispatch([
                        e.button === 2 ? 'FLAG_CELL' : 'CLICKED_CELL',
                        cell,
                      ]);
                    }}
                  />
                );
              case 'flagged':
                return (
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

              default:
                return ['kaboom', 'clear'].includes(state.status)
                  ? ''
                  : cell.status || '';
            }
        }
      })()}
    </div>
  );
}
export default function Minesweeper({ loaderData }: Route.ComponentProps) {
  const { opts, initialState } = loaderData;
  const [state, dispatch] = useGameState({ opts, initialState });

  return (
    <context.Provider value={{ state, dispatch }}>
      <div className={classes.container}>
        <Toolbar />
        <div className={classes.grid}>
          {state.status === 'clear' && (
            <div className={classes.successMessage}>
              <h1>Clear!</h1>
              <h2>Completed in {formatTime(calcTime(state.startTime, state.endTime))}</h2>
            </div>
          )}
          {state.grid.map((row: Cell[], i: number) => (
            <React.Fragment key={i} >
              {row.map((cell) => (
                <Cell
                  key={cell.coords.toString()}
                  cell={cell}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </context.Provider>
  );
}
