import { Link } from "@dataesr/dsfr-plus";
import { useState } from "react";
import {
  findLandingPage,
  getScanRPath,
} from "../../utils/normalized-id-productions";
import { ExternalLinksProps } from "../../types";

export const ExternalLinks: React.FC<ExternalLinksProps> = ({
  productionId,
  name,
  landingPages = {},
}) => {
  const formattedProductionId = productionId.replace(/\//g, "%2f");
  const [googleClicked, setGoogleClicked] = useState(false);
  const [scanRClicked, setScanRClicked] = useState(false);
  const [landingPageClicked, setLandingPageClicked] = useState(false);

  const landingPage = findLandingPage(productionId, landingPages);
  const scanRPath = getScanRPath(productionId);

  return (
    <>
      <Link
        className={`fr-ml-2w fr-footer__content-link ${
          scanRClicked ? "clicked-link" : ""
        }`}
        target="_blank"
        rel="noreferrer noopener external"
        href={`https://scanr.enseignementsup-recherche.gouv.fr/${scanRPath}/${formattedProductionId}`}
        onClick={() => setScanRClicked(true)}
      >
        scanR
      </Link>

      {landingPage && (
        <Link
          className={`fr-ml-2w fr-mr-2w fr-footer__content-link ${
            landingPageClicked ? "clicked-link" : ""
          }`}
          target="_blank"
          rel="noreferrer noopener external"
          href={landingPage}
          onClick={() => setLandingPageClicked(true)}
        >
          Éditeur
        </Link>
      )}

      <Link
        className={`fr-ml-2w fr-footer__content-link ${
          googleClicked ? "clicked-link" : ""
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
