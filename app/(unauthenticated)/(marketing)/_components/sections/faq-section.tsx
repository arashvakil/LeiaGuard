"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useState } from "react"
import { SectionWrapper } from "./section-wrapper"

const faqs = [
  {
    question: "What exactly is this 'secret portal' thing?",
    answer:
      "Think of it as a magical tunnel for your internet traffic. It's like having a personal teleporter for your data, but with more encryption and fewer molecular transport accidents."
  },
  {
    question: "How do I become a digital ninja?",
    answer:
      "First, you need a secret code from our wizard (the administrator). Then you register, add your devices, and voilà! You're now part of our exclusive club of internet shadow warriors."
  },
  {
    question: "Is this actually legal?",
    answer:
      "Absolutely! We're just really good at making boring internet infrastructure sound mysterious. It's like calling your car a 'personal transportation pod' - same thing, fancier name."
  },
  {
    question: "Can I use this to hack the Matrix?",
    answer:
      "While we appreciate your ambition, this is more about protecting your cat videos than overthrowing digital reality. Though your internet traffic will look pretty cool bouncing around our servers."
  },
  {
    question: "What if I break something?",
    answer:
      "Don't worry! Our system is designed to be ninja-proof. The worst you can do is disconnect yourself, which is like a digital time-out. Just reconnect and you're back in stealth mode."
  },
  {
    question: "Why all the mysterious language?",
    answer:
      "Because 'secure internet tunnel' sounds boring, but 'secret portal to digital enlightenment' makes you feel like you're in a sci-fi movie. Same technology, way more fun!"
  }
]

export function FAQSection() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (question: string) => {
    setOpenItems(prev =>
      prev.includes(question)
        ? prev.filter(item => item !== question)
        : [...prev, question]
    )
  }

  return (
    <SectionWrapper id="faq">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            className="text-foreground text-2xl leading-10 font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-6 text-base leading-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to know about becoming a digital ninja. Can't find what
            you're looking for? Contact the wizard (administrator).
          </motion.p>
          <dl className="mt-10 space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Collapsible
                  open={openItems.includes(faq.question)}
                  onOpenChange={() => toggleItem(faq.question)}
                >
                  <CollapsibleTrigger className="flex w-full items-start justify-between text-left">
                    <span className="text-foreground text-base leading-7 font-semibold">
                      {faq.question}
                    </span>
                    <motion.span
                      className="ml-6 flex h-7 items-center"
                      animate={{
                        rotate: openItems.includes(faq.question) ? 45 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus
                        className="text-muted-foreground h-6 w-6"
                        aria-hidden="true"
                      />
                    </motion.span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 pr-12">
                    <motion.p
                      className="text-muted-foreground text-base leading-7"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </motion.p>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </SectionWrapper>
  )
}
