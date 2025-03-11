import { useQuery } from "@tanstack/react-query";
import { postHeaders } from "../../config/api";

const useReceivedEmails = () => {
  const fetchReceivedEmails = async () => {
    const response = await fetch("/api/get-received-emails", {
      headers: postHeaders,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["receivedEmails"],
    queryFn: fetchReceivedEmails,
  });
  return { data, isLoading, isError, refetch };
};

export default useReceivedEmails;
