<<<<<<< HEAD
<<<<<<< HEAD
export const getContactUrl = (fromApplication: string, mailId: string) => {
  switch (fromApplication) {
=======
export const getContactUrl = (fromApp: string, mailId: string) => {
  switch (fromApp) {
>>>>>>> 9e0ca29 (fix(router): update router and create works magnet contact page)
=======
export const getContactUrl = (fromApplication: string, mailId: string) => {
  switch (fromApplication) {
>>>>>>> 1fc81a3 (feat(api): add extra and change scripts)
    case "scanr":
      return `/scanr-contact?query=${mailId}`;
    case "paysage":
      return `/paysage-contact?query=${mailId}`;
    case "bso":
      return `/bso-contact?query=${mailId}`;
    default:
      return `/contact?query=${mailId}`;
  }
};
