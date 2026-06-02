import fetchNews from '../services/newsFetcher.js';
import processNews from '../services/newsProcessor.js';
import newsFormatter from '../services/newsFormatter.js';

let cachedNews = [];
let lastFetchTime = 0;

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

const getNews = async (req, res) => {

    try {

        const now = Date.now();

        if (
            cachedNews.length > 0 &&
            now - lastFetchTime < CACHE_DURATION
        ) {
            return res.json({
                success: true,
                cached: true,
                count: cachedNews.length,
                data: cachedNews
            });
        }



        const rawNews = await fetchNews();

        // DEBUG (ONLY TEMP - remove later)
        console.log("RAW NEWS LENGTH:", rawNews.length);
        console.log("SAMPLE:", rawNews[0]);

        const processedNews = processNews(rawNews);
        const cleanNews = newsFormatter(processedNews);
        cachedNews = cleanNews;
        lastFetchTime = now;


        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedNews = cleanNews.slice(startIndex, endIndex);

        return res.json({
            success: true,
            count: cleanNews.length,
            page,
            limit,
            total: cleanNews.length,
            data: paginatedNews

        });

    } catch (error) {

        console.error("NEWS API ERROR:", error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch news',
            error: error.message
        });
    }
};

export { getNews };