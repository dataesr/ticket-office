import { Route, Routes } from "react-router-dom";

import Home from "./src/pages/home";
import ApiOperationPage from "./src/pages/api-operation-page/link-publications";
<<<<<<< HEAD
import Layout from "./src/layout";
import React from "react";
import ContactAndContributionPage from "./src/pages/contact-contributionbyobject-page";
import LocalBSO from "./src/pages/bso/index";
=======
import ContributionPage from "./src/pages/contribution-page";
import ChangeNamePage from "./src/pages/change-name";
import Layout from "./src/layout";
import RemoveUserPage from "./src/pages/delete-persons";
import React from "react";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
<<<<<<< HEAD
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
        <Route path="/scanr-apioperations" element={<ApiOperationPage />} />
        <Route
          path="/scanr-removeuser"
          element={<ContactAndContributionPage />}
        />
        <Route
          path="/scanr-namechange"
          element={<ContactAndContributionPage />}
        />
=======
          path="/contributionPage"
          element={<ContributionPage url={""} />}
        />
        <Route path="/contact" element={<ContributionPage url={""} />} />
        <Route path="/apioperations" element={<ApiOperationPage url={""} />} />
        <Route path="/removeuser" element={<RemoveUserPage url="" />} />
        <Route path="/namechange" element={<ChangeNamePage url="" />} />
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
      </Route>
    </Routes>
  );
}
