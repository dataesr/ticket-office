import { Button, Row } from "@dataesr/dsfr-plus";

const BottomPaginationButtons = ({ page, maxPage, setPage }) => {
  return (
    <Row className="fr-grid-row--center fr-mt-5w">
      <Button
        onClick={() => setPage(1)}
        disabled={page === 1}
        title="Page 1"
        className="fr-mr-2w"
        variant="secondary"
        size="sm"
      >
        Retour à la page 1
      </Button>
      <Button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        title="Page précédente"
        className="fr-mr-2w"
      >
        Précédente
      </Button>
      <span>{`${page} sur ${maxPage}`}</span>
      <Button
        onClick={() => setPage(page + 1)}
        disabled={page >= maxPage}
        title="Page suivante"
        className="fr-ml-2w"
      >
        Suivante
      </Button>

      <Button
        onClick={() => setPage(maxPage)}
        disabled={page >= maxPage}
        title={`Page ${maxPage}`}
        className="fr-ml-2w"
        variant="secondary"
        size="sm"
      >
        Dernière page
      </Button>
    </Row>
  );
};

export default BottomPaginationButtons;
