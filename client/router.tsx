import { Route, Routes } from "react-router-dom";

import Home from "./src/pages/home";
import ApiOperationPage from "./src/pages/api-operation-page/index";
import Layout from "./src/layout";
import React from "react";
import ContactAndContributionPage from "./src/pages/contact-contributionbyobject-page";
import LocalBSO from "./src/pages/bso/index";
import LastMailSent from "./src/pages/last-mails-sent";
import LastMailsReceived from "./src/pages/last-mails-received";
import GetStats from "./src/pages/stats";
import Error404 from "./src/components/errors";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/scanr-contributionPage"
          element={<ContactAndContributionPage />}
        />
        <Route
          path="/scanr-contact"
          element={<ContactAndContributionPage fromApplication="scanR" />}
        />
        <Route
          path="/paysage-contact"
          element={<ContactAndContributionPage fromApplication="paysage" />}
        />
        <Route
          path="/bso-contact"
          element={<ContactAndContributionPage fromApplication="bso" />}
        />
        <Route path="/bso-local" element={<LocalBSO />} />
        <Route
          path="/curiexplore-contact"
          element={<ContactAndContributionPage fromApplication="curiexplore" />}
        />
        <Route
          path="/works-magnet-contact"
          element={
            <ContactAndContributionPage fromApplication="works-magnet" />
          }
        />
        <Route
          path="/datasupr-contact"
          element={<ContactAndContributionPage fromApplication="datasupr" />}
        />
        <Route path="/last-mails-sent" element={<LastMailSent />} />
        <Route path="/last-mails-received" element={<LastMailsReceived />} />
        <Route path="/scanr-apioperations" element={<ApiOperationPage />} />
        <Route
          path="/scanr-removeuser"
          element={<ContactAndContributionPage />}
        />
        <Route
          path="/scanr-namechange"
          element={<ContactAndContributionPage />}
        />
        <Route path="/statistiques" element={<GetStats />} />
        <Route path="*" element={<Error404 error={null} />} />
      </Route>
    </Routes>
  );
}
