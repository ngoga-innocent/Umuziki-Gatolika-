import { Link } from "react-router-dom";
import Logo from '../../assets/icon.png';
import { AlignLeft, ChevronFirst, MessageCircleMore, VideoIcon } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
export default function SideBar() {
  const [showText, setShowText] = useState(false);
   const { user } = useSelector((state: RootState) => state?.auth);
  return (
    <aside
      className={`h-screen flex flex-col gap-y-2  py-4 px-3 relative transition-all duration-500 ${
        showText ? 'w-[240px]' : 'w-[104px]'
      }`}
    >
      {/* Logo and title */}
      <div className="flex items-center gap-x-2 w-full">
        <img src={Logo} className="w-12 h-12 rounded-full" alt="Logo" />
        <span
          className={`whitespace-nowrap transition-all duration-500 overflow-hidden ${
            showText ? 'opacity-100 ml-2' : 'opacity-0 ml-0'
          }`}
        >
          <h1 className="font-bold text-[#195e3d]">Umuziki Gatolika</h1>
        </span>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setShowText(!showText)}
        className="absolute top-[10vh] -right-3 border border-zinc-200 z-10 bg-white/80 py-2 px-2 rounded-sm shadow-md"
      >
        <ChevronFirst
          className={`transition-transform duration-500 ${
            showText ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Navigation Links */}
      <div className="flex-1 mt-5 flex flex-col gap-y-2">
        {[
          { icon: <AlignLeft />, text: 'Home', to: '/dashboard' },
          { icon: <VideoIcon />, text: 'Posts', to: '/dashboard/posts' },
          { icon: <MessageCircleMore />, text: 'Chat', to: '/dashboard/chat' },
        ].map(({ icon, text, to }, i) => (
          <Link
            key={i}
            to={to}
            className="flex items-center gap-x-2 hover:bg-[#195e3d] hover:text-white transition-colors duration-300 rounded-lg w-full py-2 px-4"
          >
            {icon}
            <span
              className={`transition-all duration-500 overflow-hidden ${
                showText ? 'opacity-100 ml-2' : 'opacity-0 ml-0'
              }`}
            >
              {text}
            </span>
          </Link>
        ))}
      </div>
      {/* User Profile */}
      <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <img src={Logo} alt="" className="rounded-full ring-green-600 ring-2 w-13 h-13" />
          <span
              className={`transition-all duration-500 overflow-hidden text-xs ${
                showText ? 'opacity-100 ml-2' : 'opacity-0 ml-0'
              }`}
            >
              {user?.username}
            </span>
          </div>
          <a className={`transition-all text-red-500 duration-500 overflow-hidden ${
                showText ? 'opacity-100 ml-2' : 'opacity-0 ml-0'
              }`}  href="/">Logout</a>
      </div>
    </aside>
  );
}
