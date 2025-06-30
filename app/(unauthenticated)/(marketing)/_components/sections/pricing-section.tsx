"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check, Shield, Users, Zap } from "lucide-react"
import Link from "next/link"
import { SectionWrapper } from "./section-wrapper"

const features = [
  {
    name: "Digital Stealth Mode",
    description: "Invisible internet browsing for you and your digital companions",
    features: [
      "Lightning-fast mysterious protocols",
      "Multiple gadget support",
      "Turbo-charged secret servers",
      "24/7 ninja-level connectivity",
      "Magic QR code setup",
      "Self-service device wizardry"
    ],
    icon: Shield,
    highlight: true
  },
  {
    name: "How It Works",
    description: "Simple 3-step process to become a digital ninja",
    features: [
      "Get secret code from the wizard",
      "Register your shadow identity",
      "Add your digital minions",
      "Download magical configurations",
      "Connect to the matrix instantly",
      "Enjoy invisible browsing powers"
    ],
    icon: Users,
    highlight: false
  }
]

export function PricingSection() {
  return (
    <SectionWrapper id="access">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Secret Portal Access
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-4 text-lg leading-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Private tunneling service for digital ninjas. Invitation-only access.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
          {features.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative rounded-3xl p-8 ring-1 ${
                tier.highlight
                  ? "bg-primary text-primary-foreground ring-primary"
                  : "bg-card text-card-foreground ring-border"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}
            >
              {tier.highlight && (
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <span className="bg-primary text-primary-foreground inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold">
                    STEALTH ACCESS
                  </span>
                </motion.div>
              )}

              <div className="flex items-center gap-4">
                <tier.icon
                  className={`h-8 w-8 ${
                    tier.highlight ? "text-primary-foreground" : "text-primary"
                  }`}
                />
                <h3
                  className={`text-lg leading-8 font-semibold ${
                    tier.highlight
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {tier.name}
                </h3>
              </div>

              <p
                className={`mt-4 text-sm leading-6 ${
                  tier.highlight
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {tier.description}
              </p>

              <ul
                className={`mt-8 space-y-3 text-sm leading-6 ${
                  tier.highlight
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {tier.features.map(feature => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className={`h-6 w-5 flex-none ${
                        tier.highlight
                          ? "text-primary-foreground"
                          : "text-primary"
                      }`}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`mt-8 w-full ${
                  tier.highlight
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : ""
                }`}
                variant={tier.highlight ? "default" : "outline"}
              >
                {tier.highlight ? (
                  <Link href="/register">Get Access</Link>
                ) : (
                  <Link href="/contact">Learn More</Link>
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-muted-foreground text-sm">
            Need a secret code? Contact the wizard to request access to the matrix.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
