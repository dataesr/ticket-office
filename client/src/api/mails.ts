import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "./utils/fetchJson";

export const useSentEmails = () =>
  useQuery({
    queryKey: ["sentEmails"],
    queryFn: () => fetchJson("/api/get-sent-emails"),
  });

export const useReceivedEmails = () =>
  useQuery({
    queryKey: ["receivedEmails"],
    queryFn: () => fetchJson("/api/get-received-emails"),
  });
