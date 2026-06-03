import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Hero = () => {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("/api/news");

        const articles = res.data?.data || [];

        // ⚡ backend already filters images, but we double-safety here
        const valid = articles.filter(
          (item) => item.image && item.image.trim() !== ""
        );

        setNews(valid.slice(0, 10));
      } catch (err) {
        console.log("Hero fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [news]);

  const current = news[index];

  if (loading) {
    return (
      <div className="text-white text-center py-20">
        Loading latest news...
      </div>
    );
  }

  if (!current) {
    return null;
  }

  return (
    <section className="bg-black text-white pt-6 py-10 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-6">

        {/* LEFT MAIN HERO */}
        <div className="md:col-span-3 relative rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.url}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-[420px]"
            >
              <motion.div
                key={current.url}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="relative h-[420px]"
              >
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-0 p-6">
                  <span className="text-xs px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full">
                    {current.source}
                  </span>

                  <h1 className="text-2xl md:text-3xl font-bold mt-3">
                    {current.title}
                  </h1>
                </div>
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-0 p-6">
                <span className="text-xs px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full">
                  {current.source}
                </span>

                <h1 className="text-2xl md:text-3xl font-bold mt-3">
                  {current.title}
                </h1>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* RIGHT SIDE LIST */}
        {/* RIGHT SIDE LIST */}
        <div className="md:col-span-2 flex flex-col gap-4">

          {news
            .filter((item) => item.image && item.image.trim() !== "")
            .slice(1, 4)
            .map((item) => (
              <motion.a
                key={item.url}
                whileHover={{ scale: 1.02 }}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition"
              >
                <p className="text-xs text-cyan-300 mb-2 font-medium">
                  {item.source}
                </p>

                <h3 className="text-base font-semibold leading-relaxed text-white">
                  {item.title}
                </h3>
              </motion.a>
            ))}

        </div>

      </div>
    </section>
  );
};

export default Hero;