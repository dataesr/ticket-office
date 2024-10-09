export const getContactUrl = (fromApplication: string, mailId: string) => {
  switch (fromApplication) {
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
