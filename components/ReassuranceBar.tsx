'use client'

import { useState, useEffect } from 'react'
import { Hammer, Shield, CreditCard, Tag } from 'lucide-react'

const baseItems = [
  { icon: Hammer, label: 'Fabrication artisanale française' },
  { icon: Shield, label: 'Garantie 2 ans' },
  { icon: CreditCard, label: 'Paiement en 3x sans frais' },
]

export default function ReassuranceBar() {
  const [items, setItems] = useState(baseItems)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetch('/api/coupons/banner')
      .then((res) => res.json())
      .then((data) => {
        if (data?.label) {
          setItems([{ icon: Tag, label: data.label }, ...baseItems])
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <div className="bg-[#1a1a1a] text-white text-xs py-1.5">
      {/* Mobile: single rotating item */}
      <div className="flex items-center justify-center gap-1.5 md:hidden" aria-live="polite" aria-atomic="true">
        {(() => {
          const Icon = items[current].icon
          return (
            <>
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{items[current].label}</span>
            </>
          )
        })()}
      </div>

      {/* Desktop: all items in a row */}
      <div className="hidden md:flex items-center justify-center gap-6">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="mr-6 text-white/40">|</span>}
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
