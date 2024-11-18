'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gift, Star, TreePine, MessageCircle, Palette, Mountain, Snowflake, Cookie, Moon } from 'lucide-react'

const treeColors = [
  { name: 'Emerald', value: '#2ecc71' },
  { name: 'Forest', value: '#27ae60' },
  { name: 'Mint', value: '#1abc9c' },
  { name: 'Pine', value: '#16a085' }
]

const backgroundThemes = [
  { name: 'Winter Wonderland', value: 'winter-wonderland' },
  { name: 'Cozy Cabin', value: 'cozy-cabin' },
  { name: 'Starry Night', value: 'starry-night' },
  { name: 'Northern Lights', value: 'northern-lights' },
  { name: 'Enchanted Ice Rink', value: 'ice-rink' },
  { name: 'Gingerbread Village', value: 'gingerbread-village' },
  { name: 'Aurora Borealis', value: 'aurora-borealis' }
]

const ornaments = [
  { id: 1, src: '/ornament-red.png', alt: 'Red Ornament' },
  { id: 2, src: '/ornament-blue.png', alt: 'Blue Ornament' },
  { id: 3, src: '/ornament-gold.png', alt: 'Gold Ornament' },
]

interface PlacedOrnament {
  id: number
  src: string
  alt: string
  x: number
  y: number
}

export default function CustomizePage({ params }: { params: { username: string } }) {
  const [treeColor, setTreeColor] = useState(treeColors[0].value)
  const [backgroundTheme, setBackgroundTheme] = useState(backgroundThemes[0].value)
  const [placedOrnaments, setPlacedOrnaments] = useState<PlacedOrnament[]>([])
  const [draggedOrnament, setDraggedOrnament] = useState<{ id: number; src: string; alt: string } | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedTheme = localStorage.getItem('jingleboxTheme')
    if (savedTheme) {
      const { treeColor: savedTreeColor, backgroundTheme: savedBackgroundTheme, placedOrnaments: savedOrnaments } = JSON.parse(savedTheme)
      setTreeColor(savedTreeColor)
      setBackgroundTheme(savedBackgroundTheme)
      setPlacedOrnaments(savedOrnaments)
    }
  }, [])

  const handleSave = () => {
    setIsCreating(true)
    setTimeout(() => {
      localStorage.setItem('jingleboxTheme', JSON.stringify({ treeColor, backgroundTheme, placedOrnaments }))
      router.push(`/${params.username}`)
    }, 3000) // 3 seconds for the creation animation
  }

  const handleMouseDown = (ornament: { id: number; src: string; alt: string }) => {
    setDraggedOrnament(ornament)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedOrnament || !event.currentTarget) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      setPlacedOrnaments(prevOrnaments => [
        ...prevOrnaments,
        { ...draggedOrnament, x, y }
      ])
    }
  }

  const handleMouseUp = () => {
    setDraggedOrnament(null)
  }

  const getBackgroundImage = () => {
    switch (backgroundTheme) {
      case 'winter-wonderland':
        return '/winter.png'
      case 'cozy-cabin':
        return '/cozy-cabin.png'
      case 'starry-night':
        return '/starry-night.png'
      case 'northern-lights':
        return '/northern-lights.png'
      case 'ice-rink':
        return '/ice-rink.png'
      case 'gingerbread-village':
        return '/gingerbread-village.png'
      case 'aurora-borealis':
        return '/aurora-borealis.png'
      default:
        return '/winter.png'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4 md:p-8">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-center mb-8 md:mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Customize Your JingleBox!
      </motion.h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 flex items-center">
            <Palette className="mr-2" />
            Customization Options
          </h2>
          
          <div className="space-y-8">
            <div>
              <label className="text-lg font-medium mb-4 block">Tree Color</label>
              <div className="flex space-x-4">
                {treeColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-12 h-12 rounded-full transition-transform ${
                      treeColor === color.value ? 'ring-4 ring-white ring-opacity-50 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setTreeColor(color.value)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-lg font-medium mb-4 block">Background Theme</label>
              <select
                value={backgroundTheme}
                onChange={(e) => setBackgroundTheme(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 
                          focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                {backgroundThemes.map((theme) => (
                  <option key={theme.value} value={theme.value} className="text-gray-900">
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            className="mt-8 w-full py-4 rounded-lg font-semibold text-lg
                     bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600
                     hover:via-pink-600 hover:to-red-600 transition-colors
                     shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Save Customizations
          </button>
        </motion.div>
        
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 flex items-center">
            <Mountain className="mr-2" />
            Preview
          </h2>
          <div 
            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/50 to-indigo-900/50 backdrop-blur shadow-inner"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-indigo-900">
              <Image
                src={getBackgroundImage()}
                alt="Scene Background"
                layout="fill"
                objectFit="cover"
                objectPosition="center 20%"
                priority
                className="opacity-60"
              />
            </div>

            <AnimatePresence>
              {isCreating && (
                <motion.div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="text-4xl font-bold text-white text-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 2, times: [0, 0.8, 1] }}
                  >
                    <div>Creating Your Magical Scene...</div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-16 h-16 mt-4" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 h-full flex flex-col items-center justify-between p-4">
              <div className="w-[80%] max-w-[250px] aspect-[3/4] relative">
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
                {placedOrnaments.map((ornament, index) => (
                  <Image
                    key={index}
                    src={ornament.src}
                    alt={ornament.alt}
                    width={20}
                    height={20}
                    className="absolute"
                    style={{ left: `${ornament.x}%`, top: `${ornament.y}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center space-x-4">
            {ornaments.map((ornament) => (
              <motion.div
                key={ornament.id}
                onMouseDown={() => handleMouseDown(ornament)}
                className="cursor-grab active:cursor-grabbing"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src={ornament.src}
                  alt={ornament.alt}
                  width={40}
                  height={40}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">New Scenes Available!</h2>
        <div className="flex justify-center space-x-8">
          <div className="flex flex-col items-center">
            <Snowflake className="w-12 h-12 mb-2" />
            <p>Enchanted Ice Rink</p>
          </div>
          <div className="flex flex-col items-center">
            <Cookie className="w-12 h-12 mb-2" />
            <p>Gingerbread Village</p>
          </div>
          <div className="flex flex-col items-center">
            <Moon className="w-12 h-12 mb-2" />
            <p>Aurora Borealis Sky</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}