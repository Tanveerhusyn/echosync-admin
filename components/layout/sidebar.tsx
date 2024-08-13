"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { navItems } from "@/constants/data";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardNav = ({ items, setOpen }: DashboardNavProps) => {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid gap-1">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        if (!Icon) {
          console.warn(`Icon not found for: ${item.icon}`);
          return null;
        }
        return (
          item.href && (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.disabled ? "/" : item.href}
                onClick={() => {
                  if (setOpen) setOpen(false);
                }}
                className={cn(
                  "group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  path === item.href
                    ? "bg-[#181c31] text-white"
                    : "text-gray-700 hover:bg-blue-50",
                  item.disabled && "cursor-not-allowed opacity-60",
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    path === item.href ? "text-white" : "text-[#0A2472]",
                  )}
                />
                <span>{item.title}</span>
                {path === item.href && (
                  <motion.div
                    className="absolute left-0 w-1 h-8 bg-[#0A2472] rounded-r-full"
                    layoutId="activeNavIndicator"
                  />
                )}
              </Link>
            </motion.div>
          )
        );
      })}
    </nav>
  );
};

export default function Sidebar() {
  return (
    <motion.nav
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={cn(
        "relative  hidden h-screen pt-12 lg:block w-[250px] mx-2",
        "bg-gray-100",
        "border-r border-gray-200",
      )}
    >
      <div className="space-y-4 py-2">
        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Dashboard
        </h3>
        <div className="px-3 py-2">
          {/* Navigation Items */}

          <div className="space-y-1">
            <DashboardNav items={navItems} />
          </div>
          {/* Apps Section */}
          <div className="mt-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Connected Apps
            </h3>
            <div className="mt-2 space-y-1">
              <Link
                href="/app1"
                className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <Icons.google className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium">Google</span>
              </Link>

              {/* Add more app links here */}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <motion.div
          className="h-px bg-gray-200"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="mt-4 text-center text-sm text-gray-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          © 2024 Your Company
        </motion.div>
      </div>
    </motion.nav>
  );
}
