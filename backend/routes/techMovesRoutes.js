import express from 'express';
import fetchNews from '../services/newsFetcher.js';
import processNews from '../services/newsProcessor.js';

const router = express.Router();

const isTechMove = (title) => {
    if (!title) return false;

    const t = title.toLowerCase();

    return (
        t.includes('ceo') ||
        t.includes('cto') ||
        t.includes('cfo') ||
        t.includes('vp') ||
        t.includes('chief') ||
        t.includes('appointed') ||
        t.includes('joins') ||
        t.includes('hired') ||
        t.includes('hiring') ||
        t.includes('promoted') ||
        t.includes('steps down') ||
        t.includes('leaves') ||
        t.includes('resigns')
    );
};

router.get('/', async (req, res) => {
    try {

        const rawNews = await fetchNews();
        const cleanNews = processNews(rawNews);

        const techMoves = cleanNews.filter(item =>
            isTechMove(item.title)
        );

        res.json({
            success: true,
            count: techMoves.length,
            data: techMoves
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

export default router;