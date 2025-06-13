import { motion } from 'framer-motion'
import { MusicIcon } from 'lucide-react'
import React from 'react'

export default function Logo() {
  return (
    <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mb-6 shadow-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  '0 10px 30px rgba(147, 51, 234, 0.3)',
                  '0 10px 40px rgba(236, 72, 153, 0.4)',
                  '0 10px 30px rgba(147, 51, 234, 0.3)'
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <MusicIcon className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Audio Hub
            </motion.h1>
            <motion.p 
              className="text-gray-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Sign in to manage your audio collection
            </motion.p>
          </motion.div>
  )
}
