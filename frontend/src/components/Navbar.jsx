import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setUser } from "@/redux/userSlice";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "/api/v1/user/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        dispatch(setUser(null));
        toast.success("Logged out");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="fixed top-5 left-0 w-full z-50 px-4 md:px-8">
      {/* MAIN ULTRA-GLASS CAPSULE */}
      <div className="max-w-7xl mx-auto bg-neutral-950/25 backdrop-blur-2xl border border-white/[0.12] rounded-full px-6 h-16 flex justify-between items-center relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
        
        {/* SPECULAR TOP-EDGE GLASS REFLECTION */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* LOGO */}
        <Link
          to="/"
          className="relative group flex flex-col justify-center active:scale-95 transition"
        >
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600 bg-clip-text text-xl font-black tracking-wider text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:brightness-110 transition duration-300">
            CodeFeed
          </span>
          <span className="text-[9px] text-fuchsia-400/70 tracking-[0.3em] font-bold mt-[-2px] pl-0.5">
            NEWS
          </span>
        </Link>

        {/* REFRACTIVE GLASS NAV LINKS */}
        <nav className="hidden md:flex gap-1.5 items-center">
          {["/", "/news", "/trending", "/tech-moves", "/upload"].map(
            (path, i) => {
              const labels = ["Home", "News", "Trending", "Tech Moves", "Upload"];

              return (
                <Link
                  key={path}
                  to={path}
                  className="relative group px-5 py-2.5 flex items-center justify-center rounded-full transition-all duration-300"
                >
                  {/* TUNED: RESTED GLOW SITS AT 23% OPACITY, GENTLY RISES TO ONLY 55% ON HOVER */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-800 rounded-full blur-md opacity-20 group-hover:opacity-10 scale-100 group-hover:scale-105 transition-all duration-300 ease-out" />
                  
                  {/* Frosted Glass Floating Lens Overlap */}
                  <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-md border border-white/[0.15] rounded-full opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_20px_rgba(0,0,0,0.4)]" />
                  
                  {/* Subtle Laser Dot Indicator */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-full opacity-0 transition-all duration-300 group-hover:w-1/4 shadow-[0_0_8px_rgba(240,70,239,0.6)]" />

                  {/* Text Layer */}
                  <span className="relative z-10 text-neutral-200 group-hover:text-white text-sm font-semibold tracking-wide transition-colors duration-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]">
                    {labels[i]}
                  </span>
                </Link>
              );
            }
          )}
        </nav>

        {/* RIGHT ACTION CONTAINER */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Glass User Capsule */}
              <div className="flex items-center gap-2 hidden md:flex bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse shadow-[0_0_8px_rgba(240,70,239,0.8)]" />
                <span className="text-zinc-200 text-xs font-semibold tracking-wide">
                  {user.firstName}
                </span>
              </div>

              <Button
                onClick={logoutHandler}
                className="bg-transparent hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-zinc-400 hover:text-red-400 rounded-full text-xs font-bold tracking-wide transition-all duration-300 px-5 h-9"
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="relative group">
              {/* Login Backing Aura */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-800 rounded-full blur-md opacity-40 group-hover:opacity-85 transition duration-300" />
              
              {/* Login Button */}
              <Button
                onClick={() => navigate("/login")}
                className="relative rounded-full bg-neutral-950/80 backdrop-blur-md text-neutral-200 hover:text-white hover:border-fuchsia-500/40 text-xs font-bold px-6 h-9 tracking-wide border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300"
              >
                Login
              </Button>
            </div>
          )}

          {/* MOBILE HAMBURGER BUTTON */}
          <button className="p-2 rounded-full md:hidden border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.08] transition-all duration-200 group">
            <Menu className="text-zinc-400 group-hover:text-white w-5 h-5 transition-transform active:scale-90" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;