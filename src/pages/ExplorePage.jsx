import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Card from "../components/Card";

const ExplorePage = () => {
  const params = useParams();
  const [pageNo, setPageNo] = useState(1);
  const [data, setData] = useState([]);
  const [totalPageNo, setTotalPageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchData = async (overridePage = null) => {
    const currentPage = overridePage ?? pageNo;

    if (loading || !params.explore || (params.explore !== "tv" && params.explore !== "movie")) return;
    if (totalPageNo > 0 && currentPage > totalPageNo) return;

    try {
      setLoading(true);

      const response = await axios.get(`/discover/${params.explore}`, {
        params: { page: currentPage },
      });

      const newResults = response.data.results || [];

      setData((prev) => {
        const combined = [...prev, ...newResults];
        const unique = Array.from(
          new Map(combined.map((item) => [item.id, item])).values()
        );
        return unique;
      });

      setTotalPageNo(response.data.total_pages || 1);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    } finally {
      setLoading(false);
      if (currentPage === 1) {
        setInitialLoading(false);
      }
    }
  };

  // When route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setData([]);
    setTotalPageNo(0);
    setInitialLoading(true);

    // Directly call fetchData with page = 1
    fetchData(1);
    setPageNo(1);
  }, [params.explore]);

  // When user scrolls and triggers next page
  useEffect(() => {
    if (pageNo === 1) return; // already fetched manually on route change
    fetchData();
  }, [pageNo]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        totalPageNo > 0 &&
        pageNo < totalPageNo &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
      ) {
        setPageNo((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, pageNo, totalPageNo]);

  if (params.explore !== "tv" && params.explore !== "movie") {
    return <Navigate to="/" replace />;
  }

  if (initialLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full border-4 border-white border-t-red-500 w-12 h-12"></div>
        <p className="ml-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto">
        <h3 className="capitalize text-lg lg:text-xl font-semibold m-2 my-3">
          Popular {params.explore === "tv" ? "TV Shows" : "Movies"}
        </h3>

        <div className="grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center">
          {data.map((exploreData) => (
            <Card
              key={exploreData.id + "exploreSection"}
              data={exploreData}
              media_type={params.explore}
            />
          ))}
        </div>

        {loading && pageNo > 1 && (
          <div className="text-center py-4 text-white">Loading more...</div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
