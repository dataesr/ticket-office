import { Route, Routes } from "react-router-dom";

import Home from "./src/pages/home";
import ApiOperationPage from "./src/pages/api-operation-page/link-publications";
import Layout from "./src/layout";
import React from "react";
import ContactAndContributionPage from "./src/pages/contact-contributionbyobject-page";

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
          element={<ContactAndContributionPage fromApp="scanR" />}
        />
        <Route
          path="/paysage-contact"
          element={<ContactAndContributionPage fromApp="paysage" />}
        />
        <Route
          path="/bso-contact"
          element={<ContactAndContributionPage fromApp="bso" />}
        />
        <Route
          path="/curiexplore-contact"
          element={<ContactAndContributionPage fromApp="curiexplore" />}
        />
        <Route
          path="/works-magnet-contact"
          element={<ContactAndContributionPage fromApp="works-magnet" />}
        />
        <Route
          path="/datasupr-contact"
          element={<ContactAndContributionPage fromApp="datasupr" />}
        />
        <Route path="/scanr-apioperations" element={<ApiOperationPage />} />
        <Route
          path="/scanr-removeuser"
          element={<ContactAndContributionPage />}
        />
        <Route
          path="/scanr-namechange"
          element={<ContactAndContributionPage />}
        />
      </Route>
    </Routes>
  );
}
