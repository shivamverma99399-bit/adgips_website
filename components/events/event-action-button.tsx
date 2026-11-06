"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { EventItem } from "@/types";
import { Ticket, ExternalLink, ShieldCheck } from "lucide-react";

interface EventActionButtonProps {
  event: EventItem;
  isPast: boolean;
}

export function EventActionButton({ event, isPast }: EventActionButtonProps) {
  if (isPast) {
    return (
      <div className="p-3.5 rounded-xl bg-white/10 text-slate-300 text-xs text-center font-medium border border-white/5">
        This event has concluded. Proceedings have been archived in the collegiate record.
      </div>
    );
  }

  if (event.registrationLink) {
    return (
      <div className="space-y-2">
        <Button
          variant="primary"
          size="md"
          href={event.registrationLink}
          external
          className="w-full justify-center font-bold shadow-lg shadow-blue-600/25"
        >
          <span className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            <span>Register via Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </span>
        </Button>
        <p className="text-[11px] text-center text-slate-400">
          Official registration form hosted by organizing cell
        </p>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs text-center font-medium">
      <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
        <ShieldCheck className="w-4 h-4" />
        <span className="font-semibold">Open Campus Admission</span>
      </div>
      <p className="text-[11px] text-slate-400">
        Free entry for all GGSIPU students with valid college identity card at the venue.
      </p>
    </div>
  );
}
