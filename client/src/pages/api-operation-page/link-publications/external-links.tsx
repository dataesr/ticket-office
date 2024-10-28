import { Link } from "@dataesr/dsfr-plus";
import { useState } from "react";
import LandingPage from "../../../api/contribution-api/getLandingPage";

export const ExternalLinks = ({ productionId, name }) => {
  const formattedProductionId = productionId.replace(/\//g, "%2f");
  const [google, setGoogleClicked] = useState(false);
  const [scanRClicked, setScanRClicked] = useState(false);
  const [landingPageClicked, setLandingPageClicked] = useState(false);
  const { landingPage } = LandingPage(productionId);

  const scanRPath =
    formattedProductionId.length >= 7 && formattedProductionId.length <= 9
      ? "patents"
      : "publications";

  return (
    <>
      <Link
        className={` fr-ml-2w  fr-footer__content-link ${
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
          className={` fr-ml-2w fr-mr-2w fr-footer__content-link ${
            landingPageClicked ? "clicked-link" : ""
          }`}
          target="_blank"
          rel="noreferrer noopener external"
          href={landingPage}
          onClick={() => setLandingPageClicked(true)}
        >
          Editeur
        </Link>
      )}
      <Link
        className={`fr-ml-2w fr-footer__content-link ${
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
