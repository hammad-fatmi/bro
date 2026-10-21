import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { DEFAULT_IMAGE } from "../../utils/constants";
import { Link } from "react-router-dom";

const NewsCard = ({ article }) => {
  const hasVideo =
    article.video && article.video.startsWith("http");

  const hasImage =
    article.image && article.image.startsWith("http");

  return (
    <Link
      to={`/article/${encodeURIComponent(article.url)}`}
      state={{ article }}
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl cursor-pointer"
      >
        {/* Glow */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 blur-xl" />
        </div>

        {/* MEDIA SECTION */}
        <div className="relative h-56 overflow-hidden bg-black">
          {hasVideo ? (
            <video
              src={article.video}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : hasImage ? (
            <>
              <img
                src={article.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
              />
              <motion.img
                src={article.image}
                alt={article.title}
                className="relative h-full w-full object-contain"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
            </>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background: (() => {
                  const hue =
                    [...(article.title || "")].reduce(
                      (h, c) => h + c.charCodeAt(0),
                      0
                    ) % 360;
                  return `linear-gradient(135deg, hsl(${hue} 70% 28%), hsl(${(hue + 60) % 360} 70% 12%))`;
                })(),
              }}
            >
              <span className="text-6xl font-bold text-white/80">
                {(article.source || "?")[0].toUpperCase()}
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md">
            {article.badge || "FEED"}
          </div>

          <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-md">
            {article.category || "General"}
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative space-y-4 p-5">
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>{article.source || "Unknown"}</span>
            <span>{article.time || ""}</span>
          </div>

          <h2 className="line-clamp-2 text-xl font-semibold leading-tight text-white group-hover:text-cyan-300">
            {article.title}
          </h2>

          <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
            {article.summary || ""}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-cyan-300">
              Open Article
            </span>

            <div className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-300">
              <ExternalLink size={16} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default NewsCard;