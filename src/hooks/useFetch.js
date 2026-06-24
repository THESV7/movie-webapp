import axios from "axios";
import { useEffect, useState } from "react";
import { filterAdult } from "../utils/filterAdult";

const useFetch = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // default to true
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(endpoint);
      setData(filterAdult(response.data.results));
    } catch (err) {
      console.log('Fetch error:', err);
      setError(err);
    } finally {
      setLoading(false); // always runs
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]); // re-run when endpoint changes

  return { data, loading, error };
};

export default useFetch;
