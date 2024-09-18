import { Route, Routes } from "react-router-dom";

import Home from "./src/pages/home";
import ApiOperationPage from "./src/pages/api-operation-page/link-publications";
import ContributionPage from "./src/pages/contribution-page";
import ChangeNamePage from "./src/pages/change-name";
import Layout from "./src/layout";
import RemoveUserPage from "./src/pages/delete-persons";
import React from "react";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/scanr-contributionPage" element={<ContributionPage />} />
        <Route
          path="/scanr-contact"
          element={<ContributionPage fromApp="scanr" />}
        />
        <Route
          path="/paysage-contact"
          element={<ContributionPage fromApp="paysage" />}
        />
        <Route
          path="/bso-contact"
          element={<ContributionPage fromApp="bso" />}
        />
        <Route
          path="/curiexplore-contact"
          element={<ContributionPage fromApp="curiexplore" />}
        />
        <Route
          path="/datasupr-contact"
          element={<ContributionPage fromApp="paysage" />}
        />
        <Route path="/scanr-apioperations" element={<ApiOperationPage />} />
        <Route path="/scanr-removeuser" element={<RemoveUserPage url="" />} />
        <Route path="/scanr-namechange" element={<ChangeNamePage url="" />} />
      </Route>
    </Routes>
  );
}
