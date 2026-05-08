import type { BoardFilterType } from "../../lib/api";
import type { BoardDensity, BoardTabValue } from "./normalizeBoard";

export type BoardsRouteContext = {
  viewState: BoardTabValue;
  density: BoardDensity;
  expandedFilter: BoardFilterType | null;
  targetIds: Partial<Record<BoardFilterType, number>>;
  selectedMoveId: number | string | null;
};

export const defaultBoardsRouteContext: BoardsRouteContext = {
  viewState: "direct",
  density: "dense",
  expandedFilter: null,
  targetIds: {},
  selectedMoveId: null,
};
