import { useState, useEffect } from "react";
import { postHeaders } from "../../config/api";

function useGetContributionData(URL: unknown, reload: unknown) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  console.log(postHeaders);
  useEffect(() => {
    async function getData() {
      const url = URL as RequestInfo;
      try {
        const response = await fetch(url, {
          headers: postHeaders,
        });
        const res = await response.json();
        setData(res);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    getData();
  }, [URL, reload]);

  return { data, isLoading, isError };
}

export default useGetContributionData;
