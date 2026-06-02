import express from "express";
import { fetchYoutubeVideos } from "../services/ytfetch.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const videos = await fetchYoutubeVideos();

        res.json({
            success: true,
            data: videos
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch videos"
        });
    }
});

export default router;