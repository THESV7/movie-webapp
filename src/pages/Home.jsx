import { useSelector } from "react-redux";
import BannerHome from "../components/BannerHome";
import HorizontalScrollCard from "../components/HorizontalScrollCard";
import useFetch from "../hooks/useFetch";

const Home = () => {
  const trendingData = useSelector(state => state.movieData.bannerData);
  const imageURL = useSelector(state => state.movieData.imageURL);

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
