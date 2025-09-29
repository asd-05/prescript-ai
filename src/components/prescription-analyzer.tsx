"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Pill,
  PillBottle,
  FileInput,
  LoaderCircle,
  FileCheck2,
  FileStack,
  IterationCw,
  FileX2,
  Tablets,
  InspectionPanel,
  FileScan,
  Clock1,
  CalendarSearch,
  MousePointerBan,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Medicine = {
  id: string;
  name: string;
  description?: string;
  dosage?: {
    amount?: string; // e.g. "500mg"
    frequency?: string; // e.g. "Twice daily"
    instructions?: string; // e.g. "After meals"
    times?: string[]; // e.g. ["09:00", "21:00"]
    durationDays?: number; // e.g. 14
  };
  warnings?: string[];
  sideEffects?: string[];
  alternatives?: string[];
};

export type PrescriptionData = {
  patientName?: string;
  diagnosis?: string;
  notes?: string;
  medicines: Medicine[];
};

type AnalyzerState = "idle" | "loading" | "success" | "error";

export interface PrescriptionAnalyzerProps {
  className?: string;
  style?: React.CSSProperties;
  analyzeEndpoint?: string; // POST endpoint to process file. If omitted, a local mock will be used.
  initialData?: PrescriptionData; // optional preloaded result
  onUploadStart?: (file: File) => void;
  onUploadComplete?: (data: PrescriptionData) => void;
  onError?: (error: Error) => void;
}

/**
 * Production-ready, responsive prescription analysis workflow component.
 */
