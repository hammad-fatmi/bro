import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ArticleDetails = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        fetch("/api/news")
            .then(res => res.json())
            .then(data => {
                const found = data.data.find(
                    a => a.id === id
                );
                setArticle(found);
            });
    }, [id]);

    if (!article) {
        return (
            <div className="text-white p-10">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">

            {article.image && (
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full rounded-xl mb-6"
                />
            )}

            <h1 className="text-4xl font-bold text-white mb-4">
                {article.title}
            </h1>

            <p className="text-cyan-400 mb-4">
                {article.source}
            </p>

            <p className="text-gray-300 leading-relaxed">
                {article.description ||
                    "No description available"}
            </p>

            <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-8 px-6 py-3 bg-cyan-500 rounded-lg text-white"
            >
                Read Original Article →
            </a>

        </div>
    );
};

export default ArticleDetails;