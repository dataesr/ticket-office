import { useQuery } from "@tanstack/react-query";

interface Certificate {
  site: string;
  expiration: string;
  joursRestants: number;
  statut: string;
  urgence: "Critique" | "Élevée" | "Moyenne" | "Faible";
  error?: string;
}

interface CertificatesResponse {
  date: string;
  certificats: Certificate[];
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
