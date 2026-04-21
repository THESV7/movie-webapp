import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

const BannerHome = () => {
    const bannerData = useSelector((state) => state.movieData.bannerData);
    const imageURL = useSelector((state) => state.movieData.imageURL);
    const [currentImage, setCurrentImage] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const handleNext = () => {
        if (currentImage < bannerData.length - 1) {
            setCurrentImage((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentImage > 0) {
            setCurrentImage((prev) => prev - 1);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentImage < bannerData.length - 1) {
                handleNext();
            } else {
                setIsTransitioning(false);
                setCurrentImage(0);
                setTimeout(() => {
                    setIsTransitioning(true);
                }, 50);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [bannerData, currentImage]);

    if (!bannerData.length || !imageURL) return null;

    return (
        <section className="w-full h-[450px] lg:h-[80vh]">
            <div className="flex h-full w-full overflow-hidden">
                {bannerData.map((data, index) => {
                    // console.log("data",data);

                    return (
                        <div
                            key={data.id + "bannerHome" + index}
                            className={`min-w-full h-full overflow-hidden relative group ${isTransitioning ? "transition-all" : ""
                                } `}
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                        >
                            <div className="w-full h-full">
                                <img
                                    src={imageURL + data.backdrop_path}
                                    alt={data.name || data.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/** button next and previous image */}
                            <div className="absolute top-0 w-full h-full hidden items-center justify-between px-4 group-hover:lg:flex">
                                <button
                                    onClick={handlePrevious}
                                    className="bg-white p-1 rounded-full text-xl z-10 text-black"
                                >
                                    <FaAngleLeft />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="bg-white p-1 rounded-full text-xl z-10 text-black"
                                >
                                    <FaAngleRight />
                                </button>
                            </div>

                            <div className="absolute top-0 w-full h-full bg-gradient-to-t from-neutral-900 to-transparent"></div>

                            <div className="container mx-auto">
                                <div className=" w-full absolute bottom-0 max-w-md px-3">
                                    <h2 className="font-bold text-2xl lg:text-4xl text-white drop-shadow-2xl">
                                        {data.name || data.title}
                                    </h2>
                                    <p className="text-ellipsis line-clamp-3 my-2">
                                        {data.overview}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <p>Rating : {Number(data?.vote_average ?? 0).toFixed(1)}+</p>
                                        <span>|</span>
                                        <p>View : {Number(data.popularity).toFixed(0)}</p>
                                    </div>
                                    <Link
                                        to={"/"+data?.media_type+"/"+data.id}
                                        className="inline-block bg-white px-4 py-2 text-black font-bold rounded mt-4 cursor-pointer hover:bg-gradient-to-l from-red-700 to-orange-500 shadow-md transition-all hover:scale-105 no-underline"
                                    >
                                        Play Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default BannerHome;
