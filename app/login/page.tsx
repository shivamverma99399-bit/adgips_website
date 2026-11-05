"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  FileText,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { CollegeLogo } from "@/components/ui/college-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AnimatedProgressBar, AnimatedProgressRing } from "@/components/ui/animated-progress";
import { modalContentVariants } from "@/lib/animations";

export default function LoginPage() {
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowDashboard(true);
      toast({
        title: "Session Initialized",
        description: `Welcome to the Student Academic Experience Dashboard!`,
        type: "success",
      });
    }, 450);
  };

  return (
    <div className="flex-1 bg-transparent flex items-center justify-center pt-4 sm:pt-6 pb-10 px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {!showDashboard ? (
          /* Login Authentication Card */
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full space-y-6 bg-[#071126]/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/15 text-white"
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <CollegeLogo variant="dark" linkToHome={false} showSubtitle={false} />
              </div>
              <Badge variant="secondary" className="text-xs">
                Student & Academic Experience Portal
              </Badge>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Sign in to Your Account
              </h1>
              <p className="text-xs text-slate-300">
                Access attendance, campus event registrations, academic marks, and notice circulars.
              </p>
            </div>

            {/* Quick Demo Dashboard Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setShowDashboard(true)}
              className="w-full p-3 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 text-blue-200 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Explore Student Dashboard (Live Demo)</span>
              </span>
              <span className="text-[11px] font-semibold text-blue-400">&rarr;</span>
            </motion.button>

            {/* Role Toggle Switch */}
            <div className="flex rounded-xl bg-white/10 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  role === "student"
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Student (GGSIPU)
              </button>
              <button
                type="button"
                onClick={() => setRole("faculty")}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  role === "faculty"
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Faculty & Staff
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {role === "student" ? "GGSIPU Enrollment / Roll Number" : "Institutional Webmail / Faculty ID"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === "student" ? "e.g. 04215602722" : "name@adgips.ac.in"}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 bg-white/10 border-white/20" />
                  <span>Remember me</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Self-Service Password Reset",
                      description: "Contact the Academic Cell (Block 1) or IT Support for credential assistance.",
                      type: "info",
                    });
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-lg shadow-blue-600/30 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Sign In to Platform
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Support Footer */}
            <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
              <p>Need help? Contact ADGIPS IT Administration Cell</p>
              <Link href="/" className="text-blue-400 hover:underline font-semibold mt-1 inline-block">
                &larr; Back to College Homepage
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Live Student Academic & Productivity Dashboard */
          <motion.div
            key="dashboard-view"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl w-full space-y-6 bg-[#071126]/95 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/15 text-white"
          >
            {/* Top Bar: Profile & Logout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/30">
                  AS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-white">
                      Aryan Sharma
                    </h2>
                    <Badge variant="navy" className="text-[10px] py-0 px-2 bg-blue-600/40 border-blue-400/30">
                      GGSIPU Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Enrollment: 04215602722 • B.Tech CSE (AI & ML), 6th Sem
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDashboard(false)}
                  className="gap-1.5 text-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit Demo</span>
                </Button>
              </div>
            </div>

            {/* 4 Animated Stat Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <motion.div
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/20"
              >
                <div className="flex items-center justify-between text-blue-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Current CGPA</span>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <p className="text-2xl font-mono font-extrabold text-white">
                  <AnimatedCounter value={8.92} decimals={2} />
                </p>
                <p className="text-[10px] text-blue-300 font-medium mt-0.5">Top 5% of Department</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20"
              >
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Attendance</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-2xl font-mono font-extrabold text-white">
                  <AnimatedCounter value={86.4} decimals={1} suffix="%" />
                </p>
                <p className="text-[10px] text-emerald-300 font-medium mt-0.5">&gt; 75% GGSIPU Cutoff</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Earned Credits</span>
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <p className="text-2xl font-mono font-extrabold text-white">
                  <AnimatedCounter value={18} /> <span className="text-xs text-slate-400 font-normal">/ 22</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Semester 6 in progress</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20"
              >
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active Targets</span>
                  <Award className="w-3.5 h-3.5" />
                </div>
                <p className="text-2xl font-mono font-extrabold text-white">
                  <AnimatedCounter value={7} /> <span className="text-xs text-slate-400 font-normal">Events</span>
                </p>
                <p className="text-[10px] text-amber-300 font-medium mt-0.5">Hackathons & Fests</p>
              </motion.div>
            </div>

            {/* Attendance & Subject Progress Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
              {/* Radial Progress Ring (4 cols) */}
              <div className="md:col-span-4 p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                <AnimatedProgressRing
                  value={86.4}
                  size={104}
                  strokeWidth={9}
                  color="emerald"
                  label="Statutory Attendance Compliance"
                  sublabel="Verified"
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Eligible for GGSIPU End-Term Examinations
                </p>
              </div>

              {/* Subject-Wise Progress Bars (8 cols) */}
              <div className="md:col-span-8 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Current Semester Course Progress
                  </h4>
                  <span className="text-[11px] text-slate-400">Target &ge; 75%</span>
                </div>

                <AnimatedProgressBar
                  value={92}
                  label="Data Mining & Business Intelligence (ETCS-302)"
                  sublabel="23 of 25 Lectures Attended"
                  color="emerald"
                />

                <AnimatedProgressBar
                  value={84}
                  label="Artificial Neural Networks & Deep Learning (ETAIDS-304)"
                  sublabel="21 of 25 Lectures Attended"
                  color="blue"
                />

                <AnimatedProgressBar
                  value={88}
                  label="Cloud Computing & Microservices Architecture (ETIT-306)"
                  sublabel="22 of 25 Lectures Attended"
                  color="blue"
                />

                <AnimatedProgressBar
                  value={76}
                  label="Universal Human Values & Professional Ethics (HVPE-102)"
                  sublabel="19 of 25 Lectures Attended (Near 75% limit)"
                  color="amber"
                />
              </div>
            </div>

            {/* Cumulative Degree Completion Progress Bar */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <AnimatedProgressBar
                value={75}
                max={100}
                label="B.Tech Degree Completion Trajectory (Year 3 of 4)"
                sublabel="114 of 152 total GGSIPU academic credits accumulated"
                color="indigo"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>ADGIPS Academic Cell & Examination Branch</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Admit Card Ready",
                      description: "Downloading Mid-Term Examination Hall Ticket (PDF).",
                      type: "info",
                    });
                  }}
                  className="gap-1.5 text-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Hall Ticket</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  href="/resources"
                  className="gap-1.5 text-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Academic Handouts</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
