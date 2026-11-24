import { Spinner } from "@dataesr/dsfr-plus";

export default function Loader() {
  return (
    <div className="fr-grid-row fr-grid-row--center fr-py-12w" role="status">
      <Spinner size={48} />
      <span className="fr-sr-only">Chargement en cours</span>
    </div>
  );
}
