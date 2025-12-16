import { useQuery } from "@tanstack/react-query";

interface MatomoVisitsSummary {
  nb_visits: number;
  nb_uniq_visitors?: number;
  nb_actions: number;
  nb_actions_per_visit: number;
  bounce_rate: string;
  bounce_count: number;
  avg_time_on_site: number;
  sum_visit_length: number;
  max_actions: number;
  nb_visits_converted: number;
}

interface MatomoPageUrl {
  label: string;
  nb_visits: number;
  nb_hits: number;
  sum_time_spent: number;
  avg_time_on_page: number;
  bounce_rate: string;
  exit_rate: string;
}

interface MatomoReferrer {
  label: string;
  nb_visits: number;
  nb_uniq_visitors?: number;
}

interface MatomoDeviceType {
  label: string;
  nb_visits: number;
  nb_actions: number;
}

interface MatomoOS {
  label: string;
  nb_visits: number;
  nb_actions?: number;
}

interface MatomoRegion {
  label: string;
  nb_visits: number;
  nb_uniq_visitors?: number;
}

interface MatomoCity {
  label: string;
  nb_visits: number;
  nb_uniq_visitors?: number;
}

interface UseMatomoStatsOptions {
  site: string;
  period?: "day" | "week" | "month" | "year" | "range";
  date?: string;
}

export const useMatomoStats = ({
  site,
  period = "day",
  date = "today",
}: UseMatomoStatsOptions) => {
  return useQuery<MatomoVisitsSummary>({
    queryKey: ["matomo-stats", site, period, date],
    queryFn: async () => {
      const params = new URLSearchParams({
        site,
        method: "VisitsSummary.get",
        period,
        date,
      });

      const url = `/api/matomo?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.message);
      }

      return data;
    },
    retry: false,
    refetchInterval: false,
    staleTime: Infinity,
  });
};

export const useMatomoTopPages = ({
  site,
  period = "day",
  date = "today",
}: UseMatomoStatsOptions) => {
  return useQuery<MatomoPageUrl[]>({
    queryKey: ["matomo-top-pages", site, period, date],
    queryFn: async () => {
      const params = new URLSearchParams({
        site,
        method: "Actions.getPageUrls",
        period,
        date,
        filter_limit: "5",
      });

      const url = `/api/matomo?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useMatomoReferrers = ({
  site,
  period = "day",
  date = "today",
}: UseMatomoStatsOptions) => {
  return useQuery<MatomoReferrer[]>({
    queryKey: ["matomo-referrers", site, period, date],
    queryFn: async () => {
      const params = new URLSearchParams({
        site,
        method: "Referrers.getReferrerType",
        period,
        date,
      });

      const url = `/api/matomo?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useMatomoDevices = ({
  site,
  period = "day",
  date = "today",
}: UseMatomoStatsOptions) => {
  return useQuery<MatomoDeviceType[]>({
    queryKey: ["matomo-devices", site, period, date],
    queryFn: async () => {
      const params = new URLSearchParams({
        site,
        method: "DevicesDetection.getType",
        period,
        date,
      });

      const url = `/api/matomo?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useMatomoOS = ({
  site,
  period = "day",
  date = "today",
}: UseMatomoStatsOptions) => {
  return useQuery<MatomoOS[]>({
    queryKey: ["matomo-os", site, period, date],
    queryFn: async () => {
      const params = new URLSearchParams({
        site,
        method: "DevicesDetection.getOsFamilies",
        period,
        date,
      });

      const url = `/api/matomo?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useMatomoEvolution = ({
  site,
  period = "day",
  date = "last30",
}: UseMatomoStatsOptions) => {
  return useQuery<Record<string, MatomoVisitsSummary>>({
    queryKey: ["matomo-evolution", site, period, date],
    queryFn: async () => {
      const params = new URLSearchParams({
        site,
        method: "VisitsSummary.get",
        period,
        date,
      });

      const url = `/api/matomo?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.message);
      }

      return data;
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useMatomoRegions = ({
  site,
  period = "day",
  date = "today",
}: UseMatomoStatsOptions) => {
  return useQuery<MatomoRegion[]>({
    queryKey: ["matomo-regions", site, period, date],
    queryFn: async () => {
      const params = new URLSearchParams({
        site,
        method: "UserCountry.getRegion",
        period,
        date,
      });

      const url = `/api/matomo?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useMatomoCities = ({
  site,
  period = "day",
  date = "today",
}: UseMatomoStatsOptions) => {
  return useQuery<MatomoCity[]>({
    queryKey: ["matomo-cities", site, period, date],
    queryFn: async () => {
      const params = new URLSearchParams({
        site,
        method: "UserCountry.getCity",
        period,
        date,
      });

      const url = `/api/matomo?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    retry: false,
    staleTime: Infinity,
  });
};
