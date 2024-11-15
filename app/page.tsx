'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Gift, Snowflake, Loader, Volume2, VolumeX, TreesIcon as Tree, Star } from 'lucide-react'
import Snowfall from 'react-snowfall'
import useSound from 'use-sound'
import confetti from 'canvas-confetti'

const ChristmasCountdown = () => {
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
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div 
          key={unit} 
          className="text-center bg-red-600 rounded-lg p-4 shadow-lg"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="text-2xl md:text-4xl font-bold"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            {value}
          </motion.div>
          <div className="text-xs md:text-sm uppercase">{unit}</div>
        </motion.div>
      ))}
    </div>
  )
}

const AnimatedChristmasTree = () => {
  return (
    <motion.div
      className="absolute left-4 md:left-10 bottom-4 md:bottom-10 text-green-500"
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
    >
      <Tree size={50} className="md:w-24 md:h-24" />
    </motion.div>
  )
}

const FallingGifts = () => {
  const gifts = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
  }))

  return (
    <>
      {gifts.map((gift) => (
        <motion.div
          key={gift.id}
          className="absolute text-red-500"
          style={{ left: `${gift.x}%` }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: '100vh', opacity: 1 }}
          transition={{ duration: 10, repeat: Infinity, delay: gift.delay }}
        >
          <Gift size={24} />
        </motion.div>
      ))}
    </>
  )
}

const CursorTrail = () => {
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const updateMousePosition = useCallback((ev: MouseEvent) => {
    setMousePosition({ x: ev.clientX, y: ev.clientY })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [updateMousePosition])

  useEffect(() => {
    const timer = setInterval(() => {
      setTrail((prevTrail) => [
        ...prevTrail.slice(-20),
        { x: mousePosition.x, y: mousePosition.y, id: Date.now() },
      ])
    }, 50)

    return () => clearInterval(timer)
  }, [mousePosition])

  return (
    <>
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed pointer-events-none"
          style={{
            left: point.x,
            top: point.y,
            position: 'fixed',
            width: 10,
            height: 10,
            backgroundColor: `hsl(${index * 10}, 100%, 50%)`,
            borderRadius: '50%',
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 1 }}
        />
      ))}
    </>
  )
}

const TwinklingStars = () => {
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
  }))

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-yellow-200"
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        >
          <Star size={star.size} />
        </motion.div>
      ))}
    </>
  )
}

const FestiveGreeting = () => {
  const greetings = [
    "Merry Christmas!",
    "Happy Holidays!",
    "Season's Greetings!",
    "Joy to the World!",
    "Let it Snow!",
  ]

  const [currentGreeting, setCurrentGreeting] = useState(greetings[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreeting(greetings[Math.floor(Math.random() * greetings.length)])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl md:text-4xl font-bold text-yellow-300"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      key={currentGreeting}
    >
      {currentGreeting}
    </motion.div>
  )
}

const SurpriseGift = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [playUnwrap] = useSound('/sounds/unwrap.mp3')

  const handleClick = () => {
    setIsOpen(!isOpen)
    playUnwrap()
  }

  return (
    <motion.div
      className="absolute right-4 md:right-10 bottom-20 cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
    >
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-300 text-red-600 p-4 rounded-lg shadow-lg"
        >
          <p className="font-bold">You're awesome!</p>
          <p className="text-sm">Spread the joy!</p>
        </motion.div>
      ) : (
        <Gift size={40} className="md:w-16 md:h-16 text-red-500" />
      )}
    </motion.div>
  )
}

const AnimatedSantaSleigh = () => {
  const controls = useAnimation()
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updatePosition = () => {
      const newX = Math.random() * 100
      const newY = Math.random() * 100
      setPosition({ x: newX, y: newY })
    }

    // Initial position update
    updatePosition()

    // Set up interval to update position every 2-3 minutes
    const interval = setInterval(() => {
      updatePosition()
    }, (2 + Math.random()) * 60 * 1000) // Random time between 2-3 minutes

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    controls.start({
      x: `${position.x}%`,
      y: `${position.y}%`,
      transition: { duration: 5, ease: "easeInOut" }
    })
  }, [position, controls])

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
      animate={controls}
    >
      <motion.img
        src="https://media.discordapp.net/attachments/1193183717548638301/1306676569800048740/4c137b49-c6fc-4295-b4db-7511490e4546_image-removebg-preview_1.png?ex=6738da63&is=673788e3&hm=987f7105470d6cf3fa130646f997cdbe34190fa465f1a1f4922febb5938071cf&=&format=webp&quality=lossless"
        alt="Santa's Sleigh"
        className="w-32 h-auto md:w-64"
        animate={{
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}

const FloatingLyrics = () => {
  const lyrics = [
    "Jingle bells, jingle bells",
    "Jingle all the way",
    "Oh what fun it is to ride",
    "In a one-horse open sleigh",
    "Dashing through the snow",
    "In a one-horse open sleigh",
    "O'er the fields we go",
    "Laughing all the way",
  ]

  return (
    <>
      {lyrics.map((line, index) => (
        <motion.div
          key={index}
          className="absolute text-white text-opacity-50 pointer-events-none"
          initial={{ opacity: 0, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          animate={{
            opacity: [0, 1, 0],
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: index * 2,
          }}
        >
          {line}
        </motion.div>
      ))}
    </>
  )
}

export default function LandingPage() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  const router = useRouter()

  const [playJingleBells, { stop: stopJingleBells }] = useSound('/sounds/jingle-bells.mp3', { loop: true })
  const [playClick] = useSound('/sounds/click.mp3')

  useEffect(() => {
    if (isSoundOn) {
      playJingleBells()
    } else {
      stopJingleBells()
    }
  }, [isSoundOn, playJingleBells, stopJingleBells])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    playClick()
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    // Simulate API call or processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    router.push(`/customize/${username}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 via-green-800 to-blue-900 text-white p-4 md:p-8 relative overflow-hidden">
      <Snowfall snowflakeCount={200} />
      <FallingGifts />
      <AnimatedChristmasTree />
      <CursorTrail />
      <TwinklingStars />
      <FestiveGreeting />
      <SurpriseGift />
      <AnimatedSantaSleigh />
      <FloatingLyrics />
      
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
      
      <motion.div 
        className="max-w-md mx-auto bg-gray-900 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-2xl p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
                jinglebell.pro/
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
      
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-gray-300">Already have a page?</p>
        <Link href="/find" className="text-yellow-300 hover:underline">
          Find an existing JingleBox
        </Link>
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
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-white text-2xl">
              <Loader className="animate-spin inline-block mr-2" size={30} />
              Creating your magical JingleBox...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}