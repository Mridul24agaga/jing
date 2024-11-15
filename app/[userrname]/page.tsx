'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Music, X, Send, Gift, Calendar, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, PenTool } from 'lucide-react'
import Snowfall from 'react-snowfall'
import ChristmasCards from './christmas-cards'

interface Message {
  id: number
  content: string
  sender: string
  x: number
  y: number
}

interface Scene {
  name: string
  src: string
  alt: string
}

interface EGift {
  id: string
  name: string
  image: string
  description: string
}

interface ReceivedGift {
  id: string
  from: string
  gift: EGift
  message: string
  wrapping: {
    color: string
    pattern: string
    ribbon: string
  }
}

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

const scenes: Scene[] = [
  { name: 'Winter Wonderland', src: 'https://media.discordapp.net/attachments/1193183717548638301/1306303268380741743/5d0facfe-f371-44a6-85e5-1b0867ff4d4c_image.png?ex=6736d5f9&is=67358479&hm=7cbe8dd327d6e34f47a0b235772307a3d3babb3d4678cf6ae9c2da3d6cc9410a&=&format=webp&quality=lossless&width=550&height=314', alt: 'Snowy landscape with pine trees' },
  { name: 'Cozy Cabin', src: '/cozy-cabin.png', alt: 'Warm cabin interior with fireplace' },
  { name: 'Starry Night', src: '/starry-night.png', alt: 'Night sky filled with stars' },
  { name: 'Northern Lights', src: '/northern-lights.png', alt: 'Aurora borealis over snowy mountains' },
  { name: 'Christmas Market', src: '/christmas-market.png', alt: 'Festive market with stalls and lights' },
]

const eGifts: EGift[] = [
  { id: 'gift1', name: 'Virtual Christmas Tree', image: '/virtual-tree.png', description: 'A beautifully decorated virtual Christmas tree' },
  { id: 'gift2', name: 'Digital Snowglobe', image: '/snowglobe.png', description: 'A magical digital snowglobe with customizable scene' },
  { id: 'gift3', name: 'Festive E-Card', image: '/ecard.png', description: 'A heartwarming animated Christmas e-card' },
  { id: 'gift4', name: 'Holiday Playlist', image: '/playlist.png', description: 'A curated playlist of holiday tunes' },
]

const giftWrappings = {
  colors: ['red', 'green', 'blue', 'gold', 'silver'],
  patterns: ['stripes', 'dots', 'stars', 'snowflakes', 'plain'],
  ribbons: ['gold', 'silver', 'red', 'green', 'white']
}

const Ornament: React.FC<{ message: Message; onClick: () => void }> = ({ message, onClick }) => {
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: `${message.x}%`, top: `${message.y}%` }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-gold shadow-lg flex items-center justify-center text-white font-bold">
        {message.sender[0].toUpperCase()}
      </div>
    </motion.div>
  )
}

