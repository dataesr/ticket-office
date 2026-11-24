export function getTagsUrl(pathname: string): string {
  if (pathname.includes("contributionPage")) return "/api/tags/contribute";
  if (pathname.includes("removeuser")) return "/api/tags/remove-user";
  if (pathname.includes("namechange")) return "/api/tags/update-user-data";
  return "/api/tags/contacts";
}
