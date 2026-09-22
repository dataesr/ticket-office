import { useQuery } from "@tanstack/react-query";

interface Certificate {
  error?: string;
  expiration: string;
  joursRestants: number;
  site: string;
  statut: string;
  urgence: "Critique" | "Élevée" | "Moyenne" | "Faible";
}

interface CertificatesResponse {
  certificates: Certificate[];
  date: string;
}

export const useCertificates = () => {
  return useQuery<CertificatesResponse>({
    queryKey: ["certificates"],
    queryFn: async () => {
      const res = await fetch("/api/certificats");

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
