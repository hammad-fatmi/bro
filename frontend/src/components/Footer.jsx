import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900/50 mt-20 relative overflow-hidden">
      
      {/* RUNNING LIGHT TOP RIM (Matches Navbar) */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 via-blue-500 via-purple-500 to-transparent opacity-60" />
      
      {/* AMBIENT BACKGROUND GLOW VALUES */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">

          {/* BRAND LOGO AREA */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <h2 className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:brightness-125 transition duration-300">
                CodeFeed
              </h2>
              <span className="text-[9px] block text-cyan-400/50 tracking-[0.3em] font-bold mt-[-2px] pl-0.5 group-hover:text-cyan-400 transition duration-300">
                NEWS
              </span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              Real-time tech intelligence platform built for developers. Stay ahead of the stack.
            </p>
          </div>

          {/* NAVIGATION LINKS WITH RADIAL DOT HOVERS */}
          <div>
            <h3 className="text-zinc-200 text-sm font-bold tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/news", label: "News" },
                { to: "/trending", label: "Trending" },
                { to: "/tech-moves", label: "Tech Moves" },
                { to: "/upload", label: "" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group relative inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-all duration-300 ease-out pl-0 hover:pl-2"
                  >
                    {/* Laser Neon Dot Indicator appearing on Hover */}
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,1)]" />
                    
                    {/* Color Shifting Text */}
                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-colors duration-300 font-medium">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIALS & CREDITS AREA WITH NEON CAPSULES */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-zinc-200 text-sm font-bold tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-400">
                Connect
              </h3>

              <div className="flex gap-3">
                {[
                  { icon: FaGithub, color: "hover:text-white hover:border-zinc-400 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]" },
                  { icon: FaTwitter, color: "hover:text-cyan-400 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]" },
                  { icon: FaLinkedin, color: "hover:text-blue-500 hover:border-blue-600/50 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]" },
                ].map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <button
                      key={index}
                      className={`relative p-3 rounded-xl border border-zinc-900 bg-zinc-900/30 text-zinc-400 transition-all duration-300 overflow-hidden group ${social.color}`}
                    >
                      {/* Internal background flare layer */}
                      <span className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Icon className="text-xl relative z-10 transition-transform duration-300 group-hover:scale-110" />
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-zinc-600 text-xs font-medium tracking-wide mt-8 md:mt-0">
              © {new Date().getFullYear()} CodeFeed. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;