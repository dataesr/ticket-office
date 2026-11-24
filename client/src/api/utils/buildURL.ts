import { VariationTags } from "../../pages/bso-local-variations/types";
import { escapeRegex } from "./escapeRegex";

export const buildURL = (
  location: { pathname: string },
  sort: string,
  status: string,
  query: string,
  page: number,
  searchInMessages: boolean = true,
  fromApplication?: string,
  max_results: string = "20",
  tags?: VariationTags,
  objectType?: string
): string => {
  let baseUrl = "contacts";

  if (location?.pathname?.includes("scanr-contributionPage")) {
    baseUrl = "contribute";
  } else if (location?.pathname?.includes("removeuser")) {
    baseUrl = "remove-user";
  } else if (location?.pathname?.includes("namechange")) {
    baseUrl = "update-user-data";
  } else if (location?.pathname?.includes("apioperations")) {
    baseUrl = "production";
  } else if (
    location?.pathname?.includes("bso-local-variations-publications")
  ) {
    baseUrl = "bso-local-variations/publications";
  } else if (location?.pathname?.includes("bso-local-variations-datasets")) {
    baseUrl = "bso-local-variations/datasets";
  }

  const sorted = sort === "ASC" ? "sort=created_at" : "sort=-created_at";

  const where: Record<string, unknown> = {};
  if (typeof query === "string" && query.trim() !== "") {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);

    if (isObjectId) {
      where.id = query;
    } else {
      const contains = { $regex: escapeRegex(query), $options: "i" };
      const or: Record<string, unknown>[] =
        baseUrl === "variations"
          ? [
              { "structure.name": contains },
              { "structure.id": contains },
              { "contact.email": contains },
            ]
          : [{ name: contains }, { id: contains }];

      if (searchInMessages) {
        or.push({ message: contains });
      }
      where.$or = or;
    }
  }

  const fromAppQuery = fromApplication
    ? `&fromApplication=${fromApplication.toLocaleLowerCase()}`
    : "";
  if (["new", "ongoing", "treated", "question"].includes(status)) {
    where.status = status;
  }

  if (baseUrl.startsWith("bso-local-variations") && tags) {
    if (["none", "uploaded"].includes(tags?.file))
      where["tags.file"] = tags.file;
    if (["none", "ongoing", "done"].includes(tags?.notification))
      where["tags.notification"] = tags.notification;
  }
  if (baseUrl === "contribute" && objectType && objectType !== "all") {
    where.objectType = { $regex: `^${objectType}$`, $options: "i" };
  }

  const whereQuery =
    Object.keys(where).length > 0
      ? `&where=${encodeURIComponent(JSON.stringify(where))}`
      : "";

  return `/api/${baseUrl}?${sorted}&page=${page}&max_results=${max_results}${whereQuery}${fromAppQuery}`;
};
