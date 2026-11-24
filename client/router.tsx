import React from "react";
import { Route, Routes } from "react-router-dom";

import Error404 from "./src/components/errors";
import Layout from "./src/layout";
import BsoLocalVariations from "./src/pages/bso-local-variations/index";
import Certificats from "./src/pages/certificats";
import Home from "./src/pages/home";
import LastMailsReceived from "./src/pages/last-mails-received";
import LastMailSent from "./src/pages/last-mails-sent";
import ScanrContact from "./src/pages/scanr/contact";
import ScanrNameChange from "./src/pages/scanr/name-change";
import ScanrObjectContributions from "./src/pages/scanr/object-contributions";
import ScanrProductions from "./src/pages/scanr/productions";
import ScanrRemoveUser from "./src/pages/scanr/remove-user";
import GetStats from "./src/pages/stats";
import TableauxContact from "./src/pages/tableaux";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<Home />} path="/" />
        <Route
          element={<ScanrObjectContributions />}
          path="/scanr-contributionPage"
        />
        <Route element={<ScanrContact />} path="/scanr-contact" />
        <Route element={<ScanrProductions />} path="/scanr-apioperations" />
        <Route element={<ScanrRemoveUser />} path="/scanr-removeuser" />
        <Route element={<ScanrNameChange />} path="/scanr-namechange" />
        <Route
          element={<BsoLocalVariations type="datasets" />}
          path="/bso-local-variations-datasets"
        />
        <Route
          element={<BsoLocalVariations type="publications" />}
          path="/bso-local-variations-publications"
        />
        <Route element={<TableauxContact />} path="/tableaux-contact" />
        <Route element={<LastMailSent />} path="/last-mails-sent" />
        <Route element={<LastMailsReceived />} path="/last-mails-received" />
        <Route element={<GetStats />} path="/statistiques" />
        <Route element={<Certificats />} path="/certificats" />
        <Route element={<Error404 error={null} />} path="*" />
      </Route>
    </Routes>
  );
}
