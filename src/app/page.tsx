"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import PrescriptionAnalyzer, { PrescriptionData } from "@/components/prescription-analyzer";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

type AppStage = "idle" | "uploading" | "done" | "error";

export default function Page() {
  console.log({
  Navigation,
  HeroSection,
  FeaturesSection,
  PrescriptionAnalyzer,
  Footer,
  Button,
});

  const analyzerRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState<AppStage>("idle");
  const [lastResult, setLastResult] = useState<PrescriptionData | null>(null);
  const router = useRouter();

  const scrollToAnalyzer = useCallback(() => {
    analyzerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const navRightContent = useMemo(() => {
    const statusClasses =
      "hidden md:inline-flex rounded-full px-2.5 py-1 text-xs font-medium border";
    const stageLabel =
      stage === "uploading"
        ? "Analyzing…"
        : stage === "done"
        ? "Ready"
        : stage === "error"
        ? "Error"
        : "Idle";

    const stageStyle =
      stage === "uploading"
        ? "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-500/50"
        : stage === "done"
        ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500/50"
        : stage === "error"
        ? "border-red-300 text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 dark:border-red-500/50"
        : "border-muted text-muted-foreground";

    return (
      <div className="flex items-center gap-2">
        <span className={`${statusClasses} ${stageStyle}`}>{stageLabel}</span>
        <Button size="sm" className="hidden sm:inline-flex" onClick={scrollToAnalyzer}>
          Upload
        </Button>
      </div>
    );
  }, [stage, scrollToAnalyzer]);

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Navigation
        title="PrescriptAI"
        fixed
        blurStrength="md"
        onMenuClick={scrollToAnalyzer}
        rightContent={navRightContent}
      />

      <main className="flex-1 pt-14">
        <HeroSection
          onGetStarted={scrollToAnalyzer}
          className="border-b border-border/60"
        />

        <section className="container mx-auto py-10 sm:py-14">
          <FeaturesSection />
        </section>

        <section ref={analyzerRef} className="container mx-auto py-10 sm:py-14 max-w-6xl">
          <div className="mx-auto">
            <PrescriptionAnalyzer
              analyzeEndpoint="/api/analyze"
              onUploadStart={() => setStage("uploading")}
              onUploadComplete={(data) => {
                try {
                  sessionStorage.setItem(
                    "last_prescription_result",
                    JSON.stringify(data)
                  );
                } catch {}
                setLastResult(data);
                setStage("done");
                router.push("/results");
              }}
              onError={() => setStage("error")}
              initialData={lastResult ?? undefined}
              className="shadow-sm"
            />
          </div>
        </section>
      </main>

      <Footer className="mt-auto" brandName="Anish" />
    </div>
  );
}