"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const PlatformCard = ({ name, icon, color, onConnect, connected }) => {
  const IconComponent = icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-gradient-to-br ${color} rounded-3xl shadow-xl p-6 flex flex-col items-center justify-between h-full relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />

      {IconComponent && <IconComponent className="w-16 h-16 mb-4 text-white" />}
      <h3 className="text-xl font-bold text-black mb-4">{name}</h3>
      {connected ? (
        <div className="flex items-center text-white bg-green-500 px-4 py-2 rounded-full">
          <Check className="w-5 h-5 mr-2" />
          <span>Connected</span>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="flex items-center text-white bg-opacity-20 bg-white hover:bg-opacity-30 px-4 py-2 rounded-full transition duration-300"
        >
          Connect <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      )}
    </motion.div>
  );
};

export default PlatformCard;
