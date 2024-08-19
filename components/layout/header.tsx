"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  MapPin,
  Globe,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import useReviewStore from "@/hooks/useReviewStore";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { locations, selectedLocationId, setSelectedLocationId } =
    useReviewStore();

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

  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    setIsLocationMenuOpen(false);
  };

  const getCurrentLocationName = () => {
    const currentLocation = locations.find(
      (loc) => loc.id === selectedLocationId,
    );
    return currentLocation ? currentLocation.name : "Select Location";
  };

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
          <div className="flex justify-center gap-1 items-center">
            {/* ... (SVG logo remains unchanged) ... */}
            <h2 className="text-xl font-bold text-[#4479f4]">
              Echo<span className="">Sync</span>
            </h2>
          </div>
        </div>

        <div className="flex-grow max-w-xl mx-4">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center cursor-pointer bg-white rounded-full px-4 py-2"
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
            >
              <MapPin size={18} className="text-[#4479f4] mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-2">
                {getCurrentLocationName()}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </motion.div>

            <AnimatePresence>
              {isLocationMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10"
                >
                  {locations.map((location) => (
                    <motion.button
                      key={location.id}
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      onClick={() => handleLocationChange(location.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700"
                    >
                      <Globe
                        size={16}
                        className="inline-block mr-2 text-[#4479f4]"
                      />
                      {location.name}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center space-x-4">
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

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                >
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="inline-block mr-2" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
