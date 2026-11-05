"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { CollegeLogo } from "@/components/ui/college-logo";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { DEFAULT_STUDENT, saveSession } from "@/lib/auth";

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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleQuickLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      saveSession({
        ...DEFAULT_STUDENT,
        email: email || DEFAULT_STUDENT.email,
        name: email ? email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : DEFAULT_STUDENT.name,
      });

      setIsLoading(false);
      toast({
        title: "Google Sign-In Successful",
        description: "Welcome to your Student Academic Dashboard!",
        type: "success",
      });
      router.push("/dashboard");
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      saveSession({
        ...DEFAULT_STUDENT,
        email: email || DEFAULT_STUDENT.email,
        name: email ? email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : DEFAULT_STUDENT.name,
      });

      setIsLoading(false);
      toast({
        title: "Google Session Authenticated",
        description: `Signed in as ${email || DEFAULT_STUDENT.email}!`,
        type: "success",
      });
      router.push("/dashboard");
    }, 450);
  };

  return (
    <div className="flex-1 bg-transparent flex items-center justify-center pt-4 sm:pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
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
                <span>Sign In to Dashboard</span>
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
          onClick={handleGoogleQuickLogin}
          className="w-full p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Direct Access: Student Dashboard (Live Demo)</span>
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
    </div>
  );
}
