import { Row, Spinner } from "@dataesr/dsfr-plus";

export default function Loader() {
  return (
    <Row horizontalAlign="center" className="fr-py-12w" role="status">
      <Spinner size={48} />
      <span className="fr-sr-only">Chargement en cours</span>
    </Row>
  );
}
