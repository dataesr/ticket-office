import { useState, useEffect } from "react";

function useGetContributionData(URL: {}, reload: unknown) {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const { VITE_SCANR_API_AUTHORIZATION } = import.meta.env;

  useEffect(() => {
    async function getData() {
      const url = URL;
      try {
        const response = await fetch(url as RequestInfo, {
          headers: {
            Authorization: VITE_SCANR_API_AUTHORIZATION,
            "Content-Type": "application/json",
          },
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
    console.log(data);
  }, [URL, reload]);

  return { data, isLoading, isError };
}

export default useGetContributionData;
