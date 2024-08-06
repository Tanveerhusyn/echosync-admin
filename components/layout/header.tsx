"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getInitial = (name: string | null | undefined) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const getRandomColor = (name: string | null | undefined) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const index = name ? name.length % colors.length : 0;
    return colors[index];
  };

  const userInitial = getInitial(session?.user?.name);
  const avatarColor = getRandomColor(session?.user?.name);

  return (
    <header className="bg-gray-100 border-2 border-gray-200 px-4 py-3">
      <div className="max-w-9xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden mr-4 text-gray-500 hover:text-[#0A2472]"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </motion.button>
          <svg
            width="200"
            height="60"
            viewBox="0 0 738 284"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG path data remains unchanged */}
          </svg>
        </div>

        <div className="flex-grow max-w-xl mx-4">
          <div className="relative">
            <motion.div
              animate={{
                scale: isSearchFocused ? 1.05 : 1,
                boxShadow: isSearchFocused ? "0 0 0 2px #0A2472" : "none",
              }}
              className="relative rounded-full overflow-hidden"
            >
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 bg-white rounded-full focus:outline-none"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative text-gray-500 hover:text-[#0A2472]"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div
                className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold mr-2`}
              >
                {userInitial}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {session?.user?.name || "User"}
              </span>
              <ChevronDown size={16} className="ml-1 text-gray-400" />
            </motion.div>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="inline-block mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
