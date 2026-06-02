import axios from "axios";
import * as cheerio from "cheerio";

export const extractArticleContent = async (url) => {
    try {
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);

        const paragraphs = [];

        $("p").each((_, el) => {
            const text = $(el).text().trim();

            if (text.length > 80) {
                paragraphs.push(text);
            }
        });

        const publisher =
            $('meta[property="og:site_name"]').attr("content") ||
            $("title").text() ||
            "Unknown Source";

        return {
            publisher,
            summary: paragraphs[0] || "",
            contentPreview: paragraphs.slice(0, 5),
        };

    } catch (err) {
        return {
            publisher: "Unknown Source",
            summary: "",
            contentPreview: [],
        };
    }
};