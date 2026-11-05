"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  User,
  Mail,
  GraduationCap,
  Sparkles,
  Ticket,
} from "lucide-react";
import { EventItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { getStoredSession, DEFAULT_STUDENT, registerStudentForEvent } from "@/lib/auth";

interface EventRegistrationModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: () => void;
}

export function EventRegistrationModal({
  event,
  isOpen,
  onClose,
  onRegistered,
}: EventRegistrationModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [semester, setSemester] = useState("6th Semester");
  const [branch, setBranch] = useState("B.Tech CSE (AI & ML)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const session = getStoredSession() || DEFAULT_STUDENT;
      setName(session.name || "Aryan Sharma");
      setEmail(session.email || "aryan.sharma@gmail.com");
      setEnrollmentNo(session.enrollmentNo || "04215602722");
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      registerStudentForEvent({
        id: event.id,
        title: event.title,
        category: event.category,
        date: event.date,
        venue: event.venue,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      toast({
        title: "Registration Confirmed!",
        description: `Your pass for ${event.title} is now active on your Student Dashboard.`,
        type: "success",
      });

      if (onRegistered) onRegistered();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#071126]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden text-white"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="navy" className="text-xs">
                  {event.category}
                </Badge>
                <span className="text-xs text-slate-400">Institutional Event Pass</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Register for {event.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Event Info Pill */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold">{event.date}</span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      GGSIPU Enrollment No.
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={enrollmentNo}
                        onChange={(e) => setEnrollmentNo(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Department / Stream
                    </label>
                    <input
                      type="text"
                      required
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Academic Semester
                    </label>
                    <input
                      type="text"
                      required
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="w-full justify-center font-bold"
                >
                  {isSubmitting ? (
                    <span>Confirming Registration...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Ticket className="w-4 h-4" />
                      <span>Confirm & Issue Event Pass</span>
                    </span>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Success confirmation state */
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white">Registration Successful!</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                  You are confirmed for <span className="text-white font-semibold">{event.title}</span>. Your e-pass has been generated and saved to your Student Dashboard.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="white" size="sm" href="/dashboard">
                  View in Dashboard &rarr;
                </Button>
                <Button variant="outline" size="sm" onClick={onClose}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
