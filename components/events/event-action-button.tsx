"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventItem } from "@/types";
import { EventRegistrationModal } from "./event-registration-modal";
import { Ticket, CheckCircle2 } from "lucide-react";

interface EventActionButtonProps {
  event: EventItem;
  isPast: boolean;
}

export function EventActionButton({ event, isPast }: EventActionButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  if (isPast) {
    return (
      <div className="p-3.5 rounded-xl bg-white/10 text-slate-300 text-xs text-center font-medium border border-white/5">
        This event has concluded. Proceedings have been archived in the collegiate record.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <Button
          variant={isRegistered ? "secondary" : "primary"}
          size="md"
          className="w-full justify-center font-bold shadow-lg shadow-blue-600/25"
          onClick={() => setModalOpen(true)}
        >
          {isRegistered ? (
            <span className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>Registered (View Pass)</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              <span>Register for Event</span>
            </span>
          )}
        </Button>
        <p className="text-[11px] text-center text-slate-400">
          Free entry for GGSIPU students • Instant e-pass issue
        </p>
      </div>

      <EventRegistrationModal
        event={event}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRegistered={() => setIsRegistered(true)}
      />
    </>
  );
}
