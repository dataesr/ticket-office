import { Link } from "@dataesr/dsfr-plus";

export const ExternalLinks = ({ productionId, name }) => {
  const formattedProductionId = productionId.replace(/\//g, "%2f");
  return (
    <>
      <Link
        className="fr-ml-5w fr-mr-5w"
        target="_blank"
        rel="noreferrer noopener external"
        href={`https://scanr.enseignementsup-recherche.gouv.fr/publications/${formattedProductionId}`}
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
};
