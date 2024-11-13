import BottomPaginationButtons from "../../../components/pagination/bottom-buttons";
import TopPaginationButtons from "../../../components/pagination/top-buttons";

const TopPaginationSection: React.FC<{
  meta: any;
  page: number;
  maxPage: number;
  setPage: (page: number) => void;
}> = ({ meta, page, maxPage, setPage }) => (
  <TopPaginationButtons
    meta={meta}
    page={page}
    maxPage={maxPage}
    setPage={setPage}
  />
);

const BottomPaginationSection: React.FC<{
  page: number;
  maxPage: number;
  setPage: (page: number) => void;
}> = ({ page, maxPage, setPage }) => (
  <BottomPaginationButtons page={page} maxPage={maxPage} setPage={setPage} />
);

export { TopPaginationSection, BottomPaginationSection };
