import crypto from 'crypto';

function generateId(title, url) {
    return crypto.createHash('md5').update(title + url).digest('hex');
}

const newsFormatter = (newsList) => {
    return newsList.map(item => ({
        id: generateId(item.title, item.url),

        title: item.title,

        summary: item.title?.slice(0, 120) + '...',

        url: item.url,

        source: item.source,

        category: item.category || 'General',

        time: item.time || item.createdAt,
        image: item.image || null,

        // UI helpers
        badge: item.source === 'Reddit'
            ? 'HOT'
            : item.source === 'Hacker News'
            ? 'TREND'
            : 'NEW',

        type: item.category === 'AI'
            ? 'ai'
            : item.category === 'Security'
            ? 'security'
            : 'general'
    }));
};

export default newsFormatter;