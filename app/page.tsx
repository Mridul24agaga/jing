'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Loader, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Snowfall from 'react-snowfall'
import useSound from 'use-sound'
import confetti from 'canvas-confetti'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import BackgroundDecorations from './BackgroundDecorations'
import FindJingleBox from './FindJingleBox'
import show from "@/public/show.gif"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const slides = [
  {
    title: "Welcome to JingleBox.pro!",
    content: "JingleBox is your personal Christmas hub. Create, customize, and share your holiday spirit with friends and family. Whether you're new or returning, let's spread some cheer!",
    image: "/intro.jpeg"
  },
  {
    title: "Create Your JingleBox",
    content: "New user? Choose a unique name for your JingleBox page. This will be your custom URL. Returning user? You can find your existing JingleBox or create a new one!",
    image: "/video.gif"
  },
  {
    title: "Customize Your Page",
    content: "Make your JingleBox truly yours! Add personal Christmas messages, upload festive photos, choose from various themes, and even set a countdown to your special day.",
    image: "/customise.gif"
  },
  {
    title: "Share the Magic",
    content: "Once your JingleBox is ready, share your unique link with loved ones. They can visit your page, leave messages, and feel the warmth of your virtual Christmas celebration!",
    image: "/final.gif"
  }
]

const ChristmasCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const christmasDate = new Date(now.getFullYear(), 11, 25) // December 25th
      if (now > christmasDate) christmasDate.setFullYear(christmasDate.getFullYear() + 1)
      const difference = christmasDate.getTime() - now.getTime()

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      })
    }
  
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-2">Christmas Countdown</h2>
      <div className="flex justify-center space-x-4">
        <div>
          <span className="text-4xl font-bold">{timeLeft.days}</span>
          <p>Days</p>
        </div>
        <div>
          <span className="text-4xl font-bold">{timeLeft.hours}</span>
          <p>Hours</p>
        </div>
        <div>
          <span className="text-4xl font-bold">{timeLeft.minutes}</span>
          <p>Minutes</p>
        </div>
        <div>
          <span className="text-4xl font-bold">{timeLeft.seconds}</span>
          <p>Seconds</p>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showFindJingleBox, setShowFindJingleBox] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const [showSlideshow, setShowSlideshow] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const [playJingleBells, { stop: stopJingleBells }] = useSound('/sounds/jingle-bells.mp3', { loop: true })
  const [playClick] = useSound('/sounds/click.mp3')

  useEffect(() => {
    const hasSeenSlideshow = localStorage.getItem('hasSeenSlideshow')
    if (!hasSeenSlideshow) {
      setShowSlideshow(true)
    }
  }, [])

  useEffect(() => {
    if (isSoundOn) {
      playJingleBells()
    } else {
      stopJingleBells()
    }

    return () => {
      stopJingleBells()
    }
  }, [isSoundOn, playJingleBells, stopJingleBells])

  const handleCloseSlideshow = () => {
    setShowSlideshow(false)
    localStorage.setItem('hasSeenSlideshow', 'true')
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    playClick()
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    if (!username.trim()) {
      setShowSignUp(true)
      setIsLoading(false)
      return
    }

    const { data: existingUser } = await supabase
      .from('christmas_pages')
      .select('username')
      .eq('username', username.trim())
      .single()

    if (existingUser) {
      setShowSignUp(true)
    } else {
      setShowSignUp(true)
    }

    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      })

      if (error) throw error

      if (data.user) {
        await supabase
          .from('christmas_pages')
          .insert([{ username: username.trim(), user_id: data.user.id }])

        await supabase
          .from('user_profiles')
          .insert([{ user_id: data.user.id, username: username.trim() }])

        router.push(`/customize/${username.trim()}`)
      }
    } catch (error) {
      console.error('Error during sign up:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B4513] via-green-800 to-blue-900 text-white p-4 md:p-8 relative overflow-hidden">
      <AnimatePresence>
        {showSlideshow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
              <button 
                onClick={handleCloseSlideshow}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                <X size={24} />
              </button>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-black">{slides[currentSlide].title}</h2>
                  <div className="relative w-full aspect-video mb-6">
                    <Image
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
                    />
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg mb-6">{slides[currentSlide].content}</p>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between mt-4 sm:mt-8">
                <button
                  onClick={prevSlide}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <div className="mt-4 flex justify-center space-x-2">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentSlide ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Snowfall snowflakeCount={200} />
      <BackgroundDecorations />
      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-center mb-8 mt-16"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-red-300">Jingle</span>
        <span className="text-green-300">Box</span>
        <span className="text-blue-300">.pro</span>
      </motion.h1>

      <ChristmasCountdown />
      
      <AnimatePresence mode="wait">
        {!showFindJingleBox ? (
          <motion.div 
            key="create-form"
            className="max-w-md mx-auto bg-gray-900 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-2xl p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Create Your Christmas Page</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Choose your page name
                </label>
                <div className="flex rounded-lg overflow-hidden bg-gray-800">
                  <span className="inline-flex items-center px-3 border-r border-gray-700 bg-gray-700 text-gray-300 text-sm font-mono">
                    jinglebox.pro/
                  </span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    className="flex-1 block w-full px-3 py-2 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                    placeholder="yourpagename"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              
              <motion.button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin mr-2" size={20} />
                ) : (
                  <Gift className="mr-2" size={20} />
                )}
                {isLoading ? 'Creating Your JingleBox...' : 'Claim My Jingle Page'}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="find-form"
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <FindJingleBox />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-gray-300">
{showFindJingleBox ? "Don't have a page yet?" : "Already have a page?"}
        </p>
        <button
          onClick={() => setShowFindJingleBox(!showFindJingleBox)}
          className="text-yellow-300 hover:underline"
        >
          {showFindJingleBox ? "Create a new JingleBox" : "Find an existing JingleBox"}
        </button>
      </motion.div>

      <motion.button
        onClick={() => setIsSoundOn(!isSoundOn)}
        className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white font-bold p-3 rounded-full transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>

      <AnimatePresence>
        {showSignUp && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            style={{ zIndex: 50 }}
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
                <h2 className="text-2xl font-bold">Sign Up</h2>
                <button onClick={() => setShowSignUp(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

