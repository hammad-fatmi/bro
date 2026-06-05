import { useEffect, useState } from "react";

const NetworkingNews = () => {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        fetch("/api/news/networking")
            .then((res) => res.json())
            .then((data) => {
                console.log("NETWORKING DATA:", data.data?.[0]);
                setArticles(data.data || []);
            })
            .catch(console.error);
    }, []);

    return (
        <>
            {/* ARTICLE MODAL */}
            {selectedArticle && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
                    <div className="bg-zinc-900 rounded-2xl max-w-3xl w-full overflow-hidden border border-white/10">

                        {selectedArticle.image ? (
                            <img
                                src={selectedArticle.image}
                                alt={selectedArticle.title}
                                className="w-full h-64 object-cover"
                            />
                        ) : (
                            <div className="w-full h-64 bg-zinc-800 flex items-center justify-center text-gray-400">
                                No Image Available
                            </div>
                        )}

                        <div className="p-6">
                            <p className="text-cyan-400 text-sm mb-2">
                                {selectedArticle.source}
                            </p>

                            <h2 className="text-white text-2xl font-bold mb-4">
                                {selectedArticle.title}
                            </h2>

                            <p className="text-gray-300 leading-relaxed">
                                {selectedArticle.description ||
                                    selectedArticle.contentSnippet ||
                                    selectedArticle.content ||
                                    "No description available."}
                            </p>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => setSelectedArticle(null)}
                                    className="px-4 py-2 bg-red-500 rounded-lg text-white"
                                >
                                    Close
                                </button>

                                <a
                                    href={selectedArticle.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-cyan-500 rounded-lg text-white"
                                >
                                    Read More →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NEWS SECTION */}
            <section className="mt-10">
                <h2 className="text-3xl font-bold text-white mb-6">
                    🌐 Network Pulse
                </h2>

                <div className="space-y-4">
                    {articles.slice(0, 4).map((article) => (
                        <div
                            key={article.url}
                            onClick={() => {
                                localStorage.setItem("selectedArticle", JSON.stringify(article));
                                window.open("/article-view", "_blank", "noopener,noreferrer");
                            }}
                            className="block p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer"
                        >
                            <p className="text-cyan-400 text-xs mb-2">
                                {article.source}
                            </p>

                            <h3 className="text-white font-semibold">
                                {article.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default NetworkingNews;