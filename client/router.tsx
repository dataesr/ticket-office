import { Route, Routes } from "react-router-dom";

import Home from "./src/pages/home";
import ApiOperationPage from "./src/pages/api-operation-page/link-publications";
<<<<<<< HEAD
<<<<<<< HEAD
import Layout from "./src/layout";
import React from "react";
import ContactAndContributionPage from "./src/pages/contact-contributionbyobject-page";
import LocalBSO from "./src/pages/bso/index";
=======
import ContributionPage from "./src/pages/contribution-page";
import ChangeNamePage from "./src/pages/change-name";
=======
>>>>>>> 9e0ca29 (fix(router): update router and create works magnet contact page)
import Layout from "./src/layout";
import React from "react";
<<<<<<< HEAD
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
import ContactAndContributionPage from "./src/pages/contact-contributionbyobject-page";
>>>>>>> 9e0ca29 (fix(router): update router and create works magnet contact page)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          path="/scanr-contributionPage"
          element={<ContactAndContributionPage />}
        />
        <Route
          path="/scanr-contact"
<<<<<<< HEAD
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
=======
          path="/scanr-contributionPage"
          element={<ContributionPage url={""} />}
=======
          path="/scanr-contact"
<<<<<<< HEAD
          element={<ContributionPage fromApp="scanr" />}
>>>>>>> 57156e2 (fix(navigation): contact navigation updated)
=======
          element={<ContributionPage fromApp="scanR" />}
>>>>>>> 2e9190f (fix(api): update schemas)
=======
          element={<ContactAndContributionPage fromApp="scanR" />}
>>>>>>> 9e0ca29 (fix(router): update router and create works magnet contact page)
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
          element={<ContactAndContributionPage fromApp="paysage" />}
        />
        <Route path="/scanr-apioperations" element={<ApiOperationPage />} />
<<<<<<< HEAD
<<<<<<< HEAD
        <Route path="/scanr-removeuser" element={<RemoveUserPage url="" />} />
        <Route path="/scanr-namechange" element={<ChangeNamePage url="" />} />
>>>>>>> 2b4b0b9 (feat(script): add new script to the scanr as fromApp and update nav in ui)
=======
        <Route path="/scanr-removeuser" element={<RemoveUserPage />} />
        <Route path="/scanr-namechange" element={<ChangeNamePage />} />
>>>>>>> f850256 (fix(router): update router, clean types, and requier things in post schema)
=======
        <Route
          path="/scanr-removeuser"
          element={<ContactAndContributionPage />}
        />
        <Route
          path="/scanr-namechange"
          element={<ContactAndContributionPage />}
        />
>>>>>>> 9e0ca29 (fix(router): update router and create works magnet contact page)
      </Route>
    </Routes>
  );
}
