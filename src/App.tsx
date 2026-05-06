import { Grid3X3, Rows3 } from 'lucide-react'
import { useState } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { BoardsFoundation } from './features/boards/BoardsFoundation'
import { MovesFoundation } from './features/moves/MovesFoundation'

function App() {
  const [savedMoveIds, setSavedMoveIds] = useState<Set<number | string>>(() => new Set())

  function toggleSavedMove(moveId: number | string) {
    setSavedMoveIds((current) => {
      const next = new Set(current)

      if (next.has(moveId)) {
        next.delete(moveId)
      } else {
        next.add(moveId)
      }

      return next
    })
  }

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-5 border-b border-zinc-200 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Cut & Sold take-home
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950 md:text-5xl">
              Moves and Boards
            </h1>
          </div>

          <nav className="inline-flex w-fit rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
            <NavLink
              to="/moves"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-950'
                }`
              }
            >
              <Rows3 className="size-4" />
              Moves
            </NavLink>
            <NavLink
              to="/boards"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-zinc-950 text-white' : 'text-zinc-500 hover:text-zinc-950'
                }`
              }
            >
              <Grid3X3 className="size-4" />
              Boards
            </NavLink>
          </nav>
        </header>

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/moves" replace />} />
            <Route
              path="/moves"
              element={
                <MovesFoundation
                  savedMoveIds={savedMoveIds}
                  onToggleSavedMove={toggleSavedMove}
                />
              }
            />
            <Route path="/boards" element={<BoardsFoundation />} />
            <Route path="*" element={<Navigate to="/moves" replace />} />
          </Routes>
        </div>
      </div>
    </main>
  )
}

export default App
