import { useQuery } from "@tanstack/react-query";
import { postHeaders } from "../../config/api";

const useSentEmails = () => {
  const fetchSentEmails = async () => {
    const response = await fetch("/api/get-sent-emails", {
      headers: postHeaders,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["sentEmails"],
    queryFn: fetchSentEmails,
  });
  return { data, isLoading, isError, refetch };
};

export default useSentEmails;
