import express from "express";
import fetchNews from "../services/newsFetcher.js";
import processNews from "../services/newsProcessor.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const rawNews = await fetchNews();
        const news = await processNews(rawNews);

        console.log(`📰 Total articles fetched: ${news.length}`);

        const keywords = [
            "network",
            "networking",
            "cisco",
            "juniper",
            "arista",
            "cloudflare",
            "akamai",
            "fortinet",
            "palo alto",
            "vpn",
            "dns",
            "bgp",
            "routing",
            "router",
            "switch",
            "switching",
            "firewall",
            "wireguard",
            "zerotrust",
            "zero trust",
            "tcp",
            "udp",
            "ipv4",
            "ipv6",
            "sd-wan",
            "wan",
            "lan",
            "datacenter",
            "data center",
            "infrastructure",
            "latency",
            "bandwidth",
            "load balancer",
            "reverse proxy",
            "nginx",
            "haproxy",
            "kubernetes",
            "container networking",
            "service mesh",
            "network security"
        ];

        const filtered = news.filter((article) => {
            const searchableText = `
                ${article.title || ""}
                ${article.description || ""}
                ${article.category || ""}
            `.toLowerCase();

            return keywords.some((keyword) =>
                searchableText.includes(keyword.toLowerCase())
            );
        });

        console.log(
            `🌐 Networking articles found: ${filtered.length}`
        );

        const sorted = filtered.sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        );

        return res.json({
            success: true,
            count: sorted.length,
            data: sorted.slice(0, 20),
        });

    } catch (err) {
        console.error(
            "❌ Networking News Error:",
            err.message
        );

        return res.status(500).json({
            success: false,
            message: err.message,
            data: [],
        });
    }
});

export default router;