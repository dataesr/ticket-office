import { getPagePath } from "../config/api-routes";

export const getContributionLink = (
  collectionName: string,
  fromApplication?: string,
  id?: string
) => {
  const path = getPagePath(collectionName, fromApplication);
  return id
    ? `${path}?page=1&query=${id}&searchInMessage=false&sort=DESC&status=choose`
    : path;
};
