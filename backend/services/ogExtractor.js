import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function extractOGData(url) {
    try {
        if (!url) return null;

        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const html = await res.text();
        const $ = cheerio.load(html);

        return {
            image:
                $('meta[property="og:image"]').attr("content") ||
                $('meta[name="twitter:image"]').attr("content") ||
                null,

            video:
                $('meta[property="og:video"]').attr("content") ||
                $('meta[property="og:video:secure_url"]').attr("content") ||
                null,

            title:
                $('meta[property="og:title"]').attr("content") || null
        };

    } catch (err) {
        return null;
    }
}