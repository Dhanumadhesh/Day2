import { useState } from 'react'

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const EMPTY_SCORES = { x: 0, o: 0, draws: 0 }

function getWinningLine(board) {
  return WINNING_LINES.find(([first, second, third]) => (
    board[first] && board[first] === board[second] && board[first] === board[third]
  ))
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [scores, setScores] = useState(EMPTY_SCORES)

  const winningLine = getWinningLine(board)
  const winner = winningLine ? board[winningLine[0]] : null
  const isDraw = !winner && board.every(Boolean)

  function handleCellClick(index) {
    if (board[index] || winner || isDraw) return

    const nextBoard = [...board]
    nextBoard[index] = isXNext ? 'X' : 'O'
    const nextWinningLine = getWinningLine(nextBoard)

    setBoard(nextBoard)
    setIsXNext(!isXNext)

    if (nextWinningLine) {
      const winningPlayer = nextBoard[nextWinningLine[0]].toLowerCase()
      setScores((currentScores) => ({
        ...currentScores,
        [winningPlayer]: currentScores[winningPlayer] + 1,
      }))
    } else if (nextBoard.every(Boolean)) {
      setScores((currentScores) => ({
        ...currentScores,
        draws: currentScores.draws + 1,
      }))
    }
  }

  function startNextRound() {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
  }

  function resetGame() {
    startNextRound()
    setScores(EMPTY_SCORES)
  }

  let status = `Player ${isXNext ? 'X' : 'O'}'s turn`
  if (winner) status = `Player ${winner} wins!`
  else if (isDraw) status = "It's a draw!"

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:py-14">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-xl font-black tracking-widest text-indigo-300 ring-1 ring-indigo-400/30">
          XO
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
          Classic game
        </p>
        <h1 className="text-center text-4xl font-black tracking-tight sm:text-5xl">
          Tic Tac Toe
        </h1>
        <p className="mt-3 text-center text-slate-400">
          A little friendly competition starts here.
        </p>

        <section
          aria-label="Score"
          className="mt-8 grid w-full grid-cols-3 gap-3"
        >
          {[
            { label: 'Player X', score: scores.x, color: 'text-indigo-300' },
            { label: 'Draws', score: scores.draws, color: 'text-slate-300' },
            { label: 'Player O', score: scores.o, color: 'text-fuchsia-300' },
          ].map(({ label, score, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-4 text-center"
            >
              <p className="text-xs font-medium text-slate-400 sm:text-sm">{label}</p>
              <p className={`mt-1 text-2xl font-bold ${color}`}>{score}</p>
            </div>
          ))}
        </section>

        <p
          aria-live="polite"
          className={`mt-7 min-h-7 text-lg font-semibold ${
            winner ? 'text-emerald-300' : isDraw ? 'text-amber-300' : 'text-slate-200'
          }`}
        >
          {status}
        </p>

        <div
          aria-label="Tic Tac Toe board"
          className="mt-4 grid w-full grid-cols-3 gap-3"
        >
          {board.map((cell, index) => {
            const isWinningCell = winningLine?.includes(index)

            return (
              <button
                key={index}
                type="button"
                aria-label={`Cell ${index + 1}${cell ? `: ${cell}` : ': empty'}`}
                disabled={Boolean(cell) || Boolean(winner) || isDraw}
                onClick={() => handleCellClick(index)}
                className={`aspect-square rounded-2xl border text-5xl font-black shadow-lg transition duration-150 sm:text-6xl ${
                  isWinningCell
                    ? 'border-emerald-400/70 bg-emerald-400/15'
                    : 'border-slate-800 bg-slate-900 hover:border-indigo-400/60 hover:bg-slate-800'
                } ${
                  cell === 'X'
                    ? 'text-indigo-300'
                    : cell === 'O'
                      ? 'text-fuchsia-300'
                      : 'text-slate-100'
                } disabled:cursor-default disabled:hover:border-slate-800 disabled:hover:bg-slate-900`}
              >
                {cell}
              </button>
            )
          })}
        </div>

        <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={startNextRound}
            className="flex-1 rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            {winner || isDraw ? 'Play again' : 'New round'}
          </button>
          <button
            type="button"
            onClick={resetGame}
            className="flex-1 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Reset scores
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
