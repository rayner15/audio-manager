import { motion } from 'framer-motion'
import React from 'react'

export default function Footer({text}: {text: string}) {
  return (
    <motion.div 
    className="mt-8 text-center text-sm text-gray-500"
   
  >
    {text}
  </motion.div>
  )
}
