import { House } from "lucide-react";
import { useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { BoardsFoundation } from "./features/boards/BoardsFoundation";
import {
  defaultBoardsRouteContext,
  type BoardsRouteContext,
} from "./features/boards/boardsRouteContext";
import { MovesFoundation } from "./features/moves/MovesFoundation";
import {
  defaultMovesViewState,
  isFeedViewState,
} from "./features/moves/movesRouteContext";
import type { FeedViewState } from "./lib/api";
import { cn } from "./lib/cn";

function BrandTierIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid h-[18px] w-[18px] shrink-0 grid-cols-2 gap-[4px] ${className}`}
    >
      <span className="rounded-full bg-current" />
      <span className="rounded-full bg-current" />
      <span className="rounded-full bg-current" />
      <span className="rounded-full bg-current" />
    </span>
  );
}

function App() {
  const [movesViewState, setMovesViewState] = useState<FeedViewState>(() => {
    const tabParam = new URLSearchParams(window.location.search).get("tab");

    return isFeedViewState(tabParam) ? tabParam : defaultMovesViewState;
  });
  const [movesSelectedMoveId, setMovesSelectedMoveId] = useState<
    number | string | null
  >(null);
  const [boardsContext, setBoardsContext] = useState<BoardsRouteContext>(
    defaultBoardsRouteContext,
  );
  const [savedMoveIds, setSavedMoveIds] = useState<Set<number | string>>(
    () => new Set(),
  );

  function toggleSavedMove(moveId: number | string) {
    setSavedMoveIds((current) => {
      const next = new Set(current);

      if (next.has(moveId)) {
        next.delete(moveId);
      } else {
        next.add(moveId);
      }

      return next;
    });
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-[#101010]">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[minmax(0,13fr)_minmax(0,87fr)]">
        <aside className="flex min-w-0 flex-col bg-[#ededed] px-7 py-9">
          <div className="mb-12">
            <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-[#666]">
              News Feed
            </p>
            <p className="mt-2 text-[22px] font-bold leading-none tracking-[-0.02em] text-black">
              cutandsold
            </p>
          </div>

          <nav className="flex flex-col gap-7">
            <NavLink
              to="/moves"
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-5 text-[14px] font-medium leading-none transition",
                  isActive ? "text-black" : "text-[#777] hover:text-black",
                )
              }
            >
              <House className="size-[20px] fill-current stroke-0 opacity-60" />
              Moves
            </NavLink>
            <NavLink
              to="/boards"
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-5 text-[14px] font-medium leading-none transition",
                  isActive ? "text-black" : "text-[#777] hover:text-black",
                )
              }
            >
              <BrandTierIcon />
              Boards
            </NavLink>
          </nav>

          <div className="flex-1" />
        </aside>

        <div className="min-w-0 flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/moves" replace />} />
            <Route
              path="/moves"
              element={
                <MovesFoundation
                  viewState={movesViewState}
                  onViewStateChange={setMovesViewState}
                  selectedMoveId={movesSelectedMoveId}
                  onSelectedMoveIdChange={setMovesSelectedMoveId}
                  savedMoveIds={savedMoveIds}
                  onToggleSavedMove={toggleSavedMove}
                />
              }
            />
            <Route
              path="/boards"
              element={
                <BoardsFoundation
                  context={boardsContext}
                  onContextChange={setBoardsContext}
                  savedMoveIds={savedMoveIds}
                  onToggleSavedMove={toggleSavedMove}
                />
              }
            />
            <Route path="*" element={<Navigate to="/moves" replace />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default App;
