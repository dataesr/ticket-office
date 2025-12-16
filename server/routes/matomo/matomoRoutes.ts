import { Elysia, t } from "elysia";
import { getMatomoSiteId, getMatomoSites } from "../../config/matomo-sites";

const MATOMO_URL = "https://piwik.enseignementsup-recherche.pro/";

const TOKEN = process.env.MATOMO_TOKEN_PROD;

export const matomoRoutes = new Elysia({ prefix: "/matomo" })
  .get("/sites", () => {
    return getMatomoSites();
  })
  .get(
    "/",
    async ({ query }) => {
      try {
        const {
          site,
          method,
          period = "day",
          date = "today",
          lastMinutes,
          filter_limit,
          ...otherParams
        } = query;

        if (!site) {
          return {
            error: true,
            message: "Le paramètre 'site' est requis",
          };
        }

        const siteId = getMatomoSiteId(site);
        if (!siteId) {
          return {
            error: true,
            message: `Site invalide: ${site}`,
          };
        }

        const apiMethod = method
          ? method.includes(".")
            ? method
            : `${method}.get`
          : "VisitsSummary.get";

        const params = new URLSearchParams({
          module: "API",
          method: apiMethod,
          idSite: siteId,
          period,
          date,
          format: "JSON",
          token_auth: TOKEN!,
        });

        if (lastMinutes) params.append("lastMinutes", lastMinutes);
        if (filter_limit) params.append("filter_limit", filter_limit);

        Object.entries(otherParams).forEach(([key, value]) => {
          if (value != null) params.append(key, String(value));
        });

        if (!MATOMO_URL) {
          throw new Error("MATOMO_URL is not defined");
        }
        const url = `${MATOMO_URL.replace(
          /\/$/,
          ""
        )}/index.php?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          return {
            error: true,
            message: `Matomo error: ${response.statusText}`,
            status: response.status,
          };
        }

        const data = await response.json();

        if (
          typeof data === "object" &&
          data !== null &&
          "result" in data &&
          (data as any).result === "error"
        ) {
          return {
            error: true,
            message: (data as any).message,
          };
        }

        return data;
      } catch (error) {
        console.error("Erreur proxy Matomo:", error);
        return {
          error: true,
          message: error instanceof Error ? error.message : "Erreur inconnue",
        };
      }
    },
    {
      query: t.Object({
        site: t.String(),
        method: t.Optional(t.String()),
        period: t.Optional(t.String()),
        date: t.Optional(t.String()),
        lastMinutes: t.Optional(t.String()),
        filter_limit: t.Optional(t.String()),
      }),
    }
  );

export default matomoRoutes;
