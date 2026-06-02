import express from "express";
import fetchNews from "../services/newsFetcher.js";
import processNews from "../services/newsProcessor.js";
import { extractArticleContent } from "../services/articleExtractor.js";

const router = express.Router();

let cachedNews = null;
let lastFetchTime = 0;

const CACHE_TIME = 1000 * 60 * 5; // 5 minutes

// =========================
// CACHE REFRESH
// =========================
async function refreshCache() {
    try {
        console.log("🔄 Refreshing news cache...");

        console.time("fetchNews");
        const rawNews = await fetchNews();
        console.timeEnd("fetchNews");

        if (!Array.isArray(rawNews)) {
            console.log("❌ Invalid raw news format");
            return;
        }

        console.time("processNews");
        const cleanNews = await processNews(rawNews);
        console.timeEnd("processNews");

        const filteredNews = cleanNews.filter(
            (item) => item.image && item.image.trim() !== ""
        );

        cachedNews = filteredNews;
        lastFetchTime = Date.now();

        console.log(
            `✅ Cache updated: ${filteredNews.length} articles`
        );
    } catch (err) {
        console.error(
            "Cache Refresh Error:",
            err.message
        );
    }
}

// =========================
// MAIN FEED
// =========================
router.get("/", async (req, res) => {
    try {
        const now = Date.now();

        if (
            !cachedNews ||
            now - lastFetchTime > CACHE_TIME
        ) {
            await refreshCache();
        }

        return res.json({
            success: true,
            cached: true,
            data: cachedNews || [],
        });
    } catch (err) {
        console.error("Main Feed Error:", err.message);

        return res.status(500).json({
            success: false,
            message: err.message,
            data: [],
        });
    }
});

// =========================
// ARTICLE PREVIEW
// =========================
router.get("/preview", async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required",
            });
        }

        const content = await extractArticleContent(url);

        return res.json({
            success: true,
            data: content,
        });
    } catch (err) {
        console.error(
            "Preview Error:",
            err.message
        );

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// =========================
// TECH MOVES
// =========================
router.get("/tech-moves", async (req, res) => {
    try {
        if (!cachedNews) {
            await refreshCache();
        }

        const techMoveKeywords = [
            "ceo",
            "cto",
            "cfo",
            "chief",
            "vp",
            "vice president",
            "president",
            "director",
            "manager",
            "leadership",
            "executive",
            "appointed",
            "promotion",
            "promoted",
            "joined",
            "hired",
            "hire",
            "resigned",
            "named",
            "elevated",
            "new role",
            "steps down",
            "takes role",
        ];

        const techMoves = (cachedNews || []).filter(
            (item) => {
                const title = (
                    item.title || ""
                ).toLowerCase();

                return techMoveKeywords.some((k) =>
                    title.includes(k)
                );
            }
        );

        return res.json({
            success: true,
            count: techMoves.length,
            data: techMoves,
        });
    } catch (err) {
        console.error(
            "Tech Moves Error:",
            err.message
        );

        return res.status(500).json({
            success: false,
            message: err.message,
            data: [],
        });
    }
});

// =========================
// TRENDING
// =========================
router.get("/trending", async (req, res) => {
    try {
        if (!cachedNews) {
            await refreshCache();
        }

        const trending = (cachedNews || [])
            .slice(0, 30)
            .map((item, index) => ({
                ...item,
                trendingScore: 100 - index,
            }))
            .sort(
                (a, b) =>
                    b.trendingScore - a.trendingScore
            );

        return res.json({
            success: true,
            data: trending,
        });
    } catch (err) {
        console.error(
            "Trending Error:",
            err.message
        );

        return res.status(500).json({
            success: false,
            message: err.message,
            data: [],
        });
    }
});

// =========================
// SINGLE ARTICLE
// =========================
router.get("/:id", async (req, res) => {
    try {
        if (!cachedNews) {
            await refreshCache();
        }

        const article = cachedNews.find(
            (item) => item.id === req.params.id
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }

        return res.json({
            success: true,
            data: article,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

export default router;