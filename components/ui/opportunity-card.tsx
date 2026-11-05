"use client";

import React, { useState } from "react";
import { Bookmark, ExternalLink, Calendar, MapPin, Award, Users, Share2, Check } from "lucide-react";
import { OpportunityItem } from "@/types";
import { Badge } from "./badge";
import { Button } from "./button";
import { useToast } from "./toast";
import { cn } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: OpportunityItem;
  featured?: boolean;
}

export function OpportunityCard({
  opportunity,
  featured = false,
}: OpportunityCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleBookmark = () => {
    const nextState = !bookmarked;
    setBookmarked(nextState);
    if (nextState) {
      toast({
        title: "Opportunity Saved",
        description: `"${opportunity.title}" added to your saved bookmarks.`,
        type: "success",
      });
    } else {
      toast({
        title: "Bookmark Removed",
        description: `Removed "${opportunity.title}" from your bookmarks.`,
        type: "info",
      });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/#opportunities?id=${opportunity.id}`
      );
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "Opportunity URL copied to clipboard.",
        type: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
        featured && "md:col-span-2 border-blue-200 bg-gradient-to-br from-white via-blue-50/20 to-white"
      )}
    >
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-semibold text-xs">
              {opportunity.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {opportunity.mode}
            </Badge>
            {opportunity.featured && (
              <Badge variant="navy" className="text-[10px]">
                Spotlight
              </Badge>
            )}
          </div>

          {/* Action buttons: Bookmark & Share */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              aria-label="Share opportunity"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleBookmark}
              aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
              className={cn(
                "p-2 rounded-xl transition-colors",
                bookmarked
                  ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              )}
            >
              <Bookmark className={cn("w-4 h-4", bookmarked && "fill-blue-600")} />
            </button>
          </div>
        </div>

        {/* Organization */}
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          {opportunity.organization}
        </p>

        {/* Title */}
        <h3
          className={cn(
            "font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-3",
            featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          )}
        >
          {opportunity.title}
        </h3>

        {/* Perks / Stipend / Prize */}
        {opportunity.stipendOrPrize && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold mb-4 border border-emerald-200/60">
            <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{opportunity.stipendOrPrize}</span>
          </div>
        )}

        {/* Meta details */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong className="text-slate-700">Deadline:</strong> {opportunity.deadline}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              <strong className="text-slate-700">Eligibility:</strong> {opportunity.eligibility}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong className="text-slate-700">Location:</strong> {opportunity.location}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {opportunity.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400">
          {opportunity.verifiedExternal ? "Verified Portal" : "Student Opportunity"}
        </span>
        <Button
          variant="primary"
          size="sm"
          href={opportunity.applyLink}
          external
          className="gap-1.5"
        >
          <span>Apply Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
