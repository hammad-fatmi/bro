import fetch from "node-fetch";
import * as cheerio from "cheerio";

// logos, placeholders, tracking pixels, auto-generated social cards
const BAD_IMAGE = /(logo|placeholder|placehold|favicon|sprite|pixel|tracking|avatar|gravatar|social_previews|\.svg)/i;
const cleanImage = (src, base) => {
    if (!src) return null;
    try {
        const u = new URL(src.replace(/&amp;/g, "&").trim(), base); // resolves relative URLs
        if (!/^https?:$/.test(u.protocol)) return null;
        if (BAD_IMAGE.test(u.href)) return null;
        return u.href;
    } catch {
        return null;
    }
};

export async function extractOGData(url) {
    try {
        if (!url) return null;

        const res = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "en-US,en;q=0.9",
            },
            signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) return null;

        const html = await res.text();
        const $ = cheerio.load(html);

        const raw =
            $('meta[property="og:image"]').attr("content") ||
            $('meta[name="twitter:image"]').attr("content") ||
            null;

        // Real article photos are wide; logos are usually small or square
        const w = parseInt($('meta[property="og:image:width"]').attr("content"), 10);
        const h = parseInt($('meta[property="og:image:height"]').attr("content"), 10);
        const tooSmall = (w && w < 400) || (h && h < 200);

        return {
            image: tooSmall ? null : cleanImage(raw, url),
            video:
                $('meta[property="og:video"]').attr("content") ||
                $('meta[property="og:video:secure_url"]').attr("content") ||
                null,
            title: $('meta[property="og:title"]').attr("content") || null,
        };
    } catch {
        return null;
    }
}