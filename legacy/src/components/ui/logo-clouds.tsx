"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type LogoEntry = {
  icon: React.ReactNode;
  name?: string;
  id?: string;
};

export type LogoCloudSwapProps = {
  logos?: LogoEntry[];
  title?: string;
  subtitle?: string;
  interval?: number;
  stagger?: number;
  className?: string;
};

const WIPE_DURATION = 0.92;
const WIPE_TIMES = [0, 0.4, 1];

const DEFAULT_LOGOS: LogoEntry[] = [
  {
    name: "Google Cloud",
    id: "google-cloud",
    icon: (
      <img
        src="https://www.atra.com.br/wp-content/uploads/2021/03/Google_Cloud_Platform-Logo.wine_-2048x1365.png"
        alt="Google Cloud"
        className="h-full w-full object-contain"
      />
    ),
  },
  {
    name: "Denodo",
    id: "denodo",
    icon: (
      <img
        src="https://www.atra.com.br/wp-content/uploads/2023/11/denodo-tranparent-logo.png"
        alt="Denodo"
        className="h-full w-full object-contain"
      />
    ),
  },
  {
    name: "BigID",
    id: "bigid",
    icon: (
      <img
        src="https://www.atra.com.br/wp-content/uploads/2025/02/Horizontal_BigID_Logo-2048x1072.jpg"
        alt="BigID"
        className="h-full w-full object-contain"
      />
    ),
  },
  {
    name: "Partner",
    id: "partner",
    icon: (
      <img
        src="https://www.atra.com.br/wp-content/uploads/2023/08/image-removebg-preview-4.png"
        alt="Partner"
        className="h-full w-full object-contain"
      />
    ),
  },
  {
    name: "Azure",
    id: "azure",
    icon: (
      <img
        src="https://www.atra.com.br/wp-content/uploads/2021/03/Microsoft_Azure-Logo.wine_-1536x1024.png"
        alt="Azure"
        className="h-full w-full object-contain"
      />
    ),
  },
  {
    name: "Atlan",
    id: "atlan",
    icon: (
      <img
        src="https://www.atra.com.br/wp-content/uploads/2025/02/Atlan-logo-full.svg_.png"
        alt="Atlan"
        className="h-full w-full object-contain"
      />
    ),
  },
  {
    name: "IBM",
    id: "ibm",
    icon: (
      <img
        src="https://www.atra.com.br/wp-content/uploads/2025/06/logo-ibm.png"
        alt="IBM"
        className="h-full w-full object-contain"
      />
    ),
  },
  {
    name: "Salesforce Informatica",
    id: "salesforce-informatica",
    icon: (
      <img
        src="/imgs/salesforceinformatica.png"
        alt="Salesforce Informatica"
        className="h-full w-full object-contain"
      />
    ),
  },
  {
    name: "Databricks",
    id: "databricks",
    icon: (
      <img
        src="https://www.atra.com.br/wp-content/uploads/2025/05/Databricks_Logo2-1536x813.png"
        alt="Databricks"
        className="h-full w-full object-contain"
      />
    ),
  },
];

function LogoItem({
  logo,
  index,
  isWaving,
  stagger,
  totalCount,
  onDone,
}: {
  logo: LogoEntry;
  index: number;
  isWaving: boolean;
  stagger: number;
  totalCount: number;
  onDone: () => void;
}) {
  return (
    <motion.div
      aria-label={logo.name ?? "Logo"}
      animate={
        isWaving
          ? {
              y: [0, -6, 0],
              scale: [1, 1.05, 1],
              opacity: [1, 0.6, 1],
            }
          : {
              y: 0,
              scale: 1,
              opacity: 1,
            }
      }
      transition={
        isWaving
          ? {
              duration: 0.6,
              ease: "easeInOut",
              delay: index * stagger,
            }
          : {
              duration: 0.25,
              ease: "easeOut",
            }
      }
      onAnimationComplete={() => {
        if (isWaving && index === totalCount - 1) onDone();
      }}
      whileHover={{
        scale: 1.08,
        opacity: 1,
        transition: { type: "spring", stiffness: 340, damping: 24 },
      }}
      className="flex w-28 shrink-0 cursor-default flex-col items-center gap-2.5 sm:w-36 transition-opacity"
    >
      <span className="flex h-12 w-24 items-center justify-center sm:h-14 sm:w-30">
        {logo.icon}
      </span>
      {logo.name && (
        <span className="select-none whitespace-nowrap text-[11px] font-medium tracking-wide text-muted-foreground sm:text-xs">
          {logo.name}
        </span>
      )}
    </motion.div>
  );
}

export default function LogoCloudSwap({
  logos = DEFAULT_LOGOS,
  title,
  subtitle,
  interval = 4000,
  stagger = 0.08,
  className,
}: LogoCloudSwapProps) {
  const [waving, setWaving] = React.useState(false);
  const containerRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isVisible) return;
    const id = setInterval(() => setWaving(true), interval);
    return () => clearInterval(id);
  }, [interval, isVisible]);

  return (
    <section
      ref={containerRef}
      className={cn("w-full bg-background px-4 py-12 sm:py-16", className)}
    >
      {(title || subtitle) && (
        <div className="mx-auto max-w-2xl text-center">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}

      <div className={cn("mx-auto max-w-5xl", (title || subtitle) && "mt-10 sm:mt-12")}>
        <div className="hidden items-center justify-center gap-4 sm:flex sm:flex-wrap sm:gap-6 md:gap-8 lg:gap-10">
          {logos.map((logo, i) => (
            <LogoItem
              key={logo.id ?? i}
              logo={logo}
              index={i}
              isWaving={waving}
              stagger={stagger}
              totalCount={logos.length}
              onDone={() => setWaving(false)}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 place-items-center gap-y-6 sm:hidden">
          {logos.map((logo, i) => (
            <LogoItem
              key={logo.id ?? i}
              logo={logo}
              index={i}
              isWaving={waving}
              stagger={stagger}
              totalCount={logos.length}
              onDone={() => setWaving(false)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
