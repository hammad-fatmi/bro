import { Flame, Globe, Sparkles } from "lucide-react";

const Features = () => {
    return (
        <section className="py-10 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4">

                {/* headline */}
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Why people use <span className="text-cyan-400">CodeFeed News</span>
                    </h2>
                    <p className="text-white/60 mt-2">
                        Real-time tech intelligence from global sources
                    </p>
                </div>

                {/* cards */}
                <div className="grid md:grid-cols-3 gap-6">

                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition">
                        <Flame className="text-orange-400 mb-3" />
                        <h3 className="font-semibold text-lg">Breaking Tech News</h3>
                        <p className="text-white/60 text-sm mt-2">
                            Live updates from Hacker News, Dev.to, TechCrunch.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition">
                        <Globe className="text-cyan-400 mb-3" />
                        <h3 className="font-semibold text-lg">Global Sources</h3>
                        <p className="text-white/60 text-sm mt-2">
                            Aggregated from worldwide developer communities.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition">
                        <Sparkles className="text-purple-400 mb-3" />
                        <h3 className="font-semibold text-lg">Smart Filtering</h3>
                        <p className="text-white/60 text-sm mt-2">
                            AI-style categorization: AI, DevOps, Security, Web.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Features;