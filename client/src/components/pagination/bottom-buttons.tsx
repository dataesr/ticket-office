import { PaginationProps } from "../../types";

const PAGES_AROUND_CURRENT = 1;

type PageEntry = number | "ellipsis";

const getPageEntries = (page: number, maxPage: number): PageEntry[] => {
  const pages = new Set<number>([1, maxPage]);
  for (
    let p = page - PAGES_AROUND_CURRENT;
    p <= page + PAGES_AROUND_CURRENT;
    p += 1
  ) {
    if (p >= 1 && p <= maxPage) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const entries: PageEntry[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) entries.push("ellipsis");
    entries.push(p);
  });
  return entries;
};

const BottomPaginationButtons = ({
  page,
  maxPage,
  setPage,
}: PaginationProps) => {
  if (maxPage <= 1) return null;

  return (
    <nav
      role="navigation"
      className="fr-pagination fr-mt-5w"
      aria-label="Pagination"
    >
      <ul className="fr-pagination__list">
        <li>
          <button
            type="button"
            className="fr-pagination__link fr-pagination__link--first"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            Première page
          </button>
        </li>
        <li>
          <button
            type="button"
            className="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Page précédente
          </button>
        </li>
        {getPageEntries(page, maxPage).map((entry, index) =>
          entry === "ellipsis" ? (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`ellipsis-${index}`}>
              <span aria-hidden="true">…</span>
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                className="fr-pagination__link"
                aria-current={entry === page ? "page" : undefined}
                title={`Page ${entry}`}
                onClick={() => setPage(entry)}
              >
                {entry}
              </button>
            </li>
          )
        )}
        <li>
          <button
            type="button"
            className="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
            onClick={() => setPage(page + 1)}
            disabled={page >= maxPage}
          >
            Page suivante
          </button>
        </li>
        <li>
          <button
            type="button"
            className="fr-pagination__link fr-pagination__link--last"
            onClick={() => setPage(maxPage)}
            disabled={page >= maxPage}
          >
            Dernière page
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default BottomPaginationButtons;
