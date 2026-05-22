export default function TablePagination({
    limit,
    total,
    page,
    onNext,
    onPrevious,
}) {
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="flex flex-col items-center mt-4">
            {/* Info text */}
            <span className="text-sm text-paragraph">
                Showing{" "}
                <span className="font-semibold text-heading">{from}</span> to{" "}
                <span className="font-semibold text-heading">{to}</span> of{" "}
                <span className="font-semibold text-heading">{total}</span> entries
            </span>

            {/* Buttons */}
            <div className="inline-flex mt-4 -space-x-px">
                {/* Previous */}
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={page <= 1}
                    className="
            inline-flex items-center
            px-4 py-2.5 text-sm font-medium leading-5
            bg-neutral-secondary
            text-paragraph
            border border-border-primary
            rounded-s-base
            shadow-sm
            hover:bg-neutral-tertiary
            hover:text-heading
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-colors
          "
                >
                    Previous
                </button>

                {/* Next */}
                <button
                    type="button"
                    onClick={onNext}
                    disabled={page * limit >= total}
                    className="
            inline-flex items-center
            px-4 py-2.5 text-sm font-medium leading-5
            bg-neutral-secondary
            text-paragraph
            border border-border-primary
            rounded-e-base
            shadow-sm
            hover:bg-neutral-tertiary
            hover:text-heading
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition-colors
          "
                >
                    Next
                </button>
            </div>
        </div>
    );
}