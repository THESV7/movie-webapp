import axios from "axios";
import { useEffect, useState } from "react";

const useFetchDetails = (endpoint) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(endpoint);
      setData(response.data);
    } catch (err) {
      console.log("error", err);
      setError(err);
    } finally {
      setLoading(false); // Ensure loading is turned off even on error
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetchDetails;
