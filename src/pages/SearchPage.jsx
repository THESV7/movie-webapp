import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card";
import { filterAdult } from "../utils/filterAdult";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");

  const query = new URLSearchParams(location.search).get("q") || "";

  const fetchData = async (reset = false) => {
    if (!query) return;

    try {
      setLoading(true);
      setHasSearched(true);

      const response = await axios.get(`/search/multi`, {
        params: {
          query,
          page: reset ? 1 : page,
        },
      });

      const newResults = filterAdult(response.data.results);

      if (reset) {
        setHasMore(newResults.length > 0);
      } else if (newResults.length === 0) {
        setHasMore(false);
      }

      const combined = reset ? newResults : [...data, ...newResults];
      const unique = Array.from(
        new Map(combined.map((item) => [`${item.media_type}-${item.id}`, item])).values()
      );

      setData(unique);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMobileQuery(query); // sync local input with URL query param
    setPage(1);
    setData([]);
    setHasMore(true);
    setHasSearched(false);
    fetchData(true);
  }, [query]);

  useEffect(() => {
    if (page > 1 && hasMore) fetchData();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        hasMore &&
        !loading &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Debounce URL update on mobileQuery changes
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only update URL (navigate) if value differs and is not empty
      if (mobileQuery !== query) {
        if (mobileQuery.trim()) {
          navigate(`/search?q=${encodeURIComponent(mobileQuery)}`);
        } else {
          // Optional: navigate to blank search page if input cleared
          navigate("/search");
        }
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(handler);
  }, [mobileQuery, navigate, query]);

  return (
    <div className="py-16">
      <div className="lg:hidden my-2 mx-1 sticky top-[70px] z-30">
        <input
          type="text"
          placeholder="Search here..."
          value={mobileQuery}
          onChange={(e) => setMobileQuery(e.target.value)}
          className="px-4 py-1 text-lg w-full bg-white rounded-full text-neutral-900"
        />
      </div>

      <div className="container mx-auto">
        <h3 className="capitalize text-lg lg:text-xl font-semibold m-2 my-3">
          Search Results
        </h3>

        {!loading && hasSearched && query && data.length === 0 && (
          <p className="text-center text-neutral-400 text-lg py-10">
            No results found for "<span className="font-semibold">{query}</span>"
          </p>
        )}

        {loading && page === 1 ? (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black text-white">
            <div className="animate-spin rounded-full border-4 border-white border-t-red-500 w-12 h-12 mr-3"></div>
            <span className="text-lg">Loading results...</span>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start">
            {data.map((searchData) => (
              <Card
                key={`${searchData.media_type}-${searchData.id}`}
                data={searchData}
                media_type={searchData.media_type}
              />
            ))}
          </div>
        )}

        {loading && page > 1 && hasMore && (
          <div className="text-center py-4 text-white">Loading more...</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
