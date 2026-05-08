import type { FeedViewState } from "../../lib/api";

export const feedViewStates = new Set<FeedViewState>([
  "new_all",
  "competition",
  "adjacent",
  "inspired_all",
  "inspired_regional",
  "inspired_global",
]);

export const defaultMovesViewState: FeedViewState = "new_all";

export function isFeedViewState(value: string | null): value is FeedViewState {
  return feedViewStates.has(value as FeedViewState);
}
