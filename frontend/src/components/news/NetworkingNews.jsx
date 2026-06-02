import { useEffect, useState } from "react";

const NetworkingNews = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/news/networking")
            .then(res => res.json())
            .then(data => setArticles(data.data || []))
            .catch(console.error);
    }, []);

    return (
        <section className="mt-10">
            <h2 className="text-3xl font-bold text-white mb-6">
                🌐 Network Pulse
            </h2>

            <div className="space-y-4">
                {articles.map(article => (
                    <a
                        key={article.url}
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    >
                        <p className="text-cyan-400 text-xs mb-2">
                            {article.source}
                        </p>

                        <h3 className="text-white font-semibold">
                            {article.title}
                        </h3>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default NetworkingNews;