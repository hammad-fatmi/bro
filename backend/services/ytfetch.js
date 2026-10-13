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

const pickThumbnail = (thumbs = {}, videoId) =>
    thumbs.maxres?.url ||
    thumbs.standard?.url ||
    thumbs.high?.url ||
    thumbs.medium?.url ||
    thumbs.default?.url ||
    (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

export async function fetchYoutubeVideos(country = "US") {
    try {
        const allVideos = [];

        for (const channelId of allowedChannelIds) {
            const playlistId = await getUploadsPlaylist(channelId);
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

            if (!res.data?.items?.length) continue;

            const videos = res.data.items.map((item) => {
                const videoId = item.snippet?.resourceId?.videoId;

                return {
                    videoId,
                    title: item.snippet?.title,
                    channel: item.snippet?.videoOwnerChannelTitle,
                    thumbnail: pickThumbnail(item.snippet?.thumbnails, videoId),
                    thumbnailFallback: videoId
                        ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                        : null,
                    publishedAt: item.snippet?.publishedAt,
                    youtubeUrl: videoId
                        ? `https://www.youtube.com/watch?v=${videoId}`
                        : null
                };
            });

            allVideos.push(...videos);
        }

        const cleaned = allVideos.filter(
            (v) => v.videoId && v.title && v.thumbnail
        );

        cleaned.sort(
            (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        return cleaned.slice(0, 15);
    } catch (error) {
        console.log("YouTube error:", error.response?.data || error.message);
        return [];
    }
}