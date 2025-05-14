import React from "react";
import { Route, Routes } from "react-router-dom";

import Error404 from "./src/components/errors";
import Layout from "./src/layout";
import ApiOperationPage from "./src/pages/api-operation-page/index";
import BsoLocalVariations from "./src/pages/bso-local-variations/index";
import ContactAndContributionPage from "./src/pages/contact-contributionbyobject-page";
import Home from "./src/pages/home";
import LastMailsReceived from "./src/pages/last-mails-received";
import LastMailSent from "./src/pages/last-mails-sent";
import GetStats from "./src/pages/stats";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          element={<Home />}
          path="/"
        />
        <Route
          element={<ContactAndContributionPage />}
          path="/scanr-contributionPage"
        />
        <Route
          element={<ContactAndContributionPage fromApplication="scanR" />}
          path="/scanr-contact"
        />
        <Route
          element={<ContactAndContributionPage fromApplication="paysage" />}
          path="/paysage-contact"
        />
        <Route
          element={<ContactAndContributionPage fromApplication="bso" />}
          path="/bso-contact"
        />
        <Route
          element={<BsoLocalVariations type="datasets" />}
          path="/bso-local-variations-datasets"
        />
        <Route
          element={<BsoLocalVariations type="publications" />}
          path="/bso-local-variations-publications"
        />
        <Route
          element={<ContactAndContributionPage fromApplication="curiexplore" />}
          path="/curiexplore-contact"
        />
        <Route
          element={<ContactAndContributionPage fromApplication="works-magnet" />}
          path="/works-magnet-contact"
        />
        <Route
          element={<ContactAndContributionPage fromApplication="datasupr" />}
          path="/datasupr-contact"
        />
        <Route
          element={<LastMailSent />}
          path="/last-mails-sent"
        />
        <Route
          element={<LastMailsReceived />}
          path="/last-mails-received"
        />
        <Route
          element={<ApiOperationPage />}
          path="/scanr-apioperations"
        />
        <Route
          element={<ContactAndContributionPage />}
          path="/scanr-removeuser"
        />
        <Route
          element={<ContactAndContributionPage />}
          path="/scanr-namechange"
        />
        <Route
          element={<GetStats />}
          path="/statistiques"
        />
        <Route
          element={<Error404 error={null} />}
          path="*"
        />
      </Route>
    </Routes>
  );
}
