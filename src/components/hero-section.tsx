"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onGetStarted?: () => void;
  className?: string;
  style?: React.CSSProperties;
};

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

// Using forwardRef to pass ref to the section element
const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      title = "Effortless prescription management",
      subtitle = "Upload prescriptions, extract details, and stay organized — all in one secure, streamlined workspace.",
      ctaLabel = "Get Started",
      onGetStarted,
      className,
      style,
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden bg-gradient-to-b from-accent to-background",
          "py-16 sm:py-20 lg:py-28",
          className
        )}
        style={style}
        aria-label="Hero"
      >
        {/* Subtle decorative gradient aura */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-20%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(111,90,232,0.18),transparent)] blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-5xl text-center">
          <h1 className="mx-auto max-w-3xl break-words text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl break-words text-base text-muted-foreground sm:mt-5 sm:text-lg md:text-xl">
            {subtitle}
          </p>

          <div className="mt-8 flex w-full justify-center">
            <Button
              type="button"
              onClick={onGetStarted}
              aria-label={ctaLabel}
              className={cn(
                "bg-primary text-primary-foreground shadow-sm transition-all",
                "hover:translate-y-[-1px] hover:shadow-md",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "active:translate-y-0",
                "px-6 py-6 text-base sm:text-lg"
              )}
              size="lg"
            >
              {ctaLabel}
            </Button>
          </div>
        </div>
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection"; // For better devtools display

export default HeroSection;
