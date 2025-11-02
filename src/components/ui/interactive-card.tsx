"use client"

import { Card, type CardProps } from "@/components/ui/card"
import { forwardRef, useState } from "react"

interface InteractiveCardProps extends CardProps {
  onCardClick?: () => void
}

const InteractiveCard = forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ className, onCardClick, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <Card
        ref={ref}
        className={`transition-all ${isHovered ? "border-blue-500 shadow-md" : ""} ${
          onCardClick ? "cursor-pointer" : ""
        } ${className}`}
        onClick={onCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
      </Card>
    )
  },
)
InteractiveCard.displayName = "InteractiveCard"

export { InteractiveCard }
