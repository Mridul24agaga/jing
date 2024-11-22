import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface IntroductionModalProps {
  isOpen: boolean
  onClose: () => void
}

const IntroductionModal: React.FC<IntroductionModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 p-8 rounded-lg shadow-xl max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Welcome to JingleBox.pro!</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>Here's what you need to do:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Choose a unique name for your JingleBox page</li>
                <li>Click "Claim My Jingle Page" to create your personalized Christmas page</li>
                <li>Sign up with your email to save and customize your JingleBox</li>
                <li>Share your JingleBox with friends and family!</li>
              </ol>
              <p>Get ready to spread some holiday cheer!</p>
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              Got it, let's go!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default IntroductionModal
