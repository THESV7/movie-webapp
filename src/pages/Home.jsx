import { useSelector } from "react-redux";
import BannerHome from "../components/BannerHome";
import HorizontalScrollCard from "../components/HorizontalScrollCard";
import useFetch from "../hooks/useFetch";

const Home = () => {
  const trendingData = useSelector(state => state.movieData.bannerData);
  const imageURL = useSelector(state => state.movieData.imageURL);
  const error = useSelector(state => state.movieData.error);

  const { data: nowPlayingData, loading: loadingNowPlaying } = useFetch("/movie/now_playing");
  const { data: topRatedData, loading: loadingTopRated } = useFetch("/movie/top_rated");
  const { data: popularTvShowData, loading: loadingPopularTv } = useFetch("/tv/popular");
  const { data: onTheAirShowData, loading: loadingOnTheAir } = useFetch("/tv/on_the_air");

  const isLoading = 
    loadingNowPlaying || 
    loadingTopRated || 
    loadingPopularTv || 
    loadingOnTheAir || 
    !trendingData?.length ||
    !imageURL;

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 px-4 text-center text-white">
        <div className="max-w-md p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl backdrop-blur-md">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-3">Connection Failed</h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            We couldn't connect to our servers to load movie details. If you are using mobile data, this service might be restricted by your carrier.
          </p>
          <div className="text-left bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50 mb-6 text-xs text-zinc-400 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span>Try switching to a <strong>Wi-Fi</strong> connection.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span>Turn on a <strong>VPN</strong> to bypass ISP-level restrictions.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span>Change your device's DNS settings to Google DNS or Cloudflare DNS.</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 transform active:scale-95 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full border-4 border-white border-t-red-500 w-12 h-12"></div>
        <p className="ml-4">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <BannerHome />
      <HorizontalScrollCard data={trendingData} heading={"Trending"} trending={true} />
      <HorizontalScrollCard data={nowPlayingData} heading={"Now Playing"} media_type={"movie"} />
      <HorizontalScrollCard data={topRatedData} heading={"Top Rated Movies"} media_type={"movie"} />
      <HorizontalScrollCard data={popularTvShowData} heading={"Popular TV Shows"} media_type={"tv"} />
      <HorizontalScrollCard data={onTheAirShowData} heading={"On The Air"} media_type={"tv"} />
    </div>
  );
};

export default Home;
