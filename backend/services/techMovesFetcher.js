import Parser from "rss-parser";
import crypto from "crypto";
import ogs from "open-graph-scraper";

const parser = new Parser({
    timeout: 5000,
    customFields: {
        item: [
            ["media:content", "mediaContent"],
            ["media:thumbnail", "mediaThumbnail"],
        ],
    },
});

const FEEDS = [
    "https://feeds.feedburner.com/TheHackersNews",
    "https://www.bleepingcomputer.com/feed/",
    "https://krebsonsecurity.com/feed/",
    "https://www.schneier.com/feed/atom/",
    "https://www.securityweek.com/feed/",
    "https://www.darkreading.com/rss.xml",
    "https://www.eff.org/rss/updates.xml",
    "https://www.networkworld.com/feed/",
];

const TOPIC = /\b(security|privacy|vpn|firewall|encryption|encrypted|malware|ransomware|phishing|breach|vulnerabilit(y|ies)|cve-\d+|zero[- ]day|exploit|ddos|botnet|surveillance|tracking|gdpr|data leak|network(s|ing)?|router|dns|bgp|wi-?fi|5g|cisco|fortinet|palo alto|juniper|cloudflare|wireguard|zero trust|sd-wan|tls|ssl)\b/i;

// topic can be in the title or the description
const isMove = (title, desc = "") => TOPIC.test(title) || TOPIC.test(desc);

// logos, placeholders, tracking pixels, auto-generated social cards
const BAD_IMAGE = /(logo|placeholder|placehold|favicon|sprite|pixel|tracking|avatar|gravatar|social_previews|\.svg)/i;

const withTimeout = (promise, ms, fallback) =>
    Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(fallback), ms)),
    ]);

const cleanImage = (raw, base) => {
    if (!raw || typeof raw !== "string") return null;
    try {
        const u = new URL(raw.replace(/&amp;/g, "&").trim(), base);
        return /^https?:$/.test(u.protocol) && !BAD_IMAGE.test(u.href) ? u.href : null;
    } catch {
        return null;
    }
};

const getOG = async (url) => {
    try {
        const { result } = await ogs({ url, timeout: 8, onlyGetOpenGraphInfo: true });
        return (
            cleanImage(result.ogImage?.[0]?.url, url) ||
            cleanImage(result.twitterImage?.[0]?.url, url) ||
            null
        );
    } catch {
        return null;
    }
};

// articleUrl -> image (survives across refreshes)
const imageCache = new Map();

// If the same image appears on 2+ articles, it's a site logo, not a photo
const dropSharedImages = (articles) => {
    const counts = new Map();
    articles.forEach((a) => {
        if (a.image) counts.set(a.image, (counts.get(a.image) || 0) + 1);
    });
    articles.forEach((a) => {
        if (a.image && counts.get(a.image) > 1) {
            a.image = null;
            imageCache.delete(a.url);
        }
    });
};

// ------------------------------------------------------------
// FAST PATH: feeds in parallel, each capped at 5s
// ------------------------------------------------------------
const fetchFeed = (url) =>
    withTimeout(parser.parseURL(url), 5000, null).catch(() => null);

const buildArticles = async () => {
    const feeds = await Promise.all(FEEDS.map(fetchFeed));

    const seen = new Set();
    const out = [];

    for (const feed of feeds) {
        if (!feed) continue;

        for (const item of feed.items) {
            if (!item.link || !item.title) continue;
            if (!isMove(item.title, item.contentSnippet || "")) continue;

            const key = item.title.toLowerCase().slice(0, 60);
            if (seen.has(key)) continue;
            seen.add(key);

            const date = new Date(item.isoDate || item.pubDate || Date.now());

            const rssImage = cleanImage(
                item.enclosure?.url ||
                    item.mediaContent?.$?.url ||
                    item.mediaThumbnail?.$?.url ||
                    (item["content:encoded"] || item.content || "")
                        .match(/<img[^>]+src=["']([^"']+)["']/i)?.[1],
                item.link
            );

            let source = "unknown";
            try {
                source = new URL(item.link).hostname.replace(/^www\./, "");
            } catch { }

            out.push({
                id: crypto.createHash("md5").update(item.link).digest("hex"),
                title: item.title,
                url: item.link,
                source,
                category: "Tech Moves",
                image: rssImage || imageCache.get(item.link) || null,
                description: item.contentSnippet || "",
                summary: item.title,
                badge: "MOVE",
                time: date.toLocaleString(),
                _ts: date.getTime(),
            });
        }
    }

    console.log("tech-moves matched:", out.length);
    return out.sort((a, b) => b._ts - a._ts).slice(0, 40);
};

// ------------------------------------------------------------
// SLOW PATH: OG images for articles whose RSS had none
// ------------------------------------------------------------
const enrich = async (articles) => {
    const needImage = articles.filter((a) => !a.image);
    let i = 0;

    await Promise.all(
        Array.from({ length: 8 }, async () => {
            while (i < needImage.length) {
                const a = needImage[i++];
                const img = await getOG(a.url);
                if (!img) continue;
                a.image = img;
                imageCache.set(a.url, img);
            }
        })
    );

    dropSharedImages(articles);
};

// ------------------------------------------------------------
export default async function fetchTechMoves() {
    const articles = await buildArticles();

    // wait up to 8s for images; anything unfinished continues in the background
    const work = enrich(articles).catch((err) =>
        console.error("Tech moves enrichment failed:", err.message)
    );
    await withTimeout(work, 15000, null);

    // hide internal field from res.json()
    articles.forEach((a) =>
        Object.defineProperty(a, "_ts", { enumerable: false })
    );

    return articles.filter((a) => a.image);
}