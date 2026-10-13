import fetch from 'node-fetch';
import Parser from 'rss-parser';
import ogs from 'open-graph-scraper';

const UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const parser = new Parser({
    timeout: 8000,
    headers: { 'User-Agent': UA },
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'mediaThumbnail'],
        ],
    },
});

// =========================
// HELPERS
// =========================
const OG_CONCURRENCY = 20;
const OG_TIMEOUT_SEC = 6;
const OG_BUDGET_MS = 15000;         // max time we wait for scraping per refresh
const NULL_TTL_MS = 10 * 60 * 1000; // retry failed scrapes after 10 min

const ogCache = new Map(); // url -> { img, at }

const hostname = (url) => {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return 'unknown';
    }
};

// Auto-generated social cards come pre-cropped, so never use them
const BAD_IMAGE = /(social_previews|pixel|tracking|avatar|emoji|gravatar|\.svg)/i;

const cleanImageUrl = (u, base) => {
    if (!u || typeof u !== 'string') return null;

    try {
        const parsed = new URL(u.replace(/&amp;/g, '&').trim(), base);
        if (!/^https?:$/.test(parsed.protocol)) return null;
        if (BAD_IMAGE.test(parsed.href)) return null;
        return parsed.href;
    } catch {
        return null;
    }
};

// Pull an image out of RSS data without any network call
const imageFromRss = (item) => {
    const html = item['content:encoded'] || item.content || '';
    return (
        cleanImageUrl(item.enclosure?.url, item.link) ||
        cleanImageUrl(item.mediaContent?.$?.url, item.link) ||
        cleanImageUrl(item.mediaThumbnail?.$?.url, item.link) ||
        cleanImageUrl(html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1], item.link) ||
        null
    );
};

const getOGImage = async (url) => {
    const hit = ogCache.get(url);
    if (hit && (hit.img || Date.now() - hit.at < NULL_TTL_MS)) {
        return hit.img;
    }

    try {
        const { result } = await ogs({
            url,
            timeout: OG_TIMEOUT_SEC,
            fetchOptions: {
                headers: {
                    'user-agent': UA,
                    accept: 'text/html,application/xhtml+xml',
                    'accept-language': 'en-US,en;q=0.9',
                },
            },
        });

        const img =
            cleanImageUrl(result.ogImage?.[0]?.url, url) ||
            cleanImageUrl(result.twitterImage?.[0]?.url, url) ||
            null;

        ogCache.set(url, { img, at: Date.now() });
        return img;
    } catch {
        ogCache.set(url, { img: null, at: Date.now() });
        return null;
    }
};

// Run fn over items with at most `limit` running at once
const mapLimit = async (items, limit, fn) => {
    let i = 0;
    const worker = async () => {
        while (i < items.length) {
            const item = items[i++];
            await fn(item);
        }
    };
    await Promise.all(
        Array.from({ length: Math.min(limit, items.length) }, worker)
    );
};

// Fill in missing images, but never wait longer than OG_BUDGET_MS.
// Unfinished scrapes continue in the background and land in ogCache.
const fillMissingImages = async (articles) => {
    const missing = articles.filter((a) => !a.image);
    if (!missing.length) return;

    const work = mapLimit(missing, OG_CONCURRENCY, async (a) => {
        a.image = await getOGImage(a.url);
    });

    await Promise.race([
        work,
        new Promise((resolve) => setTimeout(resolve, OG_BUDGET_MS)),
    ]);
};

// =========================
// SOURCES
// =========================
const fetchHN = async () => {
    try {
        const response = await fetch(
            'https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=60'
        );
        const data = await response.json();

        const articles = data.hits
            .filter((item) => item.url && item.title)
            .slice(0, 50)
            .map((item) => ({
                title: item.title,
                url: item.url,
                source: hostname(item.url),
                createdAt: item.created_at,
                description: item.story_text || '',
                image: ogCache.get(item.url)?.img || null,
            }));

        await fillMissingImages(articles);
        console.log('Hacker News:', articles.length);
        return articles;
    } catch (err) {
        console.error('Hacker News error:', err.message);
        return [];
    }
};

const fetchRss = (name, feedUrl) => async () => {
    try {
        const feed = await parser.parseURL(feedUrl);

        const articles = feed.items
            .filter((item) => item.link && item.title)
            .slice(0, 50)
            .map((item) => ({
                title: item.title,
                url: item.link,
                source: hostname(item.link),
                createdAt: item.isoDate || item.pubDate,
                description: item.contentSnippet || item.content || '',
                image: imageFromRss(item) || ogCache.get(item.link)?.img || null,
            }));

        await fillMissingImages(articles);
        console.log(`${name}:`, articles.length);
        return articles;
    } catch (err) {
        console.error(`${name} error:`, err.message);
        return [];
    }
};

// =========================
// MAIN
// =========================
async function fetchNews() {
    const results = await Promise.allSettled([
        fetchHN(),
        fetchRss('Dev.to', 'https://dev.to/feed')(),
        fetchRss('TechCrunch', 'https://techcrunch.com/feed/')(),
    ]);

    const rawNews = results
        .filter((r) => r.status === 'fulfilled')
        .flatMap((r) => r.value);

    console.log('TOTAL RAW NEWS:', rawNews.length);
    return rawNews;
}

export default fetchNews;