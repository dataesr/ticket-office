export const getContactUrl = (fromApp: string, mailId: string) => {
  switch (fromApp) {
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
