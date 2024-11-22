import BottomPaginationButtons from "../../../components/pagination/bottom-buttons";
import TopPaginationButtons from "../../../components/pagination/top-buttons";
import { PaginationProps, TopPaginationProps } from "../types";

const TopPaginationSection: React.FC<TopPaginationProps> = ({
  meta,
  page,
  maxPage,
  setPage,
}) => (
  <TopPaginationButtons
    meta={meta}
    page={page}
    maxPage={maxPage}
    setPage={setPage}
  />
);

const BottomPaginationSection: React.FC<PaginationProps> = ({
  page,
  maxPage,
  setPage,
}) => (
  <BottomPaginationButtons page={page} maxPage={maxPage} setPage={setPage} />
);

export { TopPaginationSection, BottomPaginationSection };
