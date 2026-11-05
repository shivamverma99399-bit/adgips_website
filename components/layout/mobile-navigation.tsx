"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, Calendar, Compass, BookOpen, Image as ImageIcon, UserCheck, ExternalLink } from "lucide-react";
import { CollegeLogo } from "@/components/ui/college-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileNavigation({
  isOpen,
  onClose,
  onOpenSearch,
}: MobileNavigationProps) {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/", icon: null },
    { label: "Events", href: "/events", icon: Calendar, badge: "Fests" },
    { label: "Activities", href: "/activities", icon: Compass, badge: "Clubs" },
    { label: "Resources", href: "/resources", icon: BookOpen },
    { label: "Gallery", href: "/gallery", icon: ImageIcon },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Animated Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#071126]/95 backdrop-blur-2xl shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-white/10 text-white"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <CollegeLogo variant="dark" showSubtitle={false} />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Quick Search Action */}
              <div className="mt-5">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 text-slate-300 text-sm font-medium hover:bg-white/15 transition-colors cursor-pointer border border-white/10"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    Search campus...
                  </span>
                  <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/15 text-slate-300">
                    ⌘K
                  </kbd>
                </motion.button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 space-y-1.5">
                {links.map((link, i) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-blue-600/30 text-white font-semibold border border-blue-500/30"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                          {link.label}
                        </span>
                        {link.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/20">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <Button
                variant="primary"
                size="md"
                href="/login"
                className="w-full justify-center shadow-lg shadow-blue-600/25"
                onClick={onClose}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Student Login
              </Button>

              <a
                href="https://adgips.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 py-1"
              >
                <span>Official College Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <p className="text-[11px] text-center text-slate-400">
                Dr. Akhilesh Das Gupta Institute of Professional Studies
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}