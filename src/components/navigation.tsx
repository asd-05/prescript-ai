"use client";

import * as React from "react";
import { Menu, Heading } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export interface NavigationProps {
  title?: string;
  className?: string;
  fixed?: boolean;
  blurStrength?: "sm" | "md" | "lg";
  onMenuClick?: () => void;
  rightContent?: React.ReactNode;
}

const blurMap: Record<NonNullable<NavigationProps["blurStrength"]>, string> = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
};

export default function Navigation({
  title = "PrescriptAI",
  className,
  fixed = true,
  blurStrength = "md",
  onMenuClick,
  rightContent,
}: NavigationProps) {
  return (
    <nav
      aria-label="Primary"
      className={[
        fixed ? "fixed top-0 inset-x-0" : "relative",
        "z-50 w-full",
        // Frosted glass background using design tokens
        "bg-background/60",
        blurMap[blurStrength],
        // Subtle separation and depth
        "border-b border-border/60 shadow-[0_1px_0_rgba(17,24,39,0.03),0_8px_20px_-12px_rgba(17,24,39,0.15)]",
        // Ensure text color follows tokens
        "text-foreground",
        className,
      ].join(" ")}
    >
      <div className="container">
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm"
            >
              <Heading className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <Link href="/" passHref>
              <span className="block truncate text-base font-semibold leading-none tracking-[-0.01em] sm:text-lg">
                {title}
              </span>
              </Link>
              <span className="sr-only">{title} navigation</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {rightContent ? (
              <div className="hidden sm:flex items-center gap-2">{rightContent}</div>
            ) : null}

            <ThemeToggle />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={onMenuClick}
              className="h-9 w-9 text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}