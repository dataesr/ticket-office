import { Button, Text } from "@dataesr/dsfr-plus";

const TopPaginationButtons = ({ meta, page, maxPage, setPage }) => {
  return (
    <>
      <Text size="sm" bold>
        Résultats: 1-20 de {meta?.total}
      </Text>
      <Button
        onClick={() => setPage(1)}
        disabled={page === 1}
        title="Page 1"
        className="fr-mr-1w"
        variant="secondary"
        size="sm"
      >
        Retour à la page 1
      </Button>
      <Button
        onClick={() => setPage(maxPage)}
        disabled={page === maxPage}
        title={`Page ${maxPage}`}
        className="fr-mr-1w"
        variant="secondary"
        size="sm"
      >
        Dernière page
      </Button>
    </>
  );
};

export default TopPaginationButtons;
