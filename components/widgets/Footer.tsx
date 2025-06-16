import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export default function Footer({ text }: { text: string }) {
  return (
    <motion.div className="mt-8 text-center text-sm text-gray-500">
      <div>{text}</div>
      <div className="mt-2">
        <Link
          href="/api-doc"
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          API Documentation
        </Link>
      </div>
    </motion.div>
  );
}
