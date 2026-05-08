import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  Diamond,
  Heart,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";
import {
  useBoardImages,
  useBoardOptions,
  type BoardFilterType,
  type BoardViewState,
} from "../../lib/api";
import { cn } from "../../lib/cn";
import { MoveDetailSheet } from "../moves/MoveDetailSheet";
import { BoardCard } from "./BoardCard";
import type { BoardsRouteContext } from "./boardsRouteContext";
import {
  getFilterTypeForBoardView,
  isNormalizedBoardImage,
  isNormalizedBoardOption,
  normalizeBoardImage,
  normalizeBoardOption,
  type BoardDensity,
  type BoardTabValue,
} from "./normalizeBoard";

const boardFilters: {
  label: string;
  value: BoardTabValue;
  filterType: BoardFilterType;
  icon: typeof Heart;
}[] = [
  { label: "By Brands", value: "by_brands", filterType: "brand", icon: Diamond },
  {
    label: "By Content Type",
    value: "by_content_type",
    filterType: "content_type",
    icon: Heart,
  },
  {
    label: "By Country",
    value: "by_country",
    filterType: "country",
    icon: ArrowUpRight,
  },
];

const densityColumns: Record<BoardDensity, string> = {
  relaxed: "columns-2",
  standard: "columns-3",
  dense: "columns-4",
};

const layoutButtons: { label: string; value: BoardDensity; cells: number }[] = [
  { label: "Two column layout", value: "relaxed", cells: 2 },
  { label: "Three column layout", value: "standard", cells: 3 },
  { label: "Four column layout", value: "dense", cells: 4 },
];

type BoardsFoundationProps = {
  context: BoardsRouteContext;
  onContextChange: (
    updater: (current: BoardsRouteContext) => BoardsRouteContext,
  ) => void;
  savedMoveIds: Set<number | string>;
  onToggleSavedMove: (moveId: number | string) => void;
};

