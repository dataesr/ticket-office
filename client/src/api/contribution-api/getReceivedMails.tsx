import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../utils/fetchJson";

const useReceivedEmails = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["receivedEmails"],
    queryFn: () => fetchJson("/api/get-received-emails"),
  });
  return { data, isLoading, isError, refetch };
};

export default useReceivedEmails;
