import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Send } from 'lucide-react'

interface MessageModalProps {
  onClose: () => void
  onSubmit: (content: string, sender: string) => void
}

export default function MessageModal({ onClose, onSubmit }: MessageModalProps) {
  const [content, setContent] = useState('')
  const [sender, setSender] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && sender.trim()) {
      onSubmit(content, sender)
      setContent('')
      setSender('')
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add a Message</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="Your Name"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your message..."
            className="w-full p-2 mb-4 border rounded h-32 resize-none"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
            >
              <span>Send</span>
              <Send className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}