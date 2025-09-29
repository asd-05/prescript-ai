"use client";

import React, { useEffect, useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = forwardRef<HTMLButtonElement, {}>((props, ref) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    
    setIsDark(initialTheme === "dark");
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted)
    return <Button ref={ref} size="icon" variant="ghost" className="h-9 w-9" disabled />;

  return (
    <Button
      ref={ref}
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
      className="h-9 w-9 text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      {...props}
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute inset-0 h-full w-full transition-all duration-300 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-full w-full transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </Button>
  );
});

ThemeToggle.displayName = "ThemeToggle"; // Important for DevTools & SSR
export default ThemeToggle;