'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams, useParams } from 'next/navigation'
import { Gift, MessageCircle, X, ChevronLeft, ChevronRight, Mail, AlertTriangle, Send, Loader2, Palette, Mountain, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleGenerativeAI, type Part } from '@google/generative-ai'


// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

const ActionButton = ({ icon: Icon, label, onClick, color, badge }: { icon: React.ElementType; label: string; onClick: () => void; color: string; badge?: number }) => (
  <button
    onClick={onClick}
    className={`${color} text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 relative`}
    style={{ width: '60px', height: '60px' }}
    aria-label={label}
  >
    <Icon className="w-7 h-7" />
    {badge && badge > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center" aria-label={`${badge} new items`}>
        {badge}
      </span>
    )}
  </button>
)

interface Message {
  id: string;
  text: string;
  position: { x: number; y: number };
  itemType: string;
  sender: string;
}

const christmasItems = [
  'joystick', 'gamepad', 'candy-cane', 'gingerbread-man', 'gift-box', 'snowflake', 'bell', 'santa-hat'
]

const ornamentPositions = [
  { x: 50, y: 15 },
  { x: 45, y: 25 }, { x: 55, y: 25 },
  { x: 40, y: 35 }, { x: 50, y: 35 }, { x: 60, y: 35 },
  { x: 35, y: 45 }, { x: 45, y: 45 }, { x: 55, y: 45 }, { x: 65, y: 45 },
  { x: 30, y: 55 }, { x: 40, y: 55 }, { x: 50, y: 55 }, { x: 60, y: 55 }, { x: 70, y: 55 },
  { x: 25, y: 65 }, { x: 35, y: 65 }, { x: 45, y: 65 }, { x: 55, y: 65 }, { x: 65, y: 65 }, { x: 75, y: 65 },
  { x: 20, y: 75 }, { x: 30, y: 75 }, { x: 40, y: 75 }, { x: 50, y: 75 }, { x: 60, y: 75 }, { x: 70, y: 75 }, { x: 80, y: 75 }
]

const treeColors = [
  { name: 'Emerald', value: '#2ecc71' },
  { name: 'Forest', value: '#27ae60' },
  { name: 'Mint', value: '#1abc9c' },
  { name: 'Pine', value: '#16a085' }
]

const scenes = [
  { name: 'Winter Wonderland', value: 'winter-wonderland', src: 'https://media.discordapp.net/attachments/1193183717548638301/1306303268380741743/5d0facfe-f371-44a6-85e5-1b0867ff4d4c_image.png?ex=673ebef9&is=673d6d79&hm=8e3574e6c94f30d2cb6965ade2f2e3ddc13c446ac90f5ff36f5c8157b4ddb449&=&format=webp&quality=lossless&width=550&height=314', alt: 'Snowy landscape with pine trees' },
  { name: 'Cozy Cabin', value: 'cozy-cabin', src: '/snow.jpg', alt: 'Warm cabin interior with fireplace' },
  { name: 'Starry Night', value: 'starry-night', src: '/starry.jpg', alt: 'Night sky filled with stars' },
  { name: 'Northern Lights', value: 'northern-lights', src: '/northern.jpg', alt: 'Aurora borealis over snowy mountains' },
]

