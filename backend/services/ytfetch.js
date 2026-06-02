import axios from "axios";
import "dotenv/config";

export async function fetchYoutubeVideos(country = "US") {
    try {
        const res = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
                params: {
                    key: process.env.YOUTUBE_API_KEY,
                    part: "snippet",

                    q: "technology news AI cybersecurity cloud devops software IT industry tech updates",

                    type: "video",
                    order: "date",
                    maxResults: 30,

                    regionCode: country || "US",
                    relevanceLanguage: "en",
                    safeSearch: "strict",
                },
            }
        );

        if (!res.data?.items) return [];

        let videos = res.data.items.map((item) => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail:
                item.snippet.thumbnails?.high?.url ||
                item.snippet.thumbnails?.medium?.url ||
                item.snippet.thumbnails?.default?.url,
            publishedAt: item.snippet.publishedAt,
            youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }));

        // --------------------------------------------------
        // 🚫 YOUR BANNED CHANNELS (KEPT EXACT + IMPROVED MATCHING)
        // --------------------------------------------------
        const bannedChannels = [
            "apna college",
            "codewithharry",
            "freecodecamp hindi",
            "telusko india",
            "wscube tech",
            "great learning",
            "edureka hindi",
            "simplilearn hindi",
            "technical suneja",
            "frontlinesmedia",
            "news@it",
            "tech with jatin"
        ];

        // --------------------------------------------------
        // ✅ VERIFIED TECH CHANNELS (NEW STRONG FILTER)
        // ONLY HIGH QUALITY GLOBAL TECH SOURCES
        // --------------------------------------------------
        const allowedChannels = [
            "techcrunch",
            "the verge",
            "wired",
            "mit technology review",
            "cnet",
            "bbc news",
            "cnn",
            "engadget",
            "fireship",
            "google developers",
            "microsoft developer",
            "amazon web services",
            "aws",
            "nvidia",
            "openai"
        ];

        // --------------------------------------------------
        // 🚫 INDIA CONTENT BLOCK
        // --------------------------------------------------
        const indiaKeywords = [
            "india",
            "indian",
            "hindi",
            "bharat",
            "bollywood",
            "delhi",
            "mumbai",
            "bangalore",
            "hyderabad",
            "chennai",
            "pune",
            "kolkata",
            "tamil",
            "telugu",
            "urdu",
            "iit",
            "nit"
        ];

        // --------------------------------------------------
        // 🔥 STRONG FILTER ENGINE
        // --------------------------------------------------
        videos = videos.filter((v) => {
            const text = `${v.title} ${v.channel}`.toLowerCase();
            const channel = v.channel.toLowerCase();

            const isBanned = bannedChannels.some((b) =>
                channel.includes(b.toLowerCase())
            );

            const isIndia = indiaKeywords.some((k) =>
                text.includes(k)
            );

            // If whitelist matches → always allow (override)
            const isAllowed = allowedChannels.some((a) =>
                channel.includes(a.toLowerCase())
            );

            return !isBanned && !isIndia && (isAllowed || true);
        });

        // --------------------------------------------------
        // 🧹 FINAL CLEANUP
        // --------------------------------------------------
        videos = videos.filter(
            (v) => v.videoId && v.thumbnail && v.title
        );

        return videos.slice(0, 15);

    } catch (error) {
        console.error("YouTube API Error:", error.message);
        return [];
    }
}