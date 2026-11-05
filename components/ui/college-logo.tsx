import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CollegeLogoProps {
  className?: string;
  variant?: "light" | "dark" | "default";
  showSubtitle?: boolean;
  linkToHome?: boolean;
}

export function CollegeLogo({
  className,
  variant = "default",
  showSubtitle = true,
  linkToHome = true,
}: CollegeLogoProps) {
  const isDark = variant === "dark";

  const logoContent = (
    <div className={cn("flex items-center gap-3 select-none group", className)}>
      {/* Official ADGIPS Brandmark Emblem */}
      <div className="relative flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-slate-900 to-[#0a192f] p-1.5 shadow-md border border-slate-700/40 shrink-0 overflow-hidden">
        <Image
          src="/images/adgips-logo.png"
          alt="ADGIPS Logo"
          width={48}
          height={48}
          className="object-contain w-full h-full transform group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {/* College Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-extrabold tracking-tight text-base sm:text-lg leading-tight transition-colors",
              isDark ? "text-white" : "text-[#0a192f]"
            )}
          >
            ADGIPS
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-800">
            Delhi
          </span>
        </div>
        {showSubtitle && (
          <span
            className={cn(
              "text-[10px] sm:text-[11px] font-medium leading-tight max-w-[200px] sm:max-w-[280px] truncate",
              isDark ? "text-slate-300" : "text-slate-600"
            )}
            title="Dr. Akhilesh Das Gupta Institute of Professional Studies"
          >
            Dr. Akhilesh Das Gupta Institute of Professional Studies
          </span>
        )}
      </div>
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" aria-label="ADGIPS Home" className="focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
