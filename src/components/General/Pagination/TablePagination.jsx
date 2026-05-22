

export default function TablePagination({
  limit,
  total,
  page,
  onNext,
  onPrevious,
}) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const totalPages = Math.ceil(total / limit);

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page * limit >= total;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 px-1">
      {/* Info text */}
      <span className="text-sm text-muted order-2 sm:order-1">
        Showing <span className="font-semibold text-heading">{from}</span>–
        <span className="font-semibold text-heading">{to}</span> of{" "}
        <span className="font-semibold text-heading">{total}</span> entries
      </span>

      {/* Page indicator + buttons */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        {/* Previous */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={isPrevDisabled}
          className="
            inline-flex items-center gap-1.5
            px-3.5 py-2 text-sm font-medium
            bg-neutral-main text-paragraph
            border border-border-primary rounded-xl
            shadow-sm hover:bg-neutral-secondary hover:text-heading
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-150
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page indicator */}
        <span className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-heading bg-brand-primary/10 border border-brand-primary/20 rounded-xl min-w-[72px]">
          {page} / {totalPages || 1}
        </span>

        {/* Next */}
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="
            inline-flex items-center gap-1.5
            px-3.5 py-2 text-sm font-medium
            bg-neutral-main text-paragraph
            border border-border-primary rounded-xl
            shadow-sm hover:bg-neutral-secondary hover:text-heading
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-150
          "
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
