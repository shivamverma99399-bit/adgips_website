"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowUpRight, X, AlertCircle } from "lucide-react";
import { AnnouncementItem } from "@/types";
import { Badge } from "./badge";
import { Button } from "./button";
import { useToast } from "./toast";
import {
  modalBackdropVariants,
  modalContentVariants,
  cardHoverTransition,
} from "@/lib/animations";

interface AnnouncementItemProps {
  announcement: AnnouncementItem;
}

export function AnnouncementItemComponent({
  announcement,
}: AnnouncementItemProps) {
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (announcement.fileUrl) {
      window.open(announcement.fileUrl, "_blank", "noopener,noreferrer");
      toast({
        title: "Official Circular",
        description: `Opening signed institutional document (${announcement.fileSize || "PDF"}).`,
        type: "success",
      });
    } else {
      toast({
        title: "Official Circular Bulletin",
        description: `This circular was issued as an official text directive without an attached PDF file.`,
        type: "info",
      });
    }
  };

  // Parse date into Day and Month for clean editorial presentation
  const dateParts = announcement.date ? announcement.date.split(" ") : ["", "", ""];
  const day = dateParts[0] || "01";
  const month = (dateParts[1] || "OCT").slice(0, 3).toUpperCase();
  const year = dateParts[2] || "2026";

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        transition={cardHoverTransition}
        onClick={() => setShowModal(true)}
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-slate-900/80 hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-start gap-4 min-w-0">
          {/* Editorial Date Block */}
          <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/10 text-white group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
            <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">
              {month}
            </span>
            <span className="text-xl font-black leading-tight">{day}</span>
          </div>

          <div className="min-w-0 space-y-1.5">
            {/* Badges Strip */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[11px] py-0.5 px-2.5 font-semibold">
                {announcement.category}
              </Badge>
              {announcement.isUrgent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                  <AlertCircle className="w-2.5 h-2.5" />
                  Priority
                </span>
              )}
              {announcement.isDemo && (
                <Badge variant="demo" className="text-[10px] py-0 px-2">
                  Demo Notice
                </Badge>
              )}
              <span className="text-xs text-slate-400 font-medium">
                {year}
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 leading-snug">
              {announcement.title}
            </h3>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {announcement.summary}
            </p>
          </div>
        </div>

        {/* Action Column */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
          {announcement.fileSize && (
            <span className="text-xs font-mono text-slate-400 hidden lg:inline">
              {announcement.fileSize}
            </span>
          )}
          {announcement.fileUrl && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              aria-label="Download circular"
              title="Download circular document"
              className="p-2.5 rounded-xl text-blue-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          )}
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-white group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <span>Read</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </motion.div>

      {/* Notice View Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          >
            <motion.div
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#071126]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden p-6 sm:p-8 text-white"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close notice modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{announcement.category}</Badge>
                {announcement.isUrgent && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                    Priority Directive
                  </span>
                )}
                <span className="text-xs text-slate-400 font-medium">
                  Promulgated: {announcement.date}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white mb-4 leading-snug">
                {announcement.title}
              </h3>

              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-xs sm:text-sm text-slate-200 mb-5 leading-relaxed">
                <strong className="block text-blue-300 mb-1.5 font-bold uppercase tracking-wider text-[11px]">
                  Executive Summary
                </strong>
                {announcement.summary}
              </div>

              {announcement.details && (
                <div className="text-sm text-slate-300 leading-relaxed mb-6 space-y-2">
                  <p>{announcement.details}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-white/10">
                <span className="text-[11px] text-slate-400 font-medium text-center sm:text-left">
                  ADGIPS Registrar Secretariat • Shastri Park, Delhi
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowModal(false)}
                    className="flex-1 sm:flex-initial"
                  >
                    Close
                  </Button>
                  {announcement.fileUrl && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleDownload}
                      className="flex-1 sm:flex-initial font-bold"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      Download Circular ({announcement.fileSize || "PDF"})
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}