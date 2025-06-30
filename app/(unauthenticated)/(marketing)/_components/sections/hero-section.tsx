"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Zap, Lock, Globe, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { SectionWrapper } from "./section-wrapper"
import { LanguageSwitcher } from "@/lib/language-context"

export function HeroSection() {
  const [shieldHovered, setShieldHovered] = useState(false)
  
  return (
    <SectionWrapper className="relative py-16 sm:py-32 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"></div>
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Language Switcher */}
        <motion.div
          className="mb-8 flex justify-end"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LanguageSwitcher />
        </motion.div>

        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="group relative inline-flex items-center rounded-full px-4 py-2 text-sm leading-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50 border border-blue-200/50 dark:border-blue-700/50 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:scale-105">
            <motion.div
              className="mr-3 inline-block"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              Enterprise-Grade Security
            </span>
            <ArrowRight className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        <motion.h1
          className="text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="text-gray-900 dark:text-white">Secret</span>
          <motion.span
            className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 8,
              ease: "linear",
              repeat: Infinity
            }}
            style={{
              backgroundSize: "200% 200%"
            }}
          >
            Portal
          </motion.span>
        </motion.h1>
        
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ultra-secure digital tunneling with quantum-grade encryption. 
          Because your cat videos deserve military-level protection.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              asChild
              className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 sm:w-auto h-14 px-8 text-lg"
            >
              <Link href="/register">
                <motion.span
                  className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-200%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.6 }}
                />
                <Download className="mr-2 h-5 w-5" />
                Get Started Free
                <motion.div
                  className="ml-2 inline-block"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="lg"
              asChild
              className="group w-full border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 sm:w-auto h-14 px-8 text-lg"
              onMouseEnter={() => setShieldHovered(true)}
              onMouseLeave={() => setShieldHovered(false)}
            >
              <Link href="/login">
                <Lock className="mr-2 h-5 w-5" />
                Sign In
                <motion.div
                  className="ml-2 inline-block"
                  whileHover={{ rotate: 12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Shield className={`h-5 w-5 transition-colors ${shieldHovered ? "text-blue-600" : ""}`} />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust indicators with enhanced visual design */}
        <motion.div
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { icon: Zap, text: "Lightning-Fast Tunnels", desc: "Faster than your morning coffee" },
            { icon: Lock, text: "Quantum-Level Encryption", desc: "So secure, even we don't know what's inside" },
            { icon: Globe, text: "Interdimensional Network", desc: "99.9% uptime across all realities" }
          ].map((item, i) => (
            <motion.div
              key={item.text}
              className="group relative rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <motion.div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  delay: 0.8 + i * 0.1
                }}
                whileHover={{ rotate: 360 }}
              >
                <item.icon className="h-6 w-6" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.text}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Speed indicator */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Portal Speed</p>
          <div className="mx-auto max-w-md">
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "95%" }}
                transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Up to Ludicrous Speed</p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
