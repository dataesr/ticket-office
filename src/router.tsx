import { Route, Routes } from "react-router-dom";

import Home from "./pages/home";
import ApiOperationPage from "./pages/api-operation-page/link-publications";
import ContributionPage from "./pages/contribution-page";
import DeletePage from "./pages/delete-persons";
import ChangeNamePage from "./pages/change-name";
import Layout from "./layout";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/contributionPage"
          element={<ContributionPage url={""} />}
        />
        <Route path="/contact" element={<ContributionPage url={""} />} />
        <Route path="/apioperations" element={<ApiOperationPage url={""} />} />
        <Route path="/delete" element={<DeletePage />} />
        <Route path="/namechange" element={<ChangeNamePage />} />
      </Route>
    </Routes>
  );
}
