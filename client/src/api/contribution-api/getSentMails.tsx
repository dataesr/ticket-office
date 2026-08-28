import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../utils/fetchJson";

const useSentEmails = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["sentEmails"],
    queryFn: () => fetchJson("/api/get-sent-emails"),
  });
  return { data, isLoading, isError, refetch };
};

export default useSentEmails;
