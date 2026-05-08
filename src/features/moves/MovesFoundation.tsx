import {
  Flag,
  Globe2,
  Lightbulb,
  MapPin,
  Paperclip,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";
import { useFeedMoves, type FeedViewState } from "../../lib/api";
import { cn } from "../../lib/cn";
import { MoveCard } from "./MoveCard";
import { MoveDetailSheet } from "./MoveDetailSheet";
import { normalizeMove } from "./normalizeMove";

const feedTabs: {
  label: string;
  value: FeedViewState;
  icon: typeof Sparkles;
  indent?: boolean;
}[] = [
  { label: "New", value: "new_all", icon: Sparkles },
  { label: "Direct Competitors", value: "competition", icon: Flag },
  { label: "Adjacent Competitors", value: "adjacent", icon: Paperclip },
  { label: "Inspiration", value: "inspired_all", icon: Lightbulb },
  { label: "Regional", value: "inspired_regional", icon: MapPin, indent: true },
  { label: "Global", value: "inspired_global", icon: Globe2, indent: true },
];

type MovesFoundationProps = {
  viewState: FeedViewState;
  onViewStateChange: (viewState: FeedViewState) => void;
  selectedMoveId: number | string | null;
  onSelectedMoveIdChange: (moveId: number | string | null) => void;
  savedMoveIds: Set<number | string>;
  onToggleSavedMove: (moveId: number | string) => void;
};

export function MovesFoundation({
  viewState,
  onViewStateChange,
  selectedMoveId,
  onSelectedMoveIdChange,
  savedMoveIds,
  onToggleSavedMove,
}: MovesFoundationProps) {
  const { data, isLoading, isError } = useFeedMoves(viewState, 10);

  const moves = useMemo(
    () => data?.actions.map((move, index) => normalizeMove(move, index)) ?? [],
    [data?.actions],
  );
  const selectedMove = moves.find((move) => move.id === selectedMoveId);

  return (
    <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[21fr_66fr]">
      <aside className="min-w-0 px-8 py-10 lg:px-10">
        <div className="mb-12">
          <h1 className="bg-gradient-to-r from-[#25315f] from-[18%] via-[#9a826c] via-[58%] to-[#9a826c] bg-clip-text text-[24px] font-medium leading-none tracking-[-0.03em] text-transparent">
            Whats New
          </h1>
          <p className="mt-3 text-[12px] font-medium leading-none text-[#777]">
            10 notable moves in the last 48 hours
          </p>
        </div>

        <nav className="flex flex-col gap-6">
          {feedTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.value === viewState;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onViewStateChange(tab.value)}
                className={cn(
                  "flex min-h-[24px] w-full items-center gap-4 text-left text-[13px] font-medium leading-[1.25] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black",
                  tab.indent && "pl-7",
                  isActive ? "text-black" : "text-[#777] hover:text-black",
                )}
              >
                <span className="flex w-[18px] shrink-0 items-center justify-center">
                  <Icon className="size-[18px] stroke-[1.8]" />
                </span>
                <span className="min-w-0 truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 border-l border-[#efefef] bg-[#f7f7f7] px-8 py-8">
        {isError && (
          <div className="mb-8 border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Could not load moves. Check the API token or try refreshing.
          </div>
        )}

        <div className="grid gap-y-16">
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="grid min-h-[620px] grid-cols-[40fr_36fr] gap-8"
              >
                <div className="animate-pulse bg-[#ededed]" />
                <div className="animate-pulse bg-[#f0f0f0]" />
              </div>
            ))}

          {!isLoading && moves.length === 0 && !isError && (
            <div className="border border-zinc-200 bg-white p-8 text-sm text-zinc-500">
              No moves found for this view.
            </div>
          )}

          {moves.map((move) => (
            <MoveCard
              key={move.id}
              move={move}
              saved={savedMoveIds.has(move.id)}
              onToggleSaved={onToggleSavedMove}
              onOpen={onSelectedMoveIdChange}
            />
          ))}
        </div>
      </div>

      <MoveDetailSheet
        moveId={selectedMoveId}
        fallbackMove={selectedMove}
        saved={selectedMoveId !== null && savedMoveIds.has(selectedMoveId)}
        onToggleSaved={onToggleSavedMove}
        onClose={() => onSelectedMoveIdChange(null)}
      />
    </section>
  );
}
