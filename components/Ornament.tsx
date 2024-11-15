import React from 'react'
import { motion } from 'framer-motion'

interface Message {
  id: number
  content: string
  sender: string
  position: { x: number; y: number }
}

interface OrnamentProps {
  message: Message
}

export default function Ornament({ message }: OrnamentProps) {
  const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return (
    <motion.div
      className={`absolute w-8 h-8 ${randomColor} rounded-full flex items-center justify-center cursor-pointer`}
      style={{ left: `${message.position.x}%`, top: `${message.position.y}%` }}
      whileHover={{ scale: 1.2 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    >
      <motion.div
        className="w-full h-full rounded-full"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}