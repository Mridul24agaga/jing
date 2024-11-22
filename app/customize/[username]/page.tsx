'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Mountain, Sparkles } from 'lucide-react'


const treeColors = [
  { name: 'Emerald', value: '#2ecc71' },
  { name: 'Forest', value: '#27ae60' },
  { name: 'Mint', value: '#1abc9c' },
  { name: 'Pine', value: '#16a085' }
]

const scenes = [
  { name: 'Winter Wonderland', value: 'winter-wonderland', image: '/winter.png' },
  { name: 'Cozy Cabin', value: 'cozy-cabin', image: '/snow.jpg' },
  { name: 'Starry Night', value: 'starry-night', image: '/starry.jpg' },
  { name: 'Northern Lights', value: 'northern-lights', image: '/northern.jpg' },
]

export default function CustomizePage() {
  const [treeColor, setTreeColor] = useState(treeColors[0].value)
  const [scene, setScene] = useState(scenes[0].value)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState('tree')
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const savedTheme = localStorage.getItem('jingleboxTheme')
    if (savedTheme) {
      const { treeColor: savedTreeColor, scene: savedScene } = JSON.parse(savedTheme)
      setTreeColor(savedTreeColor)
      setScene(savedScene)
    }
  }, [])

  const handleSave = () => {
    setIsCreating(true)
    setTimeout(() => {
      localStorage.setItem('jingleboxTheme', JSON.stringify({ treeColor, scene }))
      router.push(`/${params.username}`)
    }, 3000)
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
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 flex items-center">
            <Palette className="mr-2" />
            Customization Options
          </h2>
          
          <div className="space-y-8">
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded-full ${activeTab === 'tree' ? 'bg-white text-purple-900' : 'bg-purple-900/50'}`}
                onClick={() => setActiveTab('tree')}
              >
                Tree
              </button>
              <button
                className={`px-4 py-2 rounded-full ${activeTab === 'scene' ? 'bg-white text-purple-900' : 'bg-purple-900/50'}`}
                onClick={() => setActiveTab('scene')}
              >
                Scene
              </button>
            </div>

            {activeTab === 'tree' && (
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
            )}

            {activeTab === 'scene' && (
              <div>
                <label className="text-lg font-medium mb-4 block">Scene</label>
                <select
                  value={scene}
                  onChange={(e) => setScene(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 
                            focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  {scenes.map((s) => (
                    <option key={s.value} value={s.value} className="text-gray-900">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 flex items-center">
            <Mountain className="mr-2" />
            Preview
          </h2>
          <div 
            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/50 to-indigo-900/50 backdrop-blur shadow-inner"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-indigo-900">
              <Image
                src={scenes.find(s => s.value === scene)?.image || '/winter.png'}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}