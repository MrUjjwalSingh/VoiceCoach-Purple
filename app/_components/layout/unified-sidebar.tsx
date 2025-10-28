"use client";

import { Variants, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileAudio,
  FileText,
  Archive,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Presentation,
} from "lucide-react";
import { getUserEmail } from "@/lib/auth-utils";

const floatingVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
};

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  active?: boolean;
}

export default function UnifiedSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [username, setUsername] = useState("Profile");

  useEffect(() => {
    try {
      const email = getUserEmail();
      if (email) {
        setUsername(email);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const navItems: NavItem[] = [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: LayoutDashboard,
      active: pathname === "/dashboard"
    },
    {
      label: "Presentation Analysis",
      href: "/presentation-analysis",
      icon: FileAudio,
      active: pathname === "/presentation-analysis"
    },
    {
      label: "Content Generator",
      href: "/content-generator",
      icon: FileText,
      active: pathname === "/content-generator"
    },
    {
      label: "Presentation Suggestor",
      href: "/presentation-suggestor",
      icon: Sparkles,
      active: pathname === "/presentation-suggestor"
    },
    // {
    //   label: "Ai presentation",
    //   href: "/voice-over",
    //   icon: Presentation,
    //   active: pathname === "/voice-over"
    // },
    { 
      label: "History", 
      href: "/history", 
      icon: Archive,
      active: pathname === "/history"
    },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
    } catch (e) {
      // ignore
    }
    router.push("/auth/login");
  };

  return (
    <aside
      className={`${
        isSidebarExpanded ? "w-72" : "w-20"
      } bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 p-6 flex flex-col transition-all duration-300
      h-screen fixed top-0 left-0 z-40`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="absolute -right-4 top-16 w-8 h-8 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors z-50"
        aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isSidebarExpanded ? (
          <ChevronLeft size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </button>

      {/* Logo/Brand */}
      <motion.div
        className={`flex items-center gap-2 mb-8 ${
          !isSidebarExpanded && "justify-center"
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0"
          variants={floatingVariants}
          animate="animate"
        >
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
        {isSidebarExpanded && (
          <h2 className="text-lg font-bold text-white">VoiceCoach</h2>
        )}
      </motion.div>

      {/* User Info */}
      <motion.div
        className={`flex items-center gap-3 mb-8 ${
          !isSidebarExpanded && "justify-center"
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center text-purple-400 flex-shrink-0">
          <User size={18} />
        </div>
        {isSidebarExpanded && (
          <div>
            <div className="text-xs text-slate-400">Signed in as</div>
            <div className="font-semibold text-slate-100 text-sm break-all">
              {username}
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.active;
            
            return (
              <motion.a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
                whileHover={{ x: 4 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarExpanded && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </motion.a>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${
          !isSidebarExpanded && "justify-center"
        }`}
        whileHover={{ x: 4 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        {isSidebarExpanded && (
          <span className="text-sm font-medium">Logout</span>
        )}
      </motion.button>
    </aside>
  );
}
