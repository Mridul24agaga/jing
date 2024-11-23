import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface IntroductionModalProps {
  onClose: () => void
}

const IntroductionModal: React.FC<IntroductionModalProps> = ({ onClose }) => {
  return (
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
          <p>Create your personalized Christmas page and share the joy with your friends and family!</p>
          <p>Here's what you can do:</p>
          <ul className="list-disc list-inside">
            <li>Customize your Christmas countdown</li>
            <li>Add festive decorations to your page</li>
            <li>Share holiday wishes and messages</li>
            <li>Create a gift wishlist</li>
          </ul>
          <p>Get started by claiming your JingleBox page now!</p>
        </div>
        <motion.button
          className="mt-6 w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          Let's Get Started!
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default IntroductionModal

