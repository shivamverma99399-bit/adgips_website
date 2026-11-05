"use client";

import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FolioFlowGallery } from "@/components/ui/folio-flow-gallery";
import { folioJournalPages } from "@/data/folio-gallery";

export default function GalleryPage() {
  return (
    <div className="flex-1 bg-transparent pt-2 pb-6">
      <SectionContainer className="py-0 md:py-0 pt-1 md:pt-1 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <Breadcrumb
            items={[
              { label: "Campus Life", href: "/#highlights" },
              { label: "3D Photo Journal" },
            ]}
          />
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive 3D Folio</span>
          </div>
        </div>

        {/* 3D FolioFlow Open-Book Gallery Experience */}
        <div className="w-full mt-1 mb-2">
          <FolioFlowGallery pages={folioJournalPages} />
        </div>
      </SectionContainer>
    </div>
  );
}
