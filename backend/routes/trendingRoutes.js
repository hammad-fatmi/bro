import express from 'express';
import fetchNews from '../services/newsFetcher.js';
import processNews from '../services/newsProcessor.js';
import calculateTrendingScore from '../services/trendingScore.js';


const router = express.Router();

router.get('/', async (req, res) => {
    try {

        const rawNews = await fetchNews();
        const cleanNews = processNews(rawNews);

        const trending = cleanNews
            .map(item => ({
                ...item,
                trendingScore: calculateTrendingScore(item)
            }))
            .sort((a, b) => b.trendingScore - a.trendingScore)
            .slice(0, 15);

        res.json({
            success: true,
            count: trending.length,
            data: trending
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export default router;