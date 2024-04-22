import { Route, Routes } from "react-router-dom";

import Layout from "./layout";
import Home from "./pages/home";
import ContactPage from "./pages/contact-page";
import ApiOperationPage from "./pages/api-operation-page";
import ContributionPage from "./pages/contribution-page";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/contributionPage"
          element={<ContributionPage url={""} />}
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/apioperations" element={<ApiOperationPage />} />
      </Route>
    </Routes>
  );
}
