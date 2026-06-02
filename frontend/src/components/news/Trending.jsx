import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "./NewsCard";

const Trending = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/news/trending"
      );

      setNews(response.data.data);
    } catch (error) {
      console.error("Failed to fetch trending:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-black px-6 py-24">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-7xl">
        {/* PREMIUM VERTICAL PLATINUM FADE */}
        <h1 className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)]">
          Trending Now
        </h1>

        <p className="mt-3 text-zinc-400 text-sm font-medium max-w-2xl">
          The hottest tech stories ranked by activity, relevance, and recency.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : (
        <>
          {/* Featured Top Story Banner */}
          {news.length > 0 && (
            <div className="mx-auto mb-12 max-w-7xl">
              {/* Upgraded to matching Frosted Luxury Glass Card */}
              <div className="rounded-3xl border border-white/[0.08] bg-neutral-950/40 backdrop-blur-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                
                {/* Premium Platinum Accent Tag */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold tracking-[0.15em] text-zinc-300 uppercase shadow-sm">
                  <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  Top Story
                </div>
                
                <p className="mt-4 text-xl md:text-2xl font-bold text-white tracking-tight leading-relaxed max-w-4xl">
                  {news[0].title}
                </p>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {news.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
              />
            ))}
          </div>

          {/* Empty State */}
          {news.length === 0 && (
            <div className="mt-20 text-center text-zinc-500">
              No trending news available.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Trending;