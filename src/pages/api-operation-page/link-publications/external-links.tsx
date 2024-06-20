import { Link } from "@dataesr/dsfr-plus";
import { useState } from "react";

export const ExternalLinks = ({ productionId, name }) => {
  const formattedProductionId = productionId.replace(/\//g, "%2f");
  const [google, setGoogleClicked] = useState(false);
  const [scanRClicked, setScanRClicked] = useState(false);
  return (
    <>
      <Link
        className={`fr-ml-5w fr-mr-5w fr-footer__content-link ${
          scanRClicked ? "clicked-link" : ""
        }`}
        target="_blank"
        rel="noreferrer noopener external"
        href={`https://scanr.enseignementsup-recherche.gouv.fr/publications/${formattedProductionId}`}
        onClick={() => setScanRClicked(true)}
      >
        scanR
      </Link>
      <Link
        className={`fr-mr-1w fr-footer__content-link ${
          google ? "clicked-link" : ""
        }`}
        target="_blank"
        rel="noreferrer noopener external"
        href={`https://google.com/search?q=${name}`}
        onClick={() => setGoogleClicked(true)}
      >
        Google
      </Link>
    </>
  );
};
