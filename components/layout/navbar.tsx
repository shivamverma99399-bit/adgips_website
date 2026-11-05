"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Menu, User, ShieldCheck } from "lucide-react";
import { CollegeLogo } from "@/components/ui/college-logo";
import { Button } from "@/components/ui/button";
import { SearchModal } from "@/components/ui/search-modal";
import { MobileNavigation } from "./mobile-navigation";
import { cn } from "@/lib/utils";
import { getStoredSession, StudentProfile } from "@/lib/auth";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [session, setSession] = useState<StudentProfile | null>(null);

  useEffect(() => {
    setSession(getStoredSession());

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleSessionChange = () => {
      setSession(getStoredSession());
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("adgips_session_change", handleSessionChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("adgips_session_change", handleSessionChange);
    };
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events", highlight: true },
    { label: "Activities", href: "/activities" },
    { label: "Resources", href: "/resources" },
    { label: "Gallery", href: "/gallery" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Admin", href: "/admin" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 ease-out",
          scrolled
            ? "bg-[#040915]/85 backdrop-blur-xl shadow-lg shadow-black/25 border-b border-white/10 py-2.5"
            : "bg-[#040915]/55 backdrop-blur-md shadow-none border-b border-white/5 py-3.5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Authentic College Logo with Micro-Interaction */}
          <motion.div whileHover={{ scale: 1.01 }} className="shrink-0">
            <CollegeLogo variant="dark" />
          </motion.div>

          {/* Desktop Navigation Links with Smooth LayoutId Indicator */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 relative">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 z-10",
                    isActive
                      ? "text-white font-semibold"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  {/* Smooth Framer Motion Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-blue-600/30 rounded-lg border border-blue-400/40 -z-10 shadow-xs"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{link.label}</span>
                  {link.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/80" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster: Search + Student Login / Dashboard + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger with Micro-interaction */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSearchOpen(true)}
              aria-label="Open search dialog"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-white/10 hover:bg-white/15 rounded-xl transition-colors border border-white/15 cursor-pointer backdrop-blur-sm"
            >
              <Search className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-white/15 text-[10px] text-slate-200 border border-white/20 font-mono shadow-2xs">
                ⌘K
              </kbd>
            </motion.button>

            {/* Student Login / Dashboard CTA */}
            {session ? (
              <Button
                variant="primary"
                size="sm"
                href="/dashboard"
                className="hidden sm:inline-flex shadow-sm shadow-blue-500/20 font-semibold"
              >
                <div className="w-4 h-4 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center mr-1.5">
                  {session.name[0]}
                </div>
                <span>Dashboard</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                href="/login"
                className="hidden sm:inline-flex shadow-sm shadow-blue-500/20"
              >
                <User className="w-3.5 h-3.5 mr-1" />
                <span>Student Login</span>
              </Button>
            )}

            {/* Mobile Menu Hamburger */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Global Interactive Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Drawer Navigation */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenSearch={() => setSearchOpen(true)}
      />
    </>
  );
}
