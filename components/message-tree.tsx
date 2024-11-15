'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'

interface Message {
  id: number
  content: string
  position: { x: number; y: number }
}

interface MessageTreeProps {
  treeImageUrl: string
  initialMessages: Message[]
  onAddMessage: (message: string) => void
}

export default function MessageTree({ treeImageUrl, initialMessages, onAddMessage }: MessageTreeProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [showAddMessage, setShowAddMessage] = useState(false)

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      onAddMessage(newMessage)
      const newMsg: Message = {
        id: Date.now(),
        content: newMessage,
        position: {
          x: Math.random() * 80 + 10, // Random position between 10% and 90%
          y: Math.random() * 80 + 10,
        },
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
      setShowAddMessage(false)
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Image
        src={treeImageUrl}
        alt="Christmas Tree"
        width={600}
        height={800}
        className="w-full h-auto"
      />
      
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          className="absolute w-8 h-8 bg-red-500 rounded-full cursor-pointer flex items-center justify-center"
          style={{ left: `${msg.position.x}%`, top: `${msg.position.y}%` }}
          whileHover={{ scale: 1.2 }}
          onClick={() => setSelectedMessage(msg)}
        >
          <span className="text-white font-bold">{msg.id}</span>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setSelectedMessage(null)}
          >
            <div 
              className="bg-white p-6 rounded-lg max-w-sm w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedMessage(null)}
              >
                <X size={24} />
              </button>
              <p className="text-gray-800 mt-4">{selectedMessage.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddMessage(true)}
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {showAddMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 bg-white p-4 shadow-lg"
          >
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write your message here..."
              className="w-full p-2 border rounded mb-2"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddMessage(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMessage}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Add Message
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}