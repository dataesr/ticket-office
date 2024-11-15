export function generateLinkFromAllDatas(
  collectionName: string,
  fromApplication?: string,
  id?: string,
  objectId?: boolean,
  productions?: Array<any>,
  message?: string
): string {
  const basePathMap: { [key: string]: { [key: string]: string } | string } = {
    contacts: {
      scanr: "/scanr-contact",
      paysage: "/paysage-contact",
      bso: "/bso-contact",
      curiexplore: "/curiexplore-contact",
      "works-magnet": "/works-magnet-contact",
      datasupr: "/datasupr-contact",
    },
    contribute_production: "/scanr-apioperations",
    "remove-user": "/scanr-removeuser",
    "update-user-data": "/scanr-namechange",
    contribute: "/scanr-contributionPage",
  };

  let basePath = "";
  if (productions?.length > 0 && message === undefined) {
    basePath = "/scanr-apioperations";
  } else if (objectId) {
    basePath = "/scanr-contributionPage";
  } else if (fromApplication) {
    basePath = "/scanr-contact";
  } else {
    basePath = (basePathMap[collectionName] as string) || "";
  }

  return id
    ? `${basePath}?page=1&query=${id}&searchInMessage=false&sort=DESC&status=choose`
    : basePath;
}