export function BoardsFoundation({
  context,
  onContextChange,
  savedMoveIds,
  onToggleSavedMove,
}: BoardsFoundationProps) {
  const { viewState, density, expandedFilter, targetIds, selectedMoveId } =
    context;

  const filterType = getFilterTypeForBoardView(viewState);
  const brandOptionsQuery = useBoardOptions("brand");
  const contentTypeOptionsQuery = useBoardOptions("content_type");
  const countryOptionsQuery = useBoardOptions("country");

  const brandOptions = useMemo(
    () =>
      brandOptionsQuery.data?.options
        .map((option) => normalizeBoardOption(option, "brand"))
        .filter(isNormalizedBoardOption) ?? [],
    [brandOptionsQuery.data?.options],
  );
  const contentTypeOptions = useMemo(
    () =>
      contentTypeOptionsQuery.data?.options
        .map((option) => normalizeBoardOption(option, "content_type"))
        .filter(isNormalizedBoardOption) ?? [],
    [contentTypeOptionsQuery.data?.options],
  );
  const countryOptions = useMemo(
    () =>
      countryOptionsQuery.data?.options
        .map((option) => normalizeBoardOption(option, "country"))
        .filter(isNormalizedBoardOption) ?? [],
    [countryOptionsQuery.data?.options],
  );

  const optionsByFilter = {
    brand: brandOptions,
    content_type: contentTypeOptions,
    country: countryOptions,
  } satisfies Record<BoardFilterType, typeof brandOptions>;

  const currentOptions = filterType ? optionsByFilter[filterType] : [];
  const effectiveTargetId = filterType
    ? (targetIds[filterType] ?? currentOptions[0]?.id)
    : undefined;
  const shouldWaitForTarget = Boolean(filterType && !effectiveTargetId);
  const imagesQuery = useBoardImages(
    viewState as BoardViewState,
    effectiveTargetId,
    density === "relaxed" ? 18 : density === "standard" ? 24 : 36,
    0,
    !shouldWaitForTarget,
  );

  const images = useMemo(
    () =>
      imagesQuery.data?.images
        .map((image, index) => normalizeBoardImage(image, index))
        .filter(isNormalizedBoardImage) ?? [],
    [imagesQuery.data?.images],
  );

  const isLoading =
    imagesQuery.isLoading ||
    imagesQuery.isFetching ||
    (filterType === "brand" && brandOptionsQuery.isLoading) ||
    (filterType === "content_type" && contentTypeOptionsQuery.isLoading) ||
    (filterType === "country" && countryOptionsQuery.isLoading);

  const hasOptionsError =
    brandOptionsQuery.isError ||
    contentTypeOptionsQuery.isError ||
    countryOptionsQuery.isError;

  function selectBrandTier() {
    onContextChange((current) => ({
      ...current,
      viewState: "direct",
      expandedFilter: null,
    }));
  }

  function selectFilter(
    nextFilterType: BoardFilterType,
    nextViewState: BoardTabValue,
  ) {
    onContextChange((current) => ({
      ...current,
      viewState: nextViewState,
      expandedFilter:
        current.expandedFilter === nextFilterType ? null : nextFilterType,
    }));
  }

  function selectOption(filter: BoardFilterType, optionId: number) {
    onContextChange((current) => ({
      ...current,
      targetIds: { ...current.targetIds, [filter]: optionId },
    }));
  }

  function selectDensity(nextDensity: BoardDensity) {
    onContextChange((current) => ({ ...current, density: nextDensity }));
  }

  function selectMove(moveId: number | string | null) {
    onContextChange((current) => ({ ...current, selectedMoveId: moveId }));
  }

  const selectedOptionIds = {
    brand: targetIds.brand ?? brandOptions[0]?.id,
    content_type: targetIds.content_type ?? contentTypeOptions[0]?.id,
    country: targetIds.country ?? countryOptions[0]?.id,
  } satisfies Partial<Record<BoardFilterType, number>>;

  return (
    <section className="grid min-h-screen w-full max-w-full grid-cols-1 lg:grid-cols-[minmax(0,17fr)_minmax(0,70fr)]">
      <div className="min-w-0 overflow-hidden px-8 py-9 lg:px-10">
        <div className="mb-[70px] flex items-center gap-6">
          <h1 className="bg-gradient-to-r from-[#25315f] to-[#9a826c] bg-clip-text text-[24px] font-medium leading-none tracking-[-0.03em] text-transparent">
            Boards
          </h1>
          <div className="flex items-center gap-4">
            {layoutButtons.map((button) => (
              <button
                key={button.value}
                type="button"
                aria-label={button.label}
                onClick={() => selectDensity(button.value)}
                className={cn(
                  "relative h-[23px] w-[22px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
                  density === button.value
                    ? "opacity-100"
                    : "opacity-35 hover:opacity-70",
                )}
              >
                {button.cells === 4 ? (
                  <span className="absolute inset-0 border border-[#111]">
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#111]" />
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#111]" />
                  </span>
                ) : (
                  <span
                    className={cn(
                      "grid h-full w-full gap-[2px]",
                      button.cells === 3 ? "grid-cols-3" : "grid-cols-2",
                    )}
                  >
                    {Array.from({
                      length: button.cells === 2 ? 2 : 3,
                    }).map((_, index) => (
                      <span
                        key={index}
                        className="border border-[#111] bg-transparent"
                      />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <nav className="flex flex-col gap-[26px]">
          <button
            type="button"
            onClick={selectBrandTier}
            className={cn(
              "flex min-h-[32px] w-full items-center gap-3 text-left text-[14px] leading-[1.25] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black",
              viewState === "direct"
                ? "font-medium text-black"
                : "text-[#00000066] hover:text-black",
            )}
          >
            <span className="flex w-[26px] shrink-0 items-center justify-center">
              <Sparkles className="size-[19px] stroke-[2.2]" />
            </span>
            <span className="min-w-0 flex-1 truncate">Brand Tier</span>
            <ChevronRight className="size-[18px] shrink-0 stroke-[2]" />
          </button>

          {boardFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = viewState === filter.value;
            const isExpanded = expandedFilter === filter.filterType;
            const filterOptions = optionsByFilter[filter.filterType];
            const selectedOptionId = selectedOptionIds[filter.filterType];

            return (
              <div key={filter.filterType} className="space-y-[14px]">
                <button
                  type="button"
                  onClick={() => selectFilter(filter.filterType, filter.value)}
                  className={cn(
                    "flex min-h-[32px] w-full items-center gap-3 text-left text-[14px] leading-[1.25] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black",
                    isActive
                      ? "font-medium text-black"
                      : "font-normal text-[#00000066] hover:text-black",
                  )}
                >
                  <span className="flex w-[26px] shrink-0 items-center justify-center">
                    <Icon className="size-[19px] stroke-[2.1]" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {filter.label}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="size-[18px] shrink-0 stroke-[2]" />
                  ) : (
                    <ChevronRight className="size-[18px] shrink-0 stroke-[2]" />
                  )}
                </button>

                {isExpanded && (
                  <div
                    className={cn(
                      "scrollbar-hidden ml-[42px] flex max-h-[560px] w-[calc(100%-42px)] flex-col gap-3 overflow-y-auto",
                      filter.filterType === "brand"
                        ? "max-w-[155px]"
                        : "max-w-[170px]",
                    )}
                  >
                    {filterOptions.map((option) => {
                      const isSelected = option.id === selectedOptionId;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            selectOption(filter.filterType, option.id)
                          }
                          className={cn(
                            "flex min-h-[54px] w-full items-center gap-3 rounded-[18px] border bg-white px-4 text-left text-[13px] text-black shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
                            isSelected
                              ? "border-black"
                              : "border-[#eeeeee] hover:border-[#bdbdbd]",
                            filter.filterType === "brand" &&
                              "h-[62px] justify-center overflow-hidden px-3",
                            filter.filterType === "content_type" &&
                              "min-h-0 justify-start rounded-none border-0 bg-transparent px-0 py-1 text-[14px] text-[#00000099] shadow-none",
                          )}
                        >
                          {filter.filterType === "content_type" ? (
                            <span
                              className={cn(
                                "min-w-0 truncate",
                                isSelected && "font-medium text-black",
                              )}
                            >
                              {option.label}
                            </span>
                          ) : option.imageUrl ? (
                            <img
                              src={option.imageUrl}
                              alt={option.label}
                              className={cn(
                                "shrink-0 object-contain",
                                filter.filterType === "brand"
                                  ? "max-h-[34px] max-w-full"
                                  : "size-[30px] rounded-[8px]",
                              )}
                            />
                          ) : (
                            <span className="size-[30px] shrink-0 rounded-[8px] bg-[#eeeeee]" />
                          )}
                          {filter.filterType === "country" && (
                            <span className="min-w-0 truncate">
                              {option.label}
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {filterOptions.length === 0 && (
                      <div className="rounded-[14px] border border-[#eeeeee] bg-white p-4 text-[12px] text-[#00000080]">
                        No filter options found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="min-w-0 border-l border-[#efefef] bg-[#f7f7f7]">
        {(imagesQuery.isError || hasOptionsError) && (
          <div className="m-6 border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Could not load board images.
          </div>
        )}

        {shouldWaitForTarget && (
          <div className="flex h-screen items-center justify-center text-[#777]">
            <Loader2 className="size-5 animate-spin" />
          </div>
        )}

        {!shouldWaitForTarget && (
          <div className={cn("gap-[5px] p-[5px]", densityColumns[density])}>
            {isLoading &&
              Array.from({
                length:
                  density === "relaxed" ? 8 : density === "standard" ? 12 : 16,
              }).map((_, index) => (
                <div
                  key={index}
                  className="mb-[5px] h-72 break-inside-avoid animate-pulse bg-[#ededed]"
                />
              ))}

            {!isLoading && images.length === 0 && !imagesQuery.isError && (
              <div className="m-6 border border-zinc-200 bg-white p-8 text-sm text-zinc-500">
                No board images found for this view.
              </div>
            )}

            {!isLoading &&
              images.map((image) => (
                <BoardCard
                  key={image.id}
                  image={image}
                  onOpenMove={selectMove}
                />
              ))}
          </div>
        )}
      </div>

      <MoveDetailSheet
        moveId={selectedMoveId}
        saved={selectedMoveId !== null && savedMoveIds.has(selectedMoveId)}
        onToggleSaved={onToggleSavedMove}
        onClose={() => selectMove(null)}
      />
    </section>
  );
}
