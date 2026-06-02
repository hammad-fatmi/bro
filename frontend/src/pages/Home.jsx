import Hero from "@/components/ui/Hero";
import VideoSlider from "@/components/videos/VideoSlider";
import TechMoves from "@/components/news/TechMoves";
import News from "@/components/news/News";
import Trending from "@/components/news/Trending";
import NetworkingNews from "@/components/news/NetworkingNews";

const Home = () => {
    return (
        <div>

            {/* HERO */}
            <Hero />

            {/* VIDEO + TECH MOVES */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-5 gap-6">

                    {/* YOUTUBE 60% */}
                    <div className="lg:col-span-3">
                        <VideoSlider />
                    </div>

                    {/* NETWORKING 40% */}
                    <div className="lg:col-span-2">
                        <NetworkingNews />
                    </div>

                </div>
            </section>



        </div>
    );
};

export default Home;