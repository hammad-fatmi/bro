import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VideoSlider = () => {
    const [videos, setVideos] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch("/api/youtube");
                if (!res.ok) {
                    throw new Error(`HTTP Error ${res.status}`);
                }
                const text = await res.text();
                console.log("RAW RESPONSE:", text);
                //33333333333333333333333333333333333333333333333333333
                //const data = await res.json();
                const response = JSON.parse(text);

                console.log("YOUTUBE RESPONSE:", response);

                const videos = response.data || [];

                const filteredVideos = videos.filter(
                    (video) =>
                        !video.title?.toLowerCase().includes("#shorts") &&
                        !video.title?.toLowerCase().includes("shorts")
                );


                console.log("VIDEOS RECEIVED:");
                filteredVideos.forEach((v, i) => {
                    console.log(i, v.videoId, v.title);
                });

                setVideos(filteredVideos);
                console.log("FILTERED VIDEOS:", filteredVideos);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    useEffect(() => {
        if (!videos.length) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % videos.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [videos]);
    console.log("CURRENT INDEX:", index);
    console.log("CURRENT VIDEO:", videos[index]?.title);
    const current = videos[index];

    if (loading) {
        return (
            <div className="text-white py-6">
                Loading videos...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 py-6">
                Error: {error}
            </div>
        );
    }

    if (!videos.length) {
        return (
            <div className="text-white py-6">
                No videos found
            </div>
        );
    }

    return (
        <section className="w-full">
            <h2 className="text-white text-3xl font-bold mb-6">
                Innovation Insider
            </h2>

            <AnimatePresence mode="wait">
                {current && (
                    <motion.div
                        key={current.videoId}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => setSelectedVideo(current)}
                        className="w-full bg-zinc-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer transition duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
                    >
                        {/* THUMBNAIL */}
                        {/* THUMBNAIL */}
                        <div className="relative aspect-video overflow-hidden bg-black group">

                            <img
                                src={current.thumbnail}
                                alt={current.title}
                                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                            />

                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                            {/* Cyan Shine */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.35)]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-8 h-8 text-cyan-300 ml-1"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Bottom Glow */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cyan-500/10 to-transparent" />

                        </div>

                        {/* CONTENT */}
                        <div className="p-4">
                            <h3 className="text-white text-lg font-semibold line-clamp-2">
                                {current.title}
                            </h3>

                            <p className="text-cyan-400 text-sm mt-2">
                                {current.channel}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DOTS */}
            <div className="flex gap-2 mt-4">
                {videos.map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition ${i === index
                            ? "bg-cyan-400"
                            : "bg-zinc-600"
                            }`}
                    />
                ))}
            </div>

            {/* MODAL */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
                    <div className="bg-zinc-900 w-full max-w-4xl rounded-xl overflow-hidden border border-white/10">

                        <iframe
                            className="w-full aspect-video"
                            src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                            title={selectedVideo.title}
                            allowFullScreen
                        />

                        <div className="p-5">
                            <h2 className="text-white font-bold text-xl">
                                {selectedVideo.title}
                            </h2>

                            <p className="text-gray-400 text-sm mt-3">
                                {selectedVideo.description}
                            </p>

                            <div className="flex justify-between items-center mt-5">
                                <button
                                    onClick={() =>
                                        setSelectedVideo(null)
                                    }
                                    className="px-4 py-2 bg-red-500 rounded text-white"
                                >
                                    Close
                                </button>

                                <a
                                    href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-400 text-sm"
                                >
                                    Watch on YouTube →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default VideoSlider;