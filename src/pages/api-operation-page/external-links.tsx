import { Link } from "@dataesr/dsfr-plus";

export const ExternalLinks = ({ productionId, name }) => (
  <>
    <Link
      className="fr-mr-1w"
      target="_blank"
      rel="noreferrer noopener external"
      href={`https://scanr.enseignementsup-recherche.gouv.fr/publication/${productionId}`}
    >
      scanR
    </Link>
    <Link
      className="fr-mr-1w"
      target="_blank"
      rel="noreferrer noopener external"
      href={`https://google.com/search?q=${name}`}
    >
      Google
    </Link>
  </>
);
