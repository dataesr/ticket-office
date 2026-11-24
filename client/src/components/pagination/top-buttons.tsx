import { Text } from "@dataesr/dsfr-plus";
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
    <Text size="sm" className="fr-text--bold fr-mb-2w">
      Résultats : {from}-{to} sur {total}
    </Text>
  );
};

export default TopPaginationButtons;
