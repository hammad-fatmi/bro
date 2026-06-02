import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const Article = () => {
    const { id } = useParams();
    const location = useLocation();

    const [article, setArticle] = useState(
        location.state?.article || null
    );

    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(
        !location.state?.article
    );

    useEffect(() => {
        const loadPreview = async (articleData) => {
            try {
                const previewRes = await axios.get(
                    "http://localhost:5000/api/news/preview",
                    {
                        params: {
                            url: articleData.url,
                        },
                    }
                );

                setPreview(previewRes.data?.data || null);
            } catch (err) {
                console.error("Preview fetch failed:", err);
            }
        };

        // Article already passed through state
        if (location.state?.article) {
            setArticle(location.state.article);
            setLoading(false);

            loadPreview(location.state.article);
            return;
        }

        const fetchArticle = async () => {
            try {
                setLoading(true);

                const res = await axios.get(
                    "http://localhost:5000/api/news"
                );

                const news = res.data?.data || [];

                const decodedUrl = decodeURIComponent(id);

                const foundArticle = news.find(
                    (item) => item.url === decodedUrl
                );

                setArticle(foundArticle || null);

                if (foundArticle) {
                    await loadPreview(foundArticle);
                }

            } catch (error) {
                console.error("Error fetching article:", error);
                setArticle(null);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();

    }, [id, location.state]);

    // PREMIUM GLASS LOADING CANVAS
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-950">
                <div className="relative flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-950 border-t-purple-500" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 animate-pulse">
                        Loading Editorial
                    </span>
                </div>
            </div>
        );
    }

    // PREMIUM ERROR STATE
    if (!article) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-950">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-neutral-200 tracking-tight">Article Missing</h2>
                    <p className="mt-2 text-sm text-neutral-500">The document could not be localized on our servers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 relative overflow-hidden pb-24 selection:bg-purple-500 selection:text-white">
            
            {/* CHROMATIC DEEP PURPLE BACKGROUND RAY IMMERSION */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-600/[0.05] via-fuchsia-900/[0.02] to-transparent blur-[140px] pointer-events-none z-0" />

            <div className="mx-auto max-w-4xl px-6 py-28 relative z-10">

                {/* CINEMATIC HERO PICTURE COMPONENT */}
                <div className="relative group rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_30px_70px_rgba(0,0,0,0.8)] bg-neutral-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80 z-10" />
                    
                    <img
                        src={
                            article.image ||
                            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
                        }
                        alt={article.title}
                        className="h-[480px] w-full object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />

                    {/* TOP EDGE CORNER SHADOW */}
                    <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none z-20" />
                </div>

                {/* METADATA PLATINUM CHIPS */}
                <div className="mt-8 flex flex-wrap gap-2.5 items-center text-[11px] font-bold tracking-wider uppercase text-neutral-400">
                    <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-white shadow-sm">
                        {preview?.publisher || article.source || "Global"}
                    </span>
                    {article.category && (
                        <span className="px-3 py-1 rounded-full bg-purple-500/5 border border-purple-500/20 text-purple-300">
                            {article.category}
                        </span>
                    )}
                    <span className="ml-auto text-[10px] tracking-widest text-neutral-500 font-medium lowercase">
                        {article.time}
                    </span>
                </div>

                {/* LOGO-MATCHING PLATINUM GRADIENT HEADLINE */}
                <h1 className="mt-6 text-3xl md:text-5xl font-black tracking-tight leading-[1.15] bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(255,255,255,0.1)]">
                    {article.title}
                </h1>

                {/* EDITORIAL LINE SEPARATOR */}
                <div className="w-full h-[1px] bg-gradient-to-r from-purple-500/[0.15] via-transparent to-transparent mt-8" />

                {/* SUMMARY EXECUTIVE DECK */}
                {preview?.summary && (
                    <div className="mt-8 border-l-2 border-purple-500/40 pl-6">
                        <p className="text-xl text-neutral-200 font-medium leading-relaxed tracking-wide italic">
                            {preview.summary}
                        </p>
                    </div>
                )}

                {/* HIGH-END TYPEFACE BODY PRESENTATION */}
                {preview?.contentPreview?.length > 0 && (
                    <div className="mt-10 space-y-8">
                        {preview.contentPreview.map((paragraph, index) => (
                            <p
                                key={index}
                                className="text-lg leading-[1.85] text-neutral-300 font-normal tracking-wide [word-spacing:0.02em]"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                )}

                {/* HIGH-END CHROMATIC DARK PURPLE CTA SECTION */}
                <div className="mt-14 pt-10 border-t border-white/[0.06] flex justify-between items-center">
                    <div className="relative group inline-block">
                        
                        {/* High-Fidelity Deep Purple Aura Glow Layer */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-800 rounded-full blur-md opacity-40 group-hover:opacity-100 transition duration-500 pointer-events-none" />
                        
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative inline-flex items-center justify-center rounded-full bg-neutral-950 border border-purple-500/30 text-purple-200 font-semibold px-8 py-3.5 text-sm tracking-wide transition-all duration-300 hover:text-white hover:border-fuchsia-400/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.8)] active:scale-98 overflow-hidden"
                        >
                            {/* Specular internal shimmer reflex */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                            
                            <span className="relative z-10 flex items-center gap-2">
                                Read Original Article 
                                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300 text-purple-400 group-hover:text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Article;