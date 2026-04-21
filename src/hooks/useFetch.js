import axios from "axios";
import { useEffect, useState } from "react";
import { filterAdult } from "../utils/filterAdult";

const useFetch = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // default to true

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(endpoint);
      setData(filterAdult(response.data.results));
    } catch (error) {
      console.log('Fetch error:', error);
    } finally {
      setLoading(false); // always runs
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]); // re-run when endpoint changes

  return { data, loading };
};

export default useFetch;
