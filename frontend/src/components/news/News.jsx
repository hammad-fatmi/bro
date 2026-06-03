import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "./NewsCard";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await axios.get("/api/news");

      console.log("API RESPONSE:", response.data);

      // ✅ SAFE NORMALIZATION (NO MIXING OPERATORS)
      const raw =
        response.data?.data?.data ??
        response.data?.data ??
        response.data ??
        [];

      setNews(Array.isArray(raw) ? raw : []);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-black px-6 py-24">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-7xl">
        {/* PREMIUM METALLIC GRADIENT */}
        <h1 className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-[0_2px_15px_rgba(255,255,255,0.1)]">
          News Feed
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400 text-sm font-medium">
          Tech updates from multiple global sources.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : (
        <>
          {/* Feed Grid */}
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {Array.isArray(news) &&
              news.map((article, index) => (
                <NewsCard
                  key={article.id || article.url || index}
                  article={article}
                />
              ))}
          </div>

          {/* Empty State */}
          {Array.isArray(news) && news.length === 0 && (
            <div className="mt-20 text-center text-zinc-500">
              No news available right now.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default News;