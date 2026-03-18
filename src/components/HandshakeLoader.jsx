"use client";

import { motion } from "framer-motion";

export default function HandshakeLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      
      <div className="relative w-40 h-24">
        {/* Left Hand */}
        <motion.div
          initial={{ x: -40, rotate: -10, opacity: 0 }}
          animate={{ x: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute left-0 top-6 w-20 h-12 rounded-full bg-[#1F6B4A] shadow-md"
        />

        {/* Right Hand */}
        <motion.div
          initial={{ x: 40, rotate: 10, opacity: 0 }}
          animate={{ x: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute right-0 top-6 w-20 h-12 rounded-full bg-[#2A8C5F] shadow-md"
        />

        {/* Handshake bounce */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#1F6B4A] font-bold">
            🤝
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-gray-500"
      >
        Establishing secure connection...
      </motion.p>
    </div>
  );
}