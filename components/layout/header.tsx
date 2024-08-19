"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MapPin, ChevronDown, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import useReviewStore from "@/hooks/useReviewStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { locations, selectedLocationId, setSelectedLocationId } =
    useReviewStore();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || "?";
  const avatarColor = "bg-blue-500";

  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
  };

  const getCurrentLocationTitle = () => {
    const currentLocation = locations.find(
      (loc) => loc.name === selectedLocationId,
    );
    return currentLocation ? currentLocation.title : "Select Location";
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
            <svg
              width="60px"
              height="60px"
              viewBox="0 -43.5 1111 1111"
              className="icon"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M479.817143 780.434286l-158.72 54.857143c-1.462857 0.731429-2.194286 0.731429-2.194286 0.731428 1.462857 0 2.925714 0.731429 4.388572 1.462857 1.462857 1.462857 2.194286 2.194286 2.925714 3.657143v-2.925714l4.388571-160.182857c1.462857-42.422857-17.554286-99.474286-43.885714-133.12l-101.668571-128c-0.731429-1.462857-1.462857-2.194286-1.462858-2.194286 0 1.462857 0 3.657143-0.731428 5.851429-0.731429 2.194286-1.462857 3.657143-2.925714 4.388571 0 0 0.731429 0 2.194285-0.731429l161.645715-46.08c40.96-11.702857 89.234286-46.08 114.102857-81.188571l93.622857-133.12c0.731429-1.462857 1.462857-2.194286 1.462857-2.194286-0.731429 0.731429-2.194286 0.731429-3.657143 0.731429s-2.925714-0.731429-3.657143-0.731429c0 0 0.731429 0.731429 1.462857 2.194286l93.622858 133.12c24.137143 34.377143 73.142857 69.485714 114.102857 81.188571l161.645714 46.08c1.462857 0.731429 2.194286 0.731429 2.194286 0.731429-0.731429-0.731429-2.194286-2.925714-2.925715-4.388571-0.731429-2.194286-0.731429-4.388571-0.731428-5.851429 0 0 0 0.731429-1.462857 2.194286l-101.668572 128c-26.331429 33.645714-45.348571 89.965714-43.885714 133.12l2.194286 80.457143 2.194285 80.457142v2.925715c0.731429-0.731429 1.462857-2.194286 2.925715-3.657143 1.462857-0.731429 2.925714-1.462857 4.388571-1.462857 0 0-0.731429 0-2.194286-0.731429l-158.72-54.857143c-39.497143-14.628571-99.474286-14.628571-138.971428-0.731428z m269.165714 137.508571c59.245714 20.48 113.371429-19.017143 111.908572-81.92l-2.194286-80.457143-2.194286-80.457143c-0.731429-21.942857 11.702857-58.514286 24.868572-76.068571l101.668571-128c39.497143-49.737143 19.017143-114.102857-42.422857-131.657143l-161.645714-46.08c-21.211429-5.851429-53.394286-28.525714-66.56-46.811428l-93.622858-133.12c-35.84-51.2-103.131429-51.2-138.971428 0l-93.622857 133.12c-13.165714 18.285714-44.617143 40.96-66.56 46.811428l-161.645715 46.08c-61.44 17.554286-81.92 81.92-42.422857 131.657143l101.668572 128c13.897143 17.554286 25.6 54.125714 24.868571 76.068571l-4.388571 160.182858c-1.462857 62.902857 51.931429 102.4 111.908571 81.92l158.72-54.857143c21.211429-7.314286 60.708571-7.314286 81.92 0l158.72 55.588571z"
                  fill="#0C92F2"
                ></path>
                <path
                  d="M548.571429 678.765714c-58.514286 0-125.074286 27.794286-125.074286 27.794286s10.971429-64.365714-6.582857-122.148571-65.828571-111.177143-65.828572-111.177143 76.8-20.48 124.342857-56.32 73.142857-87.771429 73.142858-87.771429 34.377143 51.931429 80.457142 87.771429c46.811429 35.108571 117.028571 56.32 117.028572 56.32s-40.228571 44.617143-58.514286 103.862857-13.897143 129.462857-13.897143 129.462857-66.56-27.794286-125.074285-27.794286z"
                  fill="#873dec"
                ></path>
                <path
                  d="M548.571429 678.765714c-56.32-5.12-125.074286 27.794286-125.074286 27.794286s10.971429-64.365714-6.582857-122.148571-65.828571-111.177143-65.828572-111.177143l198.217143 40.228571c3.657143 145.554286 1.462857 112.64-0.731428 165.302857z"
                  fill="#181c31"
                ></path>
                <path
                  d="M551.497143 678.765714c56.32-5.12 125.074286 27.794286 125.074286 27.794286s-10.971429-64.365714 6.582857-122.148571 65.828571-111.177143 65.828571-111.177143l-198.217143 40.228571c-3.657143 145.554286-1.462857 112.64 0.731429 165.302857z"
                  fill="#181c31"
                ></path>
              </g>
            </svg>
            <h2 className="text-xl font-bold text-[#4479f4]">
              Echo<span>Sync</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-white rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4479f4]"
              >
                <MapPin size={18} className="text-[#4479f4] mr-2" />
                <span className="mr-2">{getCurrentLocationTitle()}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <div className="max-h-64 overflow-auto">
                {locations.map((location) => (
                  <motion.button
                    key={location.name}
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    onClick={() => handleLocationChange(location.name)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      location.name === selectedLocationId
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {location.title}
                  </motion.button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

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