export default function Component({ params }: { params: { username: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentScene, setCurrentScene] = useState(0)
  const [countdown, setCountdown] = useState('')
  const [showGift, setShowGift] = useState(false)
  const [showEGiftModal, setShowEGiftModal] = useState(false)
  const [selectedGift, setSelectedGift] = useState<EGift | null>(null)
  const [recipientUsername, setRecipientUsername] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [receivedGifts, setReceivedGifts] = useState<ReceivedGift[]>([])
  const [selectedReceivedGift, setSelectedReceivedGift] = useState<ReceivedGift | null>(null)
  const [giftMessage, setGiftMessage] = useState('')
  const [giftWrapping, setGiftWrapping] = useState({
    color: giftWrappings.colors[0],
    pattern: giftWrappings.patterns[0],
    ribbon: giftWrappings.ribbons[0]
  })
  const [isUnwrapping, setIsUnwrapping] = useState(false)
  const [showChristmasCards, setShowChristmasCards] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const christmas = new Date(now.getFullYear(), 11, 25) // Month is 0-indexed
      if (now > christmas) christmas.setFullYear(christmas.getFullYear() + 1)
      const diff = christmas.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: Date.now(),
        content: newMessage,
        sender: `Friend ${messages.length + 1}`,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
      setShowMessageForm(false)
    }
  }

  const changeScene = (direction: 'next' | 'prev') => {
    setCurrentScene(prev => {
      if (direction === 'next') return (prev + 1) % scenes.length
      return prev === 0 ? scenes.length - 1 : prev - 1
    })
  }

  const handleSendGift = () => {
    if (selectedGift && recipientUsername) {
      // In a real application, you would send this to a server
      console.log(`Sent ${selectedGift.name} to ${recipientUsername}`)
      
      // Simulate receiving a gift (for demo purposes)
      const newGift: ReceivedGift = {
        id: Date.now().toString(),
        from: 'Santa',
        gift: selectedGift,
        message: giftMessage,
        wrapping: giftWrapping
      }
      setReceivedGifts(prev => [...prev, newGift])

      // Reset form
      setSelectedGift(null)
      setRecipientUsername('')
      setGiftMessage('')
      setGiftWrapping({
        color: giftWrappings.colors[0],
        pattern: giftWrappings.patterns[0],
        ribbon: giftWrappings.ribbons[0]
      })
      setShowEGiftModal(false)
    }
  }

  const handleUnwrapGift = () => {
    if (receivedGifts.length > 0) {
      setIsUnwrapping(true)
      setTimeout(() => {
        setSelectedReceivedGift(receivedGifts[0])
        setReceivedGifts(prev => prev.slice(1))
        setIsUnwrapping(false)
      }, 3000) // Simulating unwrapping animation time
    }
    setShowGift(false)
  }

  const handleSendChristmasCard = (card: ChristmasCard, customTexts: CustomText[], recipient: string) => {
    // In a real application, you would send this to a server
    console.log(`Sent Christmas card ${card.id} to ${recipient} with ${customTexts.length} custom texts`)
    
    // Simulate receiving a gift (for demo purposes)
    const newGift: ReceivedGift = {
      id: Date.now().toString(),
      from: 'Santa',
      gift: {
        id: card.id,
        name: 'Custom Christmas Card',
        image: card.image,
        description: 'A beautifully customized Christmas card'
      },
      message: customTexts.map(text => text.text).join(' '),
      wrapping: {
        color: 'red',
        pattern: 'snowflakes',
        ribbon: 'gold'
      }
    }
    setReceivedGifts(prev => [...prev, newGift])
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-blue-900 to-indigo-900">
      {/* Background Scene */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          className="fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={scenes[currentScene].src}
            alt={scenes[currentScene].alt}
            layout="fill"
            objectFit="cover"
            objectPosition="center 20%"
            priority
            className="select-none opacity-60"
          />
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Snowfall */}
      <Snowfall 
        snowflakeCount={200}
        radius={[0.5, 2.5]}
        speed={[0.5, 1.5]}
        wind={[-0.5, 1]}
      />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center">
        {/* Decorative Border */}
        <div className="absolute inset-4 border-4 border-white/20 rounded-3xl pointer-events-none" />

        {/* Title and Countdown */}
        <div className="mt-4 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {params.username}&apos;s JingleBox
          </motion.h1>
          <motion.div
            className="mt-2 text-xl text-white/80 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Calendar className="mr-2" />
            <span>{countdown} until Christmas!</span>
          </motion.div>
        </div>

        {/* Main Content Area with Tree */}
        <div className="flex-1 w-full flex flex-col items-center justify-end">
          {/* Christmas Tree with Ornaments */}
          <div className="relative w-[90%] max-w-2xl aspect-[3/4] mb-20">
            <Image
              src="/tree-classic.png"
              alt="Christmas Tree"
              layout="fill"
              objectFit="contain"
              priority
              className="select-none"
            />
            {messages.map((message) => (
              <Ornament
                key={message.id}
                message={message}
                onClick={() => setSelectedMessage(message)}
              />
            ))}
            {/* Animated Star */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-yellow-400"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </motion.div>
          </div>

          {/* Control Panel */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 md:gap-8">
            {/* Gifts */}
            <motion.div 
              className="flex gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                className="relative w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-xl shadow-lg flex items-center justify-center
                           hover:brightness-110 transition-all"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setShowGift(true)}
              >
                <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
                {receivedGifts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {receivedGifts.length}
                  </span>
                )}
              </motion.button>
            </motion.div>

            {/* Control Buttons */}
            <motion.button
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500 hover:bg-red-600 
                         transition-colors shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Music className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.button>

            <motion.button
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-500 hover:bg-purple-600 
                         transition-colors shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMessageForm(true)}
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.button>

            <motion.button
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-500 hover:bg-yellow-600 
                         transition-colors shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEGiftModal(true)}
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.button>

            <motion.button
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500 hover:bg-green-600 
                         transition-colors shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChristmasCards(true)}
            >
              <PenTool className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Scene Navigation */}
        <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center">
          <motion.button
            className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeScene('prev')}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeScene('next')}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Message Form Modal */}
      <AnimatePresence>
        {showMessageForm && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full max-w-md mx-auto border border-white/30 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Add a Message</h2>
                <motion.button
                  onClick={() => setShowMessageForm(false)}
                  className="text-white/70 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your holiday message..."
                className="w-full p-4 rounded-xl bg-white/10 border border-white/30 
                          focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                          transition-colors resize-none mb-6 h-32 text-white placeholder-white/50"
              />
              
              <div className="flex justify-end">
                <motion.button
                  onClick={handleAddMessage}
                  className="bg-purple-500 text-white px-6 py-3 rounded-xl font-medium
                           hover:bg-purple-600 transition-colors flex items-center gap-2 shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Send</span>
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift Unwrapping Modal */}
      <AnimatePresence>
        {showGift && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full max-w-md mx-auto border border-white/30 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Your Gifts</h2>
                <motion.button
                  onClick={() => setShowGift(false)}
                  className="text-white/70 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              {receivedGifts.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-white">You have {receivedGifts.length} gift(s) to unwrap!</p>
                  <motion.button
                    onClick={handleUnwrapGift}
                    className="w-full bg-green-500 text-white px-6 py-3 rounded-xl font-medium
                             hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isUnwrapping}
                  >
                    <span>{isUnwrapping ? 'Unwrapping...' : 'Unwrap a Gift'}</span>
                    <Gift className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <p className="text-white text-center">No gifts to unwrap right now. Send some to your friends!</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* E-Gift Modal */}
      <AnimatePresence>
        {showEGiftModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full max-w-md mx-auto border border-white/30 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Send an E-Gift</h2>
                <motion.button
                  onClick={() => setShowEGiftModal(false)}
                  className="text-white/70 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Choose a gift:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {eGifts.map((gift) => (
                      <motion.div
                        key={gift.id}
                        className={`p-2 rounded-lg cursor-pointer ${
                          selectedGift?.id === gift.id ? 'bg-purple-500' : 'bg-white/10'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedGift(gift)}
                      >
                        <Image
                          src={gift.image}
                          alt={gift.name}
                          width={100}
                          height={100}
                          className="mx-auto mb-2"
                        />
                        <p className="text-white text-center text-sm">{gift.name}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-white mb-2">
                    Recipient's username:
                  </label>
                  <input
                    type="text"
                    id="recipient"
                    value={recipientUsername}
                    onChange={(e) => setRecipientUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label htmlFor="giftMessage" className="block text-sm font-medium text-white mb-2">
                    Add a message:
                  </label>
                  <textarea
                    id="giftMessage"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/50 resize-none h-24"
                    placeholder="Write a message to go with your gift..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Customize wrapping:</label>
                  <div className="flex space-x-2">
                    <select
                      value={giftWrapping.color}
                      onChange={(e) => setGiftWrapping({...giftWrapping, color: e.target.value})}
                      className="bg-white/10 border border-white/30 rounded-md text-white"
                    >
                      {giftWrappings.colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                    <select
                      value={giftWrapping.pattern}
                      onChange={(e) => setGiftWrapping({...giftWrapping, pattern: e.target.value})}
                      className="bg-white/10 border border-white/30 rounded-md text-white"
                    >
                      {giftWrappings.patterns.map(pattern => (
                        <option key={pattern} value={pattern}>{pattern}</option>
                      ))}
                    </select>
                    <select
                      value={giftWrapping.ribbon}
                      onChange={(e) => setGiftWrapping({...giftWrapping, ribbon: e.target.value})}
                      className="bg-white/10 border border-white/30 rounded-md text-white"
                    >
                      {giftWrappings.ribbons.map(ribbon => (
                        <option key={ribbon} value={ribbon}>{ribbon}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={handleSendGift}
                className="mt-6 w-full bg-purple-500 text-white px-6 py-3 rounded-xl font-medium
                         hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Send Gift</span>
                <Send className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Display Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full max-w-md mx-auto border border-white/30 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Message from {selectedMessage.sender}</h2>
                <motion.button
                  onClick={() => setSelectedMessage(null)}
                  className="text-white/70 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              <p className="text-white text-lg">{selectedMessage.content}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Received Gift Display Modal */}
      <AnimatePresence>
        {selectedReceivedGift && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full max-w-md mx-auto border border-white/30 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">You received a gift!</h2>
                <motion.button
                  onClick={() => setSelectedReceivedGift(null)}
                  className="text-white/70 hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              <div className="text-center">
                <p className="text-white text-lg mb-4">From: {selectedReceivedGift.from}</p>
                <motion.div
                  className="relative w-48 h-48 mx-auto mb-4"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 1 }}
                >
                  <Image
                    src={selectedReceivedGift.gift.image}
                    alt={selectedReceivedGift.gift.name}
                    layout="fill"
                    objectFit="contain"
                  />
                </motion.div>
                <p className="text-white text-xl font-semibold mb-2">{selectedReceivedGift.gift.name}</p>
                <p className="text-white mb-4">{selectedReceivedGift.gift.description}</p>
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-white italic">&quot;{selectedReceivedGift.message}&quot;</p>
                </div>
                <div className="flex justify-center space-x-2 mb-4">
                  <Sparkles className="text-yellow-400" />
                  <p className="text-white">Wrapped in {selectedReceivedGift.wrapping.color} paper with {selectedReceivedGift.wrapping.pattern} pattern and a {selectedReceivedGift.wrapping.ribbon} ribbon</p>
                  <Sparkles className="text-yellow-400" />
                </div>
                <motion.button
                  className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium
                           hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg mx-auto"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedReceivedGift(null)}
                >
                  <span>Close</span>
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Christmas Cards Modal */}
      <AnimatePresence>
        {showChristmasCards && (
          <ChristmasCards
            onClose={() => setShowChristmasCards(false)}
            onSend={handleSendChristmasCard}
          />
        )}
      </AnimatePresence>
    </div>
  )
}