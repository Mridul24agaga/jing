'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Edit2, ChevronLeft, ChevronRight, Type, ImageIcon } from 'lucide-react'

interface ChristmasCard {
  id: string
  image: string
  defaultMessage: string
}

interface CustomText {
  id: string
  text: string
  x: number
  y: number
  color: string
  fontSize: number
}

const prebuiltCards: ChristmasCard[] = [
  { id: 'card1', image: 'https://media.discordapp.net/attachments/1193183717548638301/1306632711124942969/Beige_and_Green_Illustrative_Merry_Christmas_Instagram_Story.png?ex=6737600a&is=67360e8a&hm=04c16c5617d0fa47b6e709a784055c84757e878d8f43abc804ec545f22363264&=&format=webp&quality=lossless&width=197&height=350', defaultMessage: 'Merry Christmas!' },
  { id: 'card2', image: '/christmas-bg-2.jpg', defaultMessage: 'Happy Holidays!' },
  { id: 'card3', image: '/christmas-bg-3.jpg', defaultMessage: 'Season\'s Greetings!' },
  { id: 'card4', image: '/christmas-bg-4.jpg', defaultMessage: 'Joy to the World!' },
]

const colorOptions = ['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']

export default function Component({ onClose, onSend }: { onClose: () => void, onSend: (card: ChristmasCard, customTexts: CustomText[], recipient: string) => void }) {
  const [selectedCard, setSelectedCard] = useState<ChristmasCard>(prebuiltCards[0])
  const [customTexts, setCustomTexts] = useState<CustomText[]>([])
  const [recipient, setRecipient] = useState('')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isAddingText, setIsAddingText] = useState(false)
  const [newText, setNewText] = useState('')
  const [newTextColor, setNewTextColor] = useState(colorOptions[0])
  const [newTextSize, setNewTextSize] = useState(24)

  const handleSelectCard = (card: ChristmasCard) => {
    setSelectedCard(card)
    setCustomTexts([])
  }

  const handleSendCard = () => {
    if (selectedCard && recipient) {
      onSend(selectedCard, customTexts, recipient)
      onClose()
    }
  }

  const changeCard = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? (currentCardIndex + 1) % prebuiltCards.length 
      : (currentCardIndex - 1 + prebuiltCards.length) % prebuiltCards.length
    setCurrentCardIndex(newIndex)
    handleSelectCard(prebuiltCards[newIndex])
  }

  const addCustomText = () => {
    if (newText.trim()) {
      const newCustomText: CustomText = {
        id: Date.now().toString(),
        text: newText,
        x: 50,
        y: 50,
        color: newTextColor,
        fontSize: newTextSize
      }
      setCustomTexts([...customTexts, newCustomText])
      setNewText('')
      setIsAddingText(false)
    }
  }

  const updateTextPosition = (id: string, x: number, y: number) => {
    setCustomTexts(customTexts.map(text => 
      text.id === id ? { ...text, x, y } : text
    ))
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full max-w-4xl mx-auto border border-white/30 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Customize Your Christmas Card</h2>
          <motion.button
            onClick={onClose}
            className="text-white/70 hover:text-white"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-[5/7] bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={selectedCard.image}
                alt={`Christmas Card Background`}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
              {customTexts.map((text) => (
                <motion.div
                  key={text.id}
                  className="absolute cursor-move"
                  style={{ 
                    left: `${text.x}%`, 
                    top: `${text.y}%`, 
                    color: text.color,
                    fontSize: `${text.fontSize}px`,
                    transform: 'translate(-50%, -50%)',
                    textShadow: '0px 0px 4px rgba(0,0,0,0.5)'
                  }}
                  drag
                  dragConstraints={{
                    left: 0,
                    right: 100,
                    top: 0,
                    bottom: 100
                  }}
                  onDragEnd={(e, info) => {
                    const element = e.target as HTMLElement
                    const rect = element.getBoundingClientRect()
                    const parentRect = element.offsetParent?.getBoundingClientRect()
                    if (parentRect) {
                      const newX = ((rect.left - parentRect.left + rect.width / 2) / parentRect.width) * 100
                      const newY = ((rect.top - parentRect.top + rect.height / 2) / parentRect.height) * 100
                      updateTextPosition(text.id, newX, newY)
                    }
                  }}
                >
                  {text.text}
                </motion.div>
              ))}
              <div className="absolute inset-0 flex items-center justify-between p-2">
                <motion.button
                  className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => changeCard('prev')}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                  className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => changeCard('next')}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
            <div className="flex space-x-2">
              <motion.button
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-xl font-medium
                           hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAddingText(true)}
              >
                <span>Add Text</span>
                <Type className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium
                           hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeCard('next')}
              >
                <span>Change Background</span>
                <ImageIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-white mb-2">
                Recipient&apos;s username:
              </label>
              <input
                type="text"
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50"
                placeholder="Enter username"
              />
            </div>
            {isAddingText && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50"
                  placeholder="Enter your text"
                />
                <div className="flex space-x-2">
                  <select
                    value={newTextColor}
                    onChange={(e) => setNewTextColor(e.target.value)}
                    className="bg-white/10 border border-white/30 rounded-md text-white"
                  >
                    {colorOptions.map(color => (
                      <option key={color} value={color} style={{backgroundColor: color}}>
                        {color}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={newTextSize}
                    onChange={(e) => setNewTextSize(Number(e.target.value))}
                    className="w-20 px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white"
                    min="12"
                    max="72"
                  />
                  <motion.button
                    onClick={addCustomText}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl font-medium
                               hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add
                  </motion.button>
                </div>
              </div>
            )}
            <motion.button
              onClick={handleSendCard}
              className="w-full bg-purple-500 text-white px-6 py-3 rounded-xl font-medium
                         hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              disabled={!selectedCard || !recipient}
            >
              <span>Send Card</span>
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}