const Dialog = ({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-red-100 to-green-100 rounded-3xl p-8 max-w-2xl w-full mx-4 h-[90vh] relative shadow-lg">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16">
          <Image src="/christmas-items/santa-hat.png" alt="Christmas Hat" width={64} height={64} />

        </div>
        
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-500 rounded-full border-4 border-yellow-400 animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-yellow-400 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-500 rounded-full border-4 border-yellow-400 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-yellow-500 rounded-full border-4 border-yellow-400 animate-pulse"></div>
        
        <div className="mt-6 h-full flex flex-col">
          <h2 className="text-3xl font-bold text-center mb-6 text-green-800">{title}</h2>
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500 hover:text-red-700" aria-label="Close">
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

const EGiftCard = ({ theme, selected, onClick }: { theme: string; selected: boolean; onClick: () => void }) => {
  const themes = {
    'christmas-tree': {
      title: 'Christmas Tree',
      gradient: 'from-green-500 to-green-700',
      icon: '🎄'
    },
    'santa': {
      title: 'Santa',
      gradient: 'from-red-500 to-red-700',
      icon: '🎅'
    },
    'snowman': {
      title: 'Snowman',
      gradient: 'from-blue-400 to-blue-600',
      icon: '⛄'
    }
  }

  const currentTheme = themes[theme as keyof typeof themes]

  return (
    <div 
      className={`cursor-pointer transition-all p-6 rounded-lg bg-gradient-to-br ${currentTheme.gradient} ${
        selected ? 'ring-2 ring-white shadow-lg scale-105' : 'hover:shadow-md'
      }`}
      onClick={onClick}
      role="button"
      aria-pressed={selected}
      aria-label={`Select ${currentTheme.title} theme`}
    >
      <div className="text-center text-white">
        <div className="text-4xl mb-2">{currentTheme.icon}</div>
        <div className="font-medium">{currentTheme.title}</div>
        <div className="text-sm opacity-75">Digital Card</div>
      </div>
    </div>
  )
}

const GiftingDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('christmas-tree')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the e-gift submission
    console.log({
      theme: selectedTheme,
      recipientName,
      recipientEmail,
      message
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-red-100 to-green-100 rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16">
          <Image src="/christmas-items/santa-hat.png" alt="Christmas Hat" width={64} height={64} />
        </div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" aria-label="Close">
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Send a Christmas E-Card</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {['christmas-tree', 'santa', 'snowman'].map((theme) => (
              <EGiftCard
                key={theme}
                theme={theme}
                selected={selectedTheme === theme}
                onClick={() => setSelectedTheme(theme)}
              />
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">Recipient's Name</label>
              <input
                id="recipientName"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter recipient's name"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700">Recipient's Email</label>
              <input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter recipient's email"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Christmas Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your festive message here..."
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-md hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            Send Christmas E-Card
          </button>
        </form>
      </div>
    </div>
  )
}

const MessageBubble = ({ sender, text }: { sender: string; text: string }) => (
  <div className="relative group">
    <div 
      className="relative bg-white p-6 rounded-[32px] transition-transform hover:scale-[1.02]"
      style={{
        boxShadow: `
          2px 2px 0 rgba(0,0,0,0.1),
          4px 4px 0 rgba(0,0,0,0.1),
          -1px -1px 0 rgba(0,0,0,0.1) inset,
          -2px -2px 0 rgba(0,0,0,0.1) inset
        `,
        border: '3px solid black'
      }}
    >
      {/* Corner accents */}
      <svg className="absolute -top-1 -left-1 w-6 h-6 text-black" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 22 L22 2" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <svg className="absolute -top-1 -right-1 w-6 h-6 text-black" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 2 L22 22" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <svg className="absolute -bottom-1 -left-1 w-6 h-6 text-black" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 2 L22 22" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <svg className="absolute -bottom-1 -right-1 w-6 h-6 text-black" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 22 L22 2" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>

      {/* Content */}
      <div className="relative">
        <h3 
          className="font-bold text-xl mb-2" 
          style={{ 
            fontFamily: '"Comic Sans MS", cursive',
            textShadow: '1px 1px 0 rgba(0,0,0,0.1)'
          }}
        >
          {sender}
        </h3>
        <p 
          className="text-gray-700" 
          style={{ fontFamily: '"Comic Sans MS", cursive' }}
        >
          {text}
        </p>
      </div>

      {/* Speech bubble tail */}
      <div className="absolute -bottom-4 left-8 w-8 h-8">
        <div 
          className="absolute inset-0 bg-white transform rotate-45"
          style={{
            border: '3px solid black',
            borderTop: 'none',
            borderLeft: 'none'
          }}
        />
      </div>
    </div>

    {/* Snowflakes decoration */}
    <div className="absolute -top-2 left-1/4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">❄️</div>
    <div className="absolute -top-2 right-1/4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">❄️</div>
    <div className="absolute -bottom-2 left-1/3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">❄️</div>
    <div className="absolute -bottom-2 right-1/3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">❄️</div>
  </div>
);

const Snowfall = () => (
  <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      >
        ❄️
      </div>
    ))}
  </div>
)

const ChristmasLights = () => (
  <div className="fixed top-0 left-0 w-full h-8 z-40" aria-hidden="true">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-4 h-4 rounded-full animate-twinkle"
        style={{
          left: `${i * 5}%`,
          backgroundColor: ['red', 'green', 'blue', 'yellow'][i % 4],
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
)

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'santa'
  timestamp: Date
}

const ChatWithSanta = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Ho ho ho! I'm Santa Claus! What would you like to talk about?",
      role: 'santa',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState<any>(null)

  useEffect(() => {
    async function loadModel() {
      const modelAttachment = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snippet-JK9ZdY144njlWc7ycNzD64vTQWklRS.txt')
      const modelContent = await modelAttachment.text()
      const generativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const chat = await generativeModel.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: modelContent }] as Part[],
          },
          {
            role: "model",
            parts: [{ text: "Understood. I will act as Santa Claus and respond to messages in that character." }] as Part[],
          },
        ],
      })
      setModel(chat)
    }
    loadModel()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading || !model) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const result = await model.sendMessage(userMessage.content)
      const response = await result.response
      const santaMessage: ChatMessage = {
        id: Date.now().toString(),
        content: response.text() || "Ho ho ho! Let me think about that...",
        role: 'santa',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, santaMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "Ho ho ho! My elves are having trouble with the connection. Can you try again?",
        role: 'santa',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-red-100 to-green-100 rounded-3xl p-8 max-w-2xl w-full mx-4 h-[90vh] relative shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500 hover:text-red-700" aria-label="Close chat">
          <X size={24} />
        </button>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              <Image
                src="/christmas-items/santa-hat.png"
                alt="Santa's avatar"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">Chat with Santa</h2>
              <p className="text-sm opacity-90">Powered by Christmas Magic ✨</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-2xl p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                </div>
              </motion.div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Santa anything..."
              className="flex-1 rounded-full px-4 py-2 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              <span className="sr-only">Send message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ChristmasPage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const [timeUntilChristmas, setTimeUntilChristmas] = useState('')
  const [showMessagePopup, setShowMessagePopup] = useState(false)
  const [showMessagesPopup, setShowMessagesPopup] = useState(false)
  const [showGiftingPopup, setShowGiftingPopup] = useState(false)
  const [showChatWithSanta, setShowChatWithSanta] = useState(false)
  const [message, setMessage] = useState('')
  const [senderName, setSenderName] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [currentScene, setCurrentScene] = useState(0)
  const treeRef = useRef<HTMLDivElement>(null)
  const [treeColor, setTreeColor] = useState(treeColors[0].value)
  const [scene, setScene] = useState(scenes[0].value)

  useEffect(() => {
    const calculateTimeUntilChristmas = () => {
      const now = new Date()
      const currentYear = now.getFullYear()
      const christmas = new Date(currentYear, 11, 25)
      if (now > christmas) christmas.setFullYear(currentYear + 1)
      
      const difference = christmas.getTime() - now.getTime()
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      
      setTimeUntilChristmas(`${days}d ${hours}h ${minutes}m until Christmas!`)
    }

    calculateTimeUntilChristmas()
    const timer = setInterval(calculateTimeUntilChristmas, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const urlMessage = searchParams.get('message')
    if (urlMessage) {
      handleMessageSubmit(null, urlMessage)
    }
  }, [searchParams])

  useEffect(() => {
    const savedTheme = localStorage.getItem('jingleboxTheme')
    if (savedTheme) {
      const { treeColor: savedTreeColor, scene: savedScene } = JSON.parse(savedTheme)
      setTreeColor(savedTreeColor)
      setScene(savedScene)
      
      // Set the initial scene based on the saved customization
      const sceneIndex = scenes.findIndex(s => s.value === savedScene)
      if (sceneIndex !== -1) {
        setCurrentScene(sceneIndex)
      }
    }
  }, [])

  const handleMessageSubmit = (e: React.FormEvent | null, urlMessage?: string) => {
    if (e) e.preventDefault()
    const messageToAdd = urlMessage || message
    const sender = senderName.trim() || 'Anonymous'
    if (messageToAdd.trim() && treeRef.current) {
      const availablePositions = ornamentPositions.filter(
        pos => !messages.some(msg => msg.position.x === pos.x && msg.position.y === pos.y)
      )
      
      if (availablePositions.length > 0) {
        const position = availablePositions[Math.floor(Math.random() * availablePositions.length)]
        const newMessage: Message = {
          id: Date.now().toString(),
          text: messageToAdd.trim(),
          position: position,
          itemType: christmasItems[Math.floor(Math.random() * christmasItems.length)],
          sender: sender
        }
        setMessages(prevMessages => [...prevMessages, newMessage])
        setMessage('')
        setSenderName('')
        setShowMessagePopup(false)
      } else {
        alert("The tree is full of ornaments! Remove some to add more.")
      }
    }
  }

  const changeScene = (direction: 'next' | 'prev') => {
    setCurrentScene(prev => {
      if (direction === 'next') return (prev + 1) % scenes.length
      return prev === 0 ? scenes.length - 1 : prev - 1
    })
  }

  const isChristmasDay = () => {
    const now = new Date()
    return now.getMonth() === 11 && now.getDate() === 25
  }

  const handleViewMessages = () => {
    if (isChristmasDay()) {
      setShowMessagesPopup(true)
    } else {
      alert("Messages can only be opened on Christmas Day (December 25th)!")
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
      <Snowfall />
      <ChristmasLights />
      <div className="absolute inset-0 bg-[url('/snowflake-pattern.png')] opacity-20"></div>
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
            quality={100}
            priority
          />
        </motion.div>
      </AnimatePresence>
      <div ref={treeRef} className="absolute inset-0 flex items-end justify-center pb-8">
        <div className="relative w-[400px] h-[600px]">
          <Image
            src="/tree-classic.png"
            alt="Christmas Tree"
            layout="fill"
            objectFit="contain"
            priority
            style={{
              filter: `hue-rotate(${treeColors.findIndex(c => c.value === treeColor) * 30}deg)`,
            }}
          />
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{
                position: 'absolute',
                left: `${msg.position.x}%`,
                top: `${msg.position.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
              }}
            >
              <Image
                src={`/christmas-items/${msg.itemType}.png`}
                alt={msg.itemType}
                width={32}
                height={32}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen p-6">
        <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white font-medium shadow-lg">
          {timeUntilChristmas}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 md:mb-12 text-white drop-shadow-lg">
          Merry Christmas!
        </h1>

        <div className="flex items-center gap-4 mt-auto mb-8">
          <ActionButton
            icon={Gift}
            label="Send Gift"
            onClick={() => setShowGiftingPopup(true)}
            color="bg-gradient-to-br from-red-500 to-red-700"
          />
          <ActionButton
            icon={MessageCircle}
            label="Add Message"
            onClick={() => setShowMessagePopup(true)}
            color="bg-gradient-to-br from-purple-500 to-purple-700"
          />
          <ActionButton
            icon={Mail}
            label="View Messages"
            onClick={handleViewMessages}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            badge={messages.length}
          />
          <ActionButton
            icon={MessageCircle}
            label="Chat with Santa"
            onClick={() => setShowChatWithSanta(true)}
            color="bg-gradient-to-br from-red-500 to-green-500"
          />
        </div>

        <div className="absolute top-1/2 left-4 right-4 flex justify-between items-center">
          <motion.button
            className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeScene('prev')}
            aria-label="Previous scene"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => changeScene('next')}
            aria-label="Next scene"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      <Dialog 
        isOpen={showMessagePopup} 
        onClose={() => setShowMessagePopup(false)}
        title="Add a Message"
      >
        <form onSubmit={handleMessageSubmit} className="space-y-4">
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-300"
          >
            Add to Tree
          </button>
        </form>
      </Dialog>

      <Dialog 
        isOpen={showMessagesPopup} 
        onClose={() => setShowMessagesPopup(false)}
        title="Christmas Messages"
      >
        <div className="h-full overflow-y-auto space-y-4 pr-2">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <MessageBubble 
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
              />
            ))
          ) : (
            <div className="text-center">
              <AlertTriangle className="mx-auto text-yellow-500 mb-2" size={48} />
              <p className="text-gray-700">No messages yet. Add some to the tree!</p>
            </div>
          )}
        </div>
      </Dialog>

      <GiftingDialog 
        isOpen={showGiftingPopup}
        onClose={() => setShowGiftingPopup(false)}
      />

      <ChatWithSanta 
        isOpen={showChatWithSanta}
        onClose={() => setShowChatWithSanta(false)}
      />
    </div>
  )
}