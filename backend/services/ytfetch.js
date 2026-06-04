import axios from "axios";
import "dotenv/config";

// ------------------------------
// APPROVED CHANNEL IDS
// ------------------------------
const allowedChannelIds = [
    "UCdngmbVKX1g2IY1X7v6Q4Qw",
    "UCfq3gq4Y8z3oV9xkZ0Q2m6A",
    "UCJbPGzawDH1njbqV-D5HqKw",
    "UCsBjURrPoezykLs9EqgamOA",
    "UC8p19gUXJYTsUPEpusHgteQ",
    "UC4Wc0wZ9t4p3m0yXlqF0q6g"
];

// ------------------------------
// GET UPLOADS PLAYLIST ID
// ------------------------------
async function getUploadsPlaylist(channelId) {
    try {
        const res = await axios.get(
            "https://www.googleapis.com/youtube/v3/channels",
            {
                params: {
                    key: process.env.YOUTUBE_API_KEY,
                    part: "contentDetails",
                    id: channelId
                }
            }
        );

        const playlistId =
            res.data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

        if (!playlistId) {
            console.log("❌ No playlist for channel:", channelId);
        }

        return playlistId;

    } catch (err) {
        console.log("❌ Channel API failed for:", channelId);
        console.log("DETAIL:", err.response?.data || err.message);
        return null;
    }
}

// ------------------------------
// MAIN FUNCTION
// ------------------------------
export async function fetchYoutubeVideos(country = "US") {
    try {
        let allVideos = [];

        console.log("🚀 Starting YouTube fetch...");
        console.log("Total channels:", allowedChannelIds.length);

        for (const channelId of allowedChannelIds) {

            console.log("\n---------------------------");
            console.log("🔹 Processing channel:", channelId);

            const playlistId = await getUploadsPlaylist(channelId);

            console.log("📦 Playlist ID:", playlistId);

            if (!playlistId) continue;

            const res = await axios.get(
                "https://www.googleapis.com/youtube/v3/playlistItems",
                {
                    params: {
                        key: process.env.YOUTUBE_API_KEY,
                        part: "snippet",
                        playlistId,
                        maxResults: 5
                    }
                }
            );

            console.log("📊 Items received:", res.data?.items?.length || 0);

            // ❗ IMPORTANT DEBUG: show raw API response issues
            if (!res.data?.items?.length) {
                console.log("⚠️ Empty response for playlist:", playlistId);
                console.log("RAW RESPONSE:", res.data);
                continue;
            }

            const videos = res.data.items.map((item) => ({
                videoId: item.snippet?.resourceId?.videoId,
                title: item.snippet?.title,
                channel: item.snippet?.videoOwnerChannelTitle,
                thumbnail:
                    item.snippet?.thumbnails?.high?.url ||
                    item.snippet?.thumbnails?.medium?.url ||
                    item.snippet?.thumbnails?.default?.url,
                publishedAt: item.snippet?.publishedAt,
                youtubeUrl: item.snippet?.resourceId?.videoId
                    ? `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
                    : null
            }));

            allVideos.push(...videos);
        }

        console.log("\n===========================");
        console.log("TOTAL RAW VIDEOS:", allVideos.length);

        const cleaned = allVideos.filter((v) => {
            const valid = v.videoId && v.title && v.thumbnail;

            if (!valid) {
                console.log("❌ Filter removed video:", v);
            }

            return valid;
        });

        cleaned.sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        console.log("FINAL VIDEOS SENT:", cleaned.length);

        return cleaned.slice(0, 15);

    } catch (error) {
        console.log("🔥 GLOBAL ERROR:");
        console.log(error.response?.data || error.message);
        return [];
    }
}