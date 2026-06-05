import crypto from "crypto";

// Helper to assign categories based on title keywords
const categorizeNews = (title) => {
    if (!title) return "General";

    const lowerTitle = title.toLowerCase();

    if (/\b(ai|ml|llm|chatgpt|openai|machine learning)\b/.test(lowerTitle))
        return "AI";

    if (/\b(react|vue|javascript|typescript|html|css|frontend|web)\b/.test(lowerTitle))
        return "Web Development";

    if (/\b(docker|kubernetes|aws|cloud|ci\/cd|devops)\b/.test(lowerTitle))
        return "DevOps";

    if (/\b(security|hack|breach|vulnerability|cve|malware)\b/.test(lowerTitle))
        return "Security";

    if (/\b(github|git|opensource)\b/.test(lowerTitle))
        return "Open Source";

    return "General";
};

export default async function processNews(newsList) {
    const seenUrls = new Set();

    // Remove duplicates
    const filtered = newsList.filter((item) => {
        if (!item.url || item.url === "#") return false;

        if (seenUrls.has(item.url)) return false;

        seenUrls.add(item.url);
        return true;
    });

    const enriched = filtered.map((item) => {
        const dateObj = new Date(item.createdAt);

        const id = crypto
            .createHash("md5")
            .update(item.url)
            .digest("hex");

        return {
            id,
            title: item.title || "No title",
            url: item.url,
            source: item.source || "Unknown",

            category: categorizeNews(item.title),

            image: item.image || null,

            description:
                item.description ||
                item.contentSnippet ||
                item.content ||
                "",

            video: null,

            time: dateObj.toLocaleString(),
            timestamp: dateObj.getTime(),
        };
    });

    const sorted = enriched.sort(
        (a, b) => b.timestamp - a.timestamp
    );

    // Debug first article
    console.log("FIRST PROCESSED ARTICLE:");
    console.log(sorted[0]);

    return sorted.map(({ timestamp, ...rest }) => rest);
}