"use client"

import * as React from "react"
import { Grid3x2, TabletSmartphone, SquareDivide, LayoutList } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type Feature = {
  key: string
  title: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export type FeaturesSectionProps = {
  className?: string
  style?: React.CSSProperties
  layout?: "default" | "compact"
  features?: Feature[]
}

const DEFAULT_FEATURES: Feature[] = [
  {
    key: "smart-extraction",
    title: "Smart Extraction",
    description:
      "Accurately parse prescription details using intelligent recognition tuned for real-world formats.",
    icon: Grid3x2,
  },
  {
    key: "calendar-integration",
    title: "Calendar Integration",
    description:
      "Add schedules to your preferred calendar for timely dose reminders across devices.",
    icon: TabletSmartphone,
  },
  {
    key: "alternative-suggestions",
    title: "Alternative Suggestions",
    description:
      "Discover equivalent options when medications are unavailable or cost-prohibitive.",
    icon: SquareDivide,
  },
  {
    key: "safety-warnings",
    title: "Safety Warnings",
    description:
      "Highlight potential interactions and alerts to support safer medication use.",
    icon: LayoutList,
  },
]

const FeaturesSection = React.forwardRef<HTMLElement, FeaturesSectionProps>(
  ({ className, style, layout = "default", features = DEFAULT_FEATURES }, ref) => {
    const wrapperClasses = "w-full"
    const gridClasses =
      layout === "compact"
        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    const cardPadding = layout === "compact" ? "p-5" : "p-6"

    return (
      <section ref={ref} className={className} style={style} aria-label="Key features">
        <div className={wrapperClasses}>
          <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Understand prescriptions instantly and stay safer
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              AI-powered extraction, reminders, and safety checks—organized in one place.
            </p>
          </div>
          <div className={gridClasses}>
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.key}
                  role="region"
                  aria-labelledby={`${feature.key}-title`}
                  tabIndex={0}
                  className="group bg-card border border-border shadow-sm rounded-lg outline-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <CardHeader className={cardPadding}>
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-accent text-accent-foreground ring-1 ring-border flex items-center justify-center">
                        <Icon aria-hidden="true" className="h-6 w-6" />
                      </div>
                      <CardTitle
                        id={`${feature.key}-title`}
                        className="text-base sm:text-lg leading-snug font-semibold tracking-tight text-foreground"
                      >
                        <span className="block truncate">{feature.title}</span>
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground break-words">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    )
  }
)

FeaturesSection.displayName = "FeaturesSection"

export default FeaturesSection
