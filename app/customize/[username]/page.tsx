'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gift, Star, TreePine, MessageCircle, Palette, Mountain } from 'lucide-react'
import Snowfall from 'react-snowfall'

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
  { name: 'Northern Lights', value: 'northern-lights' }
]

const ornaments = [
  { id: 1, src: '/ornament-red.png', alt: 'Red Ornament' },
  { id: 2, src: '/ornament-blue.png', alt: 'Blue Ornament' },
  { id: 3, src: '/ornament-gold.png', alt: 'Gold Ornament' },
]

interface CreationStep {
  icon: typeof Sparkles
  text: string
}

const creationSteps: CreationStep[] = [
  { icon: TreePine, text: "Growing your magical tree..." },
  { icon: Star, text: "Adding sparkle and shine..." },
  { icon: Gift, text: "Wrapping your presents..." },
  { icon: MessageCircle, text: "Creating your message board..." }
]

interface PlacedOrnament {
  id: number
  src: string
  alt: string
  x: number
  y: number
}

export default function Component() {
  const [treeColor, setTreeColor] = useState(treeColors[0].value)
  const [backgroundTheme, setBackgroundTheme] = useState(backgroundThemes[0].value)
  const [isCreating, setIsCreating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [placedOrnaments, setPlacedOrnaments] = useState<PlacedOrnament[]>([])
  const [draggedOrnament, setDraggedOrnament] = useState<{ id: number; src: string; alt: string } | null>(null)
  const treeRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleCreate = async () => {
    setIsCreating(true)
    
    for (let i = 0; i < creationSteps.length; i++) {
      setCurrentStep(i)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    localStorage.setItem('jingleboxTheme', JSON.stringify({ treeColor, backgroundTheme, placedOrnaments }))
    router.push('/')
  }

  const handleMouseDown = (ornament: { id: number; src: string; alt: string }) => {
    setDraggedOrnament(ornament)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedOrnament || !treeRef.current) return

    const treeRect = treeRef.current.getBoundingClientRect()
    const x = event.clientX - treeRect.left
    const y = event.clientY - treeRect.top

    if (x >= 0 && x <= treeRect.width && y >= 0 && y <= treeRect.height) {
      setPlacedOrnaments(prevOrnaments => [
        ...prevOrnaments,
        { ...draggedOrnament, x, y }
      ])
    }
  }

  const handleMouseUp = () => {
    setDraggedOrnament(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4 md:p-8 relative overflow-hidden">
      <Snowfall snowflakeCount={100} />
      
      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Customize Your JingleBox!
      </motion.h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 flex items-center">
            <Palette className="mr-2 text-pink-400" />
            Customization Options
          </h2>
          
          <div className="space-y-8">
            <div>
              <label className="text-lg font-medium mb-4 block">Tree Color</label>
              <div className="flex space-x-4">
                {treeColors.map((color) => (
                  <motion.button
                    key={color.value}
                    className={`w-12 h-12 rounded-full transition-transform ${
                      treeColor === color.value ? 'ring-4 ring-white ring-opacity-50 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setTreeColor(color.value)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
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
          
          <motion.button
            onClick={handleCreate}
            disabled={isCreating}
            className="mt-8 w-full py-4 rounded-lg font-semibold text-lg relative overflow-hidden
                     bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600
                     hover:via-pink-600 hover:to-red-600 transition-colors disabled:opacity-50
                     shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCreating ? "Creating your JingleBox..." : "Create My JingleBox"}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isCreating ? 1 : 0, opacity: isCreating ? 0.2 : 0 }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 flex items-center">
            <Mountain className="mr-2 text-indigo-400" />
            Preview
          </h2>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/50 to-indigo-900/50 backdrop-blur shadow-inner">
            {/* JingleBox Preview */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-indigo-900">
              {/* Background Scene */}
              <div className="absolute inset-0">
                <Image
                  src="/winter.png"
                  alt="Winter Village Scene"
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center 20%"
                  priority
                  className="select-none opacity-60"
                />
              </div>

              <Snowfall 
                snowflakeCount={50}
                radius={[0.5, 1.5]}
                speed={[0.5, 1.5]}
                wind={[-0.5, 1]}
              />

              <div className="relative z-10 h-full flex flex-col items-center justify-between p-4">
                <div className="absolute inset-2 border-2 border-white/20 rounded-2xl pointer-events-none" />

                <motion.h3 
                  className="text-lg font-bold text-white drop-shadow-lg mt-2 text-center px-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Your JingleBox
                </motion.h3>

                <div 
                  ref={treeRef} 
                  className="relative w-[80%] max-w-[250px] aspect-[3/4]"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <Image
                    src="/tree-classic.png"
                    alt="Christmas Tree"
                    layout="fill"
                    objectFit="contain"
                    priority
                    className="select-none"
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
                      style={{ left: ornament.x, top: ornament.y }}
                    />
                  ))}
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-yellow-400"
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

                <motion.div
                  className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {backgroundThemes.find(t => t.value === backgroundTheme)?.name}
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Ornament Selection */}
          <div className="mt-4 flex justify-center space-x-4">
            {ornaments.map((ornament) => (
              <motion.div
                key={ornament.id}
                onMouseDown={() => handleMouseDown(ornament)}
                className="cursor-grab active:cursor-grabbing"
              >
                <Image
                  src={ornament.src}
                  alt={ornament.alt}
                  width={40}
                  height={40}
                  className="pointer-events-none"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full mx-4 border border-white/20 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                {creationSteps.map((step, index) => {
                  const StepIcon = step.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: currentStep === index ? 1 : currentStep > index ? 0.5 : 0,
                        y: currentStep === index ? 0 : currentStep > index ? -20 : 20
                      }}
                      className="flex items-center justify-center space-x-3 mb-4"
                    >
                      <StepIcon className={`w-6 h-6 ${currentStep === index ? 'text-purple-400' : 'text-gray-400'}`} />
                      <span className="text-xl">{step.text}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}