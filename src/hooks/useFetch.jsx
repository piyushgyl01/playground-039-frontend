import { useState, useEffect } from "react";

export default function useFetch(url, initalData) {
  const [data, setData] = useState(initalData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(url);
      const result = await res.json();
      setData(result);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, error, loading, refetch: fetchData };
}
