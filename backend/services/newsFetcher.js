import fetch from 'node-fetch';
import Parser from 'rss-parser';
import ogs from 'open-graph-scraper';

const parser = new Parser();

// =========================
// OG IMAGE SCRAPER
// =========================
const ogCache = new Map();
const getCachedOGImage = async (url) => {
    try {
        if (!url) return null;

        // 1. return cached instantly
        if (ogCache.has(url)) return ogCache.get(url);

        // 2. fetch OG once
        const img = await getOGImage(url);

        // 3. store in memory
        ogCache.set(url, img);

        return img;

    } catch (err) {
        return null;
    }
};
const getOGImage = async (url) => {
    if (ogCache.has(url)) return ogCache.get(url);

    try {
        const { result } = await ogs({ url });

        const img =
            result.ogImage?.[0]?.url ||
            result.twitterImage?.[0]?.url ||
            null;

        ogCache.set(url, img);
        return img;

    } catch (err) {
        ogCache.set(url, null);
        return null;
    }
};

// =========================
// MAIN FETCH FUNCTION
// =========================
async function fetchNews() {
    try {


        const fetchHN = async () => {
            try {
                const response = await fetch(
                    'https://hn.algolia.com/api/v1/search_by_date?tags=story'
                );

                const data = await response.json();

                const articles = await Promise.all(
                    data.hits
                        .filter(item => item.url && item.title)
                        .slice(0, 50)
                        .map(async item => ({
                            title: item.title,
                            url: item.url,
                            source: new URL(item.url || item.link).hostname.replace("www.", ""),
                            createdAt: item.created_at,
                            image:
                                item.enclosure?.url ||
                                await getCachedOGImage(item.url) ||
                                null
                        }))
                );

                console.log("Hacker News:", articles.length);

                return articles;

            } catch (err) {
                console.error('Hacker News error:', err.message);
                return [];
            }
        };

        // =========================
        // 2.
        // =========================
        const fetchDevTo = async () => {
            try {
                const feed = await parser.parseURL('https://dev.to/feed');

                const articles = await Promise.all(
                    feed.items
                        .filter(item => item.link && item.title)
                        .slice(0, 50)
                        .map(async item => ({
                            title: item.title,
                            url: item.link,
                            source: new URL(item.link).hostname.replace("www.", ""),
                            createdAt: item.pubDate,
                            image:
                                item.enclosure?.url ||
                                await getOGImage(item.link)
                        }))
                );

                console.log("Dev.to:", articles.length);

                return articles;

            } catch (err) {
                console.error('Dev.to error:', err.message);
                return [];
            }
        };

        // =========================
        // 3. TechCrunch
        // =========================
        const fetchTechCrunch = async () => {
            try {
                const feed = await parser.parseURL('https://techcrunch.com/feed/');
                console.log("TechCrunch Sample:");
                console.log(feed.items[0]);
                const articles = await Promise.all(
                    feed.items
                        .filter(item => item.link && item.title)
                        .slice(0, 50)
                        .map(async item => ({
                            title: item.title,
                            url: item.link,
                            source: new URL(item.link).hostname.replace("www.", ""),
                            createdAt: item.pubDate,
                            image:
                                item.enclosure?.url ||
                                await getOGImage(item.link)
                        }))
                );

                console.log("TechCrunch:", articles.length);

                return articles;

            } catch (err) {
                console.error('TechCrunch error:', err.message);
                return [];
            }
        };

        // =========================
        // RUN ALL SOURCES
        // =========================
        const results = await Promise.allSettled([
            fetchHN(),
            fetchDevTo(),
            fetchTechCrunch()
        ]);

        const rawNews = results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value)
            .flat();

        console.log("TOTAL RAW NEWS:", rawNews.length);
        console.log("FIRST ARTICLE:");
        console.log(rawNews[0]);

        return rawNews;

    } catch (error) {
        console.error('Global fetch error:', error);
        return [];
    }
}

export default fetchNews;