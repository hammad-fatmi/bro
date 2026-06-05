import { useEffect, useState } from "react";

const ArticleView = () => {
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem("selectedArticle");
        if (data) {
            setArticle(JSON.parse(data));
        }
    }, []);

    if (!article) {
        return (
            <div className="text-white p-10">
                Article not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            
            {article.image && (
                <img
                    src={article.image}
                    className="w-full max-h-[400px] object-cover rounded-xl mb-6"
                />
            )}

            <h1 className="text-3xl font-bold mb-3">
                {article.title}
            </h1>

            <p className="text-cyan-400 mb-4">
                {article.source}
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
                {article.description ||
                 article.contentSnippet ||
                 "No description available."}
            </p>

            <a
                href={article.url}
                target="_blank"
                className="px-5 py-2 bg-cyan-500 rounded"
            >
                Read Original →
            </a>
        </div>
    );
};

export default ArticleView;