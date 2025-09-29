import React from "react";

export interface FooterLink {
  label: string;
  href?: string;
}

interface FooterProps {
  className?: string;
  links?: FooterLink[];
  brandName?: string;
}

function cls(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export default function Footer({
  className,
}: FooterProps) {
  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className={cls(
        "w-full border-t border-border bg-secondary",
        className
      )}
    >
      <div className="container mx-auto w-full max-w-full py-8">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2025 PrescriptAI. Built with Next.js, Tailwind CSS, and Google Gemini AI.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Made with ❤️ by Anish
          </p>
        </div>
      </div>
    </footer>
  );
}