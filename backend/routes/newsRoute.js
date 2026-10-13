import express from "express";
import fetchNews from "../services/newsFetcher.js";
import processNews from "../services/newsProcessor.js";
import { extractArticleContent } from "../services/articleExtractor.js";
import fetchTechMoves from "../services/techMovesFetcher.js";

const router = express.Router();

let cachedNews = null;
let lastFetchTime = 0;
let refreshing = null;
let imageRetries = 0;

const CACHE_TIME = 1000 * 60 * 5;   // 5 minutes
const MAX_IMAGE_RETRIES = 2;
const IMAGE_RETRY_DELAY = 15000;    // 15 seconds
const MISSING_THRESHOLD = 5;

// =========================
// CACHE REFRESH
// =========================
async function doRefresh(isRetry = false) {
    // a normal (non-retry) refresh starts a fresh retry cycle
    if (!isRetry) imageRetries = 0;

    try {
        console.log(isRetry ? "🔁 Retrying for missing images..." : "🔄 Refreshing news cache...");

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

        cachedNews = cleanNews;
        lastFetchTime = Date.now();

        const missing = cleanNews.filter((a) => !a.image).length;
        console.log(`✅ Cache updated: ${cleanNews.length} articles, ${missing} without image`);

        // late OG scrapes land in ogCache, so a quick re-run picks them up
        if (missing > MISSING_THRESHOLD && imageRetries < MAX_IMAGE_RETRIES) {
            imageRetries++;
            setTimeout(() => refreshCache(true), IMAGE_RETRY_DELAY).unref();
        }
    } catch (err) {
        console.error("Cache Refresh Error:", err.message);
    }
}

// one refresh at a time, even if many requests arrive together
function refreshCache(isRetry = false) {
    if (!refreshing) {
        refreshing = doRefresh(isRetry).finally(() => {
            refreshing = null;
        });
    }
    return refreshing;
}

// =========================
// MAIN FEED
// =========================
router.get("/", async (req, res) => {
    try {
        if (!cachedNews) {
            await refreshCache();            // only the very first request waits
        } else if (Date.now() - lastFetchTime > CACHE_TIME) {
            refreshCache();                  // stale: serve old data, refresh in background
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

// warm the cache on boot so the first visitor is fast
refreshCache();

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
        console.error("Preview Error:", err.message);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

// =========================
// TECH MOVES
// =========================
let movesCache = null;
let movesTime = 0;
let movesRefreshing = null;

const MOVES_TTL = 1000 * 60 * 15; // 15 minutes
const MOVES_RETRY = 1000 * 60;    // retry sooner when the result was empty

const refreshMoves = () => {
    if (!movesRefreshing) {
        movesRefreshing = fetchTechMoves()
            .then((d) => {
                movesCache = d;
                movesTime = Date.now();
            })
            .catch((e) => console.error("Tech Moves Error:", e.message))
            .finally(() => {
                movesRefreshing = null;
            });
    }
    return movesRefreshing;
};

refreshMoves(); // warm on boot

router.get("/tech-moves", async (req, res) => {
    try {
        if (!movesCache) {
            await refreshMoves(); // only the very first request waits
        } else {
            const ttl = movesCache.length ? MOVES_TTL : MOVES_RETRY;
            if (Date.now() - movesTime > ttl) refreshMoves(); // stale: serve old, refresh in background
        }

        return res.json({
            success: true,
            count: movesCache?.length || 0,
            data: movesCache || [],
        });
    } catch (err) {
        console.error("Tech Moves Error:", err.message);
        return res.status(500).json({ success: false, message: err.message, data: [] });
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
            }));

        return res.json({
            success: true,
            data: trending,
        });
    } catch (err) {
        console.error("Trending Error:", err.message);

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

        const article = (cachedNews || []).find(
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