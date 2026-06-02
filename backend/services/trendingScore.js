const calculateTrendingScore = (item) => {

    let score = 0;

    // SOURCE WEIGHT
    if (item.source === 'Hacker News') score += 30;
    if (item.source === 'Reddit') score += 25;
    if (item.source === 'TechCrunch') score += 20;
    if (item.source === 'Dev.to') score += 15;

    // CATEGORY BOOST
    if (item.category === 'AI') score += 25;
    if (item.category === 'Security') score += 20;
    if (item.category === 'DevOps') score += 15;

    // HOT KEYWORDS
    const title = item.title.toLowerCase();

    const hotKeywords = [
        'openai',
        'chatgpt',
        'ai',
        'security',
        'hack',
        'breach',
        'aws',
        'docker',
        'kubernetes',
        'microsoft',
        'google',
        'apple'
    ];

    hotKeywords.forEach(word => {
        if (title.includes(word)) {
            score += 5;
        }
    });

    // RECENCY BOOST
    const publishedTime = new Date(item.time).getTime();
    const hoursOld = (Date.now() - publishedTime) / 36e5;

    if (hoursOld < 2) score += 30;
    else if (hoursOld < 6) score += 20;
    else if (hoursOld < 12) score += 10;

    return score;
};

export default calculateTrendingScore;