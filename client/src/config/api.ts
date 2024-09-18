<<<<<<< HEAD
const API_KEY = import.meta.env.VITE_TICKET_OFFICE_API_AUTHORIZATION || "";
=======
const API_KEY = import.meta.env.VITE_SCANR_API_AUTHORIZATION || "";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
const isDevelopment = import.meta.env.VITE_HEADER_TAG === "Development";
export const headers = API_KEY ? { Authorization: `Basic ${API_KEY}` } : {};
export const postHeaders = {
  ...headers,
  "Content-Type": "application/json",
};

export const contributionUrl = isDevelopment
  ? "http://localhost:3000/api/contribute?max_results=2000"
<<<<<<< HEAD
<<<<<<< HEAD
  : "https://ticket-office.staging.dataesr.ovh/api/contribute?max_results=2000";

export const contactUrl = isDevelopment
  ? "http://localhost:3000/api/contacts?max_results=2000"
  : "https://ticket-office.staging.dataesr.ovh/api/contacts?max_results=2000";

export const productionUrl = isDevelopment
  ? "http://localhost:3000/api/production?max_results=2000"
  : "https://ticket-office.staging.dataesr.ovh/api/productionsmax_results=2000";

export const nameChangeUrl = isDevelopment
  ? "http://localhost:3000/api/update-user-data?max_results=2000"
  : "https://ticket-office.staging.dataesr.ovh/api/update-user-datamax_results=2000";

export const removeUserUrl = isDevelopment
  ? "http://localhost:3000/api/remove-user?max_results=2000"
  : "https://ticket-office.staging.dataesr.ovh/api/remove-usermax_results=2000";
=======
  : "https://ticket-office-api.staging.dataesr.ovh/api/contribute?max_results=2000";
=======
  : "https://ticket-office.staging.dataesr.ovh/api/contribute?max_results=2000";
>>>>>>> 00d3d37 (fix(api): change url for request on staging)

export const contactUrl = isDevelopment
  ? "http://localhost:3000/api/contact?max_results=2000"
  : "https://ticket-office.staging.dataesr.ovh/api/contact?max_results=2000";

export const productionUrl = isDevelopment
  ? "http://localhost:3000/api/production?max_results=2000"
  : "https://ticket-office.staging.dataesr.ovh/api/productionsmax_results=2000";

export const nameChangeUrl = isDevelopment
  ? "http://localhost:3000/api/update-user-data?max_results=2000"
  : "https://ticket-office.staging.dataesr.ovh/api/update-user-datamax_results=2000";

export const removeUserUrl = isDevelopment
  ? "http://localhost:3000/api/remove-user?max_results=2000"
<<<<<<< HEAD
  : "https://ticket-office-api.staging.dataesr.ovh/api/remove-usermax_results=2000";
>>>>>>> 3fa33f3 (refactor(ci): mix ui and api in one repo)
=======
  : "https://ticket-office.staging.dataesr.ovh/api/remove-usermax_results=2000";
>>>>>>> 00d3d37 (fix(api): change url for request on staging)
