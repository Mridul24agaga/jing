import React, { useState, useEffect, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Gift, TreesIcon as Tree, Star } from 'lucide-react'

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

  const handleClick = () => {
    setIsOpen(!isOpen)
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
          <p className="font-bold">You&apos;re awesome!</p>
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
      // Randomly choose a side (top, right, bottom, left)
      const side = Math.floor(Math.random() * 4)
      let newX, newY

      switch (side) {
        case 0: // Top
          newX = Math.random() * 100
          newY = -10
          break
        case 1: // Right
          newX = 110
          newY = Math.random() * 100
          break
        case 2: // Bottom
          newX = Math.random() * 100
          newY = 110
          break
        case 3: // Left
          newX = -10
          newY = Math.random() * 100
          break
        default:
          newX = 0
          newY = 0
      }

      setPosition({ x: newX, y: newY })
    }

    updatePosition()
    const interval = setInterval(() => {
      updatePosition()
    }, (2 + Math.random()) * 60 * 1000)

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
      className="fixed pointer-events-none"
      style={{ width: '100%', height: '100%', zIndex: 10 }}
      animate={controls}
    >
      <motion.img
        src="https://media.discordapp.net/attachments/1193183717548638301/1306676569800048740/4c137b49-c6fc-4295-b4db-7511490e4546_image-removebg-preview_1.png?ex=67401aa3&is=673ec923&hm=1520d496d67a21caf51cf4797b433608a8ce38ab2bebb84cd004fe2751b9dda0&=&format=webp&quality=lossless"
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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
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

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {lyrics.map((line, index) => (
        <motion.div
          key={index}
          className="absolute text-white text-opacity-50 pointer-events-none"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: Math.random() * (dimensions.width || 100),
            y: Math.random() * (dimensions.height || 100),
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

const BackgroundDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <FallingGifts />
      <AnimatedChristmasTree />
      <CursorTrail />
      <TwinklingStars />
      <FestiveGreeting />
      <SurpriseGift />
      <AnimatedSantaSleigh />
      <FloatingLyrics />
    </div>
  )
}

export default BackgroundDecorations

