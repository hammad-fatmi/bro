import { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "./NewsCard";

const TechMoves = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMoves = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/news/tech-moves"
      );

      setNews(response.data.data);
    } catch (error) {
      console.error("Failed to fetch tech moves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoves();
  }, []);

  return (
    <div className="min-h-screen bg-black px-6 py-24">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-7xl">
        {/* PREMIUM VERTICAL METALLIC GRADIENT */}
        <h1 className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)]">
          Tech Moves
        </h1>

        <p className="mt-3 text-zinc-400 text-sm font-medium max-w-2xl">
          Leadership changes, promotions, hires, and company updates from the tech world.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : (
        <>
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
              No tech moves found.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TechMoves;