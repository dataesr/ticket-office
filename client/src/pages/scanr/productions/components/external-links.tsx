import { Link } from "@dataesr/dsfr-plus";
import { useState } from "react";
import {
  findByProductionId,
  getScanRPath,
} from "../../../../utils/normalized-id-productions";
import { ExternalLinksProps } from "../../../../types";

export const ExternalLinks: React.FC<ExternalLinksProps> = ({
  productionId,
  name,
  landingPages = {},
}) => {
  const formattedProductionId = productionId.replace(/\//g, "%2f");
  const [googleClicked, setGoogleClicked] = useState(false);
  const [scanRClicked, setScanRClicked] = useState(false);
  const [landingPageClicked, setLandingPageClicked] = useState(false);

  const landingPage = findByProductionId(productionId, landingPages);
  const scanRPath = getScanRPath(productionId);

  return (
    <>
      <Link
        className="fr-mr-2w"
        size="sm"
        icon={scanRClicked ? "check-line" : undefined}
        iconPosition="left"
        target="_blank"
        rel="noreferrer noopener external"
        href={`https://scanr.enseignementsup-recherche.gouv.fr/${scanRPath}/${formattedProductionId}`}
        onClick={() => setScanRClicked(true)}
      >
        scanR
      </Link>

      {landingPage && (
        <Link
          className="fr-mr-2w"
          size="sm"
          icon={landingPageClicked ? "check-line" : undefined}
          iconPosition="left"
          target="_blank"
          rel="noreferrer noopener external"
          href={landingPage}
          onClick={() => setLandingPageClicked(true)}
        >
          Éditeur
        </Link>
      )}

      <Link
        size="sm"
        icon={googleClicked ? "check-line" : undefined}
        iconPosition="left"
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
