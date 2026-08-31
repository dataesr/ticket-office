import { TopPaginationProps } from "../../types";

const TopPaginationButtons = ({
  meta,
  page,
  pageSize = 20,
}: TopPaginationProps & { pageSize?: number }) => {
  const total = meta?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <p className="fr-text--sm fr-text--bold fr-mb-2w">
      Résultats : {from}-{to} sur {total}
    </p>
  );
};

export default TopPaginationButtons;