export default function PrescriptionAnalyzer({
  className,
  style,
  analyzeEndpoint,
  initialData,
  onUploadStart,
  onUploadComplete,
  onError,
}: PrescriptionAnalyzerProps) {
  const [state, setState] = useState<AnalyzerState>(initialData ? "success" : "idle");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<PrescriptionData | null>(initialData ?? null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>("Uploading...");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyActivate = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragActive) setDragActive(true);
  }, [dragActive]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        void processFile(files[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
      // reset input to allow re-choose same file
      e.currentTarget.value = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function processFile(file: File) {
    try {
      setErrorMsg(null);
      setFileName(file.name);
      setState("loading");
      setProgressMsg("Uploading file...");
      onUploadStart?.(file);

      const data = analyzeEndpoint
        ? await uploadAndAnalyze(analyzeEndpoint, file, setProgressMsg)
        : await mockAnalyze(file, setProgressMsg);

      setResult(data);
      setState("success");
      toast.success("Prescription analyzed successfully");
      onUploadComplete?.(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong during analysis.";
      setErrorMsg(message);
      setState("error");
      onError?.(err as Error);
      toast.error("Failed to analyze prescription", { description: message });
    }
  }

  const headerSubtitle = useMemo(() => {
    switch (state) {
      case "idle":
        return "Upload a prescription to extract medicines, dosages, and reminders.";
      case "loading":
        return progressMsg;
      case "success":
        return result?.patientName
          ? `Analyzed for ${result.patientName}`
          : "Analysis complete";
      case "error":
        return errorMsg ?? "We couldn't process that file. Try again.";
      default:
        return "";
    }
  }, [state, progressMsg, result?.patientName, errorMsg]);

  return (
    <section
      className={cn(
        "w-full max-w-full bg-background",
        className
      )}
      style={style}
      aria-live="polite"
    >
      <Card className="w-full bg-card border-border/70 shadow-sm">
        <CardHeader className="gap-2">
          <div className="flex items-center gap-2">
            <InspectionPanel className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle className="text-xl sm:text-2xl">Prescription Analyzer</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            {headerSubtitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {state === "idle" && (
            <UploadPanel
              inputRef={inputRef as React.RefObject<HTMLInputElement>}
              onKeyActivate={handleKeyActivate}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onFileChange={handleFileChange}
              dragActive={dragActive}
            />
          )}

          {state === "loading" && (
            <LoadingPanel fileName={fileName ?? "Document"} message={progressMsg} />
          )}

          {state === "error" && (
            <ErrorPanel
              message={errorMsg ?? "We couldn't process your file."}
              onReset={() => {
                setErrorMsg(null);
                setFileName(null);
                setResult(null);
                setState("idle");
              }}
              onRetry={() => {
                setState("idle");
                // do nothing else; user can try again
              }}
            />
          )}

          {state === "success" && result && (
            <ResultPanel
              data={result}
              onAnalyzeAnother={() => {
                setFileName(null);
                setResult(null);
                setState("idle");
                setErrorMsg(null);
                setProgressMsg("Uploading...");
              }}
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function UploadPanel({
  inputRef,
  onKeyActivate,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  dragActive,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  onKeyActivate: (e: React.KeyboardEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dragActive: boolean;
}) {
  return (
    <div className="space-y-6">
      <div
        className={cn(
          "relative w-full rounded-2xl border-2 border-dashed transition-colors",
          "bg-secondary hover:bg-secondary/70",
          dragActive ? "border-primary bg-accent/40" : "border-border"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={onKeyActivate}
        aria-label="Upload prescription by dragging and dropping or selecting a file"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl" />
        <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent text-accent-foreground">
            <FileInput className="h-6 w-6" aria-hidden />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold">Drag and drop your prescription here</p>
            <p className="text-sm text-muted-foreground">
              PDF, JPG, or PNG. Max 10MB.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              <FileStack className="mr-2 h-4 w-4" aria-hidden />
              Select a file
            </Button>
            <div className="text-xs text-muted-foreground">or drop it above</div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={onFileChange}
            aria-hidden
            tabIndex={-1}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MousePointerBan className="h-4 w-4" aria-hidden />
        <span>
          Do not upload sensitive personal info. Files are processed securely and not stored.
        </span>
      </div>
    </div>
  );
}

function LoadingPanel({ fileName, message }: { fileName: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-10">
      <div className="relative">
        <div className="h-14 w-14 rounded-full bg-accent/60 flex items-center justify-center">
          <LoaderCircle className="h-7 w-7 animate-spin text-primary" aria-hidden />
        </div>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-base font-semibold flex items-center justify-center gap-2">
          <FileScan className="h-4 w-4 text-primary" aria-hidden />
          Processing {truncateMiddle(fileName, 48)}
        </p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <IterationCw className="h-4 w-4" aria-hidden />
        <span>Extracting text, parsing dosage, checking alternatives...</span>
      </div>
    </div>
  );
}

function ErrorPanel({
  message,
  onReset,
  onRetry,
}: {
  message: string;
  onReset: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-10">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <FileX2 className="h-6 w-6 text-destructive" aria-hidden />
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold">Unable to analyze the prescription</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onRetry}>
          <IterationCw className="mr-2 h-4 w-4" aria-hidden />
          Try again
        </Button>
        <Button onClick={onReset} className="bg-primary text-primary-foreground hover:opacity-90">
          Choose another file
        </Button>
      </div>
    </div>
  );
}

export function ResultPanel({
  data,
  onAnalyzeAnother,
}: {
  data: PrescriptionData;
  onAnalyzeAnother: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <PillBottle className="h-5 w-5 text-primary" aria-hidden />
          <h3 className="text-lg font-semibold">Extracted prescription</h3>
        </div>
        {(data.patientName || data.diagnosis || data.notes) && (
          <div className="rounded-xl bg-secondary p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.patientName && (
                <InfoRow label="Patient" value={data.patientName} />
              )}
              {data.diagnosis && <InfoRow label="Diagnosis" value={data.diagnosis} />}
              {data.notes && <InfoRow label="Notes" value={data.notes} />}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileCheck2 className="h-4 w-4" aria-hidden />
          {data.medicines.length} medicine{data.medicines.length !== 1 ? "s" : ""} found
        </div>
        <Button variant="outline" onClick={onAnalyzeAnother}>
          <FileInput className="mr-2 h-4 w-4" aria-hidden />
          Analyze another
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.medicines.map((m) => (
          <MedicineCard key={m.id} medicine={m} />
        ))}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-words">{value}</p>
    </div>
  );
}

function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { name, description, dosage, warnings, sideEffects, alternatives } = medicine;
  const calendarUrl = useMemo(() => {
    const title = `Take ${name}${dosage?.amount ? ` ${dosage.amount}` : ""}`;
    const details = [
      description,
      dosage?.frequency ? `Frequency: ${dosage.frequency}` : null,
      dosage?.instructions ? `Instructions: ${dosage.instructions}` : null,
      dosage?.durationDays ? `Duration: ${dosage.durationDays} days` : null,
    ]
      .filter(Boolean)
      .join("\n");

    // Create a start time at the next whole hour from now (local time)
    const start = nextWholeHourDate();
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const datesParam = `${formatGoogleDate(start)}/${formatGoogleDate(end)}`;

    // Try to set a daily recurring rule based on frequency hints
    const recur = buildRecurrenceRule(dosage);

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      details,
      dates: datesParam,
    });

    if (recur) {
      params.set("recur", `RRULE:${recur}`);
    }

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [name, description, dosage]);

  return (
    <div className="group relative rounded-xl border bg-card p-5 transition-colors">
      <div className="absolute inset-0 rounded-xl bg-accent/0 group-hover:bg-accent/20 transition-colors pointer-events-none" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-primary" aria-hidden />
            <h4 className="font-semibold text-base truncate">{name}</h4>
          </div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>
          )}
        </div>
        <Tablets className="h-5 w-5 text-muted-foreground/70 shrink-0" aria-hidden />
      </div>

      <div className="mt-4 space-y-3">
        {dosage && (
          <div className="rounded-lg bg-secondary p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock1 className="h-4 w-4 text-primary" aria-hidden />
              Dosage & schedule
            </div>
            <dl className="mt-2 grid grid-cols-1 gap-2 text-sm">
              {dosage.amount && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-24 shrink-0">Amount</span>
                  <span className="font-medium break-words">{dosage.amount}</span>
                </div>
              )}
              {dosage.frequency && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-24 shrink-0">Frequency</span>
                  <span className="font-medium break-words">{dosage.frequency}</span>
                </div>
              )}
              {dosage.instructions && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-24 shrink-0">Instructions</span>
                  <span className="break-words">{dosage.instructions}</span>
                </div>
              )}
              {Array.isArray(dosage.times) && dosage.times.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-24 shrink-0">Times</span>
                  <span className="break-words">{dosage.times.join(", ")}</span>
                </div>
              )}
              {dosage.durationDays && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-24 shrink-0">Duration</span>
                  <span className="break-words">{dosage.durationDays} days</span>
                </div>
              )}
            </dl>
          </div>
        )}

        {(warnings?.length || sideEffects?.length) && (
          <div className="grid grid-cols-1 gap-3">
            {warnings?.length ? (
              <ListBlock title="Warnings" items={warnings} tone="warning" />
            ) : null}
            {sideEffects?.length ? (
              <ListBlock title="Possible side effects" items={sideEffects} tone="muted" />
            ) : null}
          </div>
        )}

        {/* Generic substitutes section - always show with fallback */}
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium">Generic substitutes</div>
          {alternatives && alternatives.length > 0 ? (
            <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
              {alternatives.map((alt, i) => (
                <li key={i} className="break-words">{alt}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No generic substitutes detected. Consider asking your pharmacist for an equivalent generic of {name} with the same active ingredient.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:opacity-90"
          aria-label={`Add ${name} reminders to Google Calendar`}
        >
          <a href={calendarUrl} target="_blank" rel="noreferrer">
            <CalendarSearch className="mr-2 h-4 w-4" aria-hidden />
            Add to Google Calendar
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard
              .writeText(
                [
                  `Medicine: ${name}`,
                  description ? `Description: ${description}` : null,
                  dosage?.amount ? `Amount: ${dosage.amount}` : null,
                  dosage?.frequency ? `Frequency: ${dosage.frequency}` : null,
                  dosage?.instructions ? `Instructions: ${dosage.instructions}` : null,
                  dosage?.times?.length ? `Times: ${dosage.times.join(", ")}` : null,
                  dosage?.durationDays ? `Duration: ${dosage.durationDays} days` : null,
                ]
                  .filter(Boolean)
                  .join("\n")
              )
              .then(() => toast.success("Details copied"))
              .catch(() => toast.error("Could not copy details"));
          }}
        >
          Copy details
        </Button>
      </div>
    </div>
  );
}

function ListBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone?: "warning" | "muted";
}) {
  const wrapper =
    tone === "warning"
      ? "bg-accent/40 border border-accent text-foreground"
      : "bg-muted/60";
  return (
    <div className={cn("rounded-lg p-3", wrapper)}>
      <div className="text-sm font-medium">{title}</div>
      <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
        {items.map((item, i) => (
          <li key={i} className="break-words">{item}</li>
        ))}
      </ul>
    </div>
  );
}

// Utilities

async function uploadAndAnalyze(
  endpoint: string,
  file: File,
  setProgress: (msg: string) => void
): Promise<PrescriptionData> {
  setProgress("Uploading file...");
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(endpoint, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Server responded with ${res.status}`);
  }

  setProgress("Analyzing prescription...");
  // Expect server returns JSON in PrescriptionData shape
  const data = (await res.json()) as PrescriptionData;

  // Basic validation to avoid runtime surprises
  if (!data || !Array.isArray(data.medicines)) {
    throw new Error("Malformed response from server.");
  }

  return delay(300, data); // slight delay for smoother UX
}

async function mockAnalyze(
  file: File,
  setProgress: (msg: string) => void
): Promise<PrescriptionData> {
  // Simulate a realistic flow
  await delay(600);
  setProgress("Extracting text from image/PDF...");
  await delay(700);
  setProgress("Parsing medicines and dosages...");
  await delay(700);
  setProgress("Checking alternatives and warnings...");

  // Produce a plausible mock result
  const base: PrescriptionData = {
    patientName: "Alex Johnson",
    diagnosis: "Acute sinusitis",
    notes: "Hydrate well and rest.",
    medicines: [
      {
        id: "amoxicillin",
        name: "Amoxicillin",
        description: "Antibiotic used to treat bacterial infections.",
        dosage: {
          amount: "500mg",
          frequency: "Twice daily",
          instructions: "After meals with a glass of water.",
          times: ["09:00", "21:00"],
          durationDays: 7,
        },
        warnings: ["Do not skip doses", "Complete full course even if you feel better"],
        sideEffects: ["Nausea", "Mild diarrhea", "Rash"],
        alternatives: ["Augmentin", "Doxycycline"],
      },
      {
        id: "ibuprofen",
        name: "Ibuprofen",
        description:
          "Nonsteroidal anti-inflammatory drug (NSAID) for pain and fever relief.",
        dosage: {
          amount: "400mg",
          frequency: "Every 8 hours as needed",
          instructions: "Take with food to avoid stomach upset.",
          durationDays: 5,
        },
        warnings: ["Avoid if you have stomach ulcers", "Do not exceed 1200mg/day without guidance"],
        sideEffects: ["Heartburn", "Dizziness"],
        alternatives: ["Acetaminophen (Paracetamol)", "Naproxen"],
      },
      {
        id: "cetirizine",
        name: "Cetirizine",
        description: "Antihistamine to relieve allergy symptoms.",
        dosage: {
          amount: "10mg",
          frequency: "Once daily",
          instructions: "Best taken at night if drowsy.",
          durationDays: 10,
        },
        warnings: ["May cause drowsiness"],
        sideEffects: ["Dry mouth", "Fatigue"],
        alternatives: ["Loratadine", "Fexofenadine"],
      },
    ],
  };

  // Occasionally simulate an error for robustness
  if (file.size === 0) {
    await delay(200);
    throw new Error("The selected file is empty.");
  }

  await delay(600);
  return base;
}

function delay<T>(ms: number, value?: T): Promise<T extends undefined ? void : T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value as T extends undefined ? void : T), ms)
  );
}

function formatGoogleDate(date: Date): string {
  // Google expects UTC in YYYYMMDDTHHMMSSZ
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`;
}

function nextWholeHourDate(): Date {
  const now = new Date();
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  next.setHours(now.getHours() + 1);
  return next;
}

function buildRecurrenceRule(dosage?: Medicine["dosage"]): string | null {
  if (!dosage?.frequency) return "FREQ=DAILY;COUNT=30";

  const f = dosage.frequency.toLowerCase();

  if (f.includes("once daily") || f.includes("once a day") || f === "daily" || f.includes("every day")) {
    return "FREQ=DAILY;COUNT=30";
  }
  if (f.includes("twice")) {
    return "FREQ=DAILY;COUNT=30";
  }
  if (f.includes("every 8 hours")) {
    return "FREQ=HOURLY;INTERVAL=8;COUNT=90";
  }
  if (f.includes("every 12 hours")) {
    return "FREQ=HOURLY;INTERVAL=12;COUNT=60";
  }
  if (f.includes("weekly")) {
    return "FREQ=WEEKLY;COUNT=12";
  }
  return "FREQ=DAILY;COUNT=30";
}

function truncateMiddle(str: string, max: number): string {
  if (str.length <= max) return str;
  const half = Math.floor((max - 3) / 2);
  return `${str.slice(0, half)}...${str.slice(-half)}`;
}