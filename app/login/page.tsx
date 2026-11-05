"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  FileText,
  LogOut,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { CollegeLogo } from "@/components/ui/college-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AnimatedProgressBar, AnimatedProgressRing } from "@/components/ui/animated-progress";
import { modalContentVariants } from "@/lib/animations";

function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  const handleGoogleQuickLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowDashboard(true);
      toast({
        title: "Google Sign-In Successful",
        description: "Welcome to the Student Academic Experience Dashboard!",
        type: "success",
      });
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowDashboard(true);
      toast({
        title: "Google Session Initialized",
        description: `Signed in with ${email || "Google Account"}!`,
        type: "success",
      });
    }, 450);
  };

  return (
    <div className="flex-1 bg-transparent flex items-center justify-center pt-4 sm:pt-6 pb-10 px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {!showDashboard ? (
          /* Google / Gmail Authentication Card */
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full space-y-5 bg-[#071126]/90 backdrop-blur-2xl p-7 sm:p-9 rounded-3xl shadow-2xl border border-white/15 text-white"
          >
            {/* Header */}
            <div className="text-center space-y-2.5">
              <div className="flex justify-center">
                <CollegeLogo variant="dark" linkToHome={false} showSubtitle={false} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-semibold text-blue-300">
                <GoogleLogo className="w-3.5 h-3.5" />
                <span>Google Workspace & SSO</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Sign in with Google
              </h1>
              <p className="text-xs text-slate-300">
                Use your Gmail address or ADGIPS Google Workspace account to access the student portal.
              </p>
            </div>

            {/* Primary One-Click "Continue with Google" Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGoogleQuickLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer border border-white/20 disabled:opacity-50"
            >
              <GoogleLogo className="w-5 h-5" />
              <span>Continue with Google</span>
            </motion.button>

            {/* Crisp Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#071126] px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                or sign in with Gmail
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            {/* Form: Gmail ID & Password */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Gmail Address Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Gmail Address / Google Account ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-red-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/15 bg-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 bg-white/10 border-white/20"
                  />
                  <span>Stay signed in</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Google Account Recovery",
                      description: "Use Google's official account recovery page or contact ADGIPS IT cell.",
                      type: "info",
                    });
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign In Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-lg shadow-blue-600/30 cursor-pointer font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Signing in with Google...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Quick Demo Dashboard Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setShowDashboard(true)}
              className="w-full p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Explore Student Dashboard (Live Demo)</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">&rarr;</span>
            </motion.button>

            {/* Support Footer & Security Notice */}
            <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10 space-y-1.5">
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected by Google Identity Services & OAuth 2.0</span>
              </p>
              <div>
                <Link href="/" className="text-blue-400 hover:underline font-semibold inline-block">
                  &larr; Back to College Homepage
                </Link>
              </div>
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
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/30">
                  {email ? email[0].toUpperCase() : "A"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-white">
                      {email
                        ? email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase())
                        : "Aryan Sharma"}
                    </h2>
                    <Badge variant="navy" className="text-[10px] py-0 px-2 bg-blue-600/40 border-blue-400/30">
                      Google SSO Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {email || "aryan.sharma@gmail.com"} • B.Tech CSE (AI & ML), 6th Sem
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
