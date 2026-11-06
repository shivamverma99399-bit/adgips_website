export interface JournalPage {
  id: string;
  pageNumber: number;
  title: string;
  subtitle?: string;
  date: string;
  location: string;
  category: "Campus" | "Technical" | "Academic" | "Cultural" | "Sports" | "Leadership";
  image: string;
  caption: string;
  tag?: string;
  note?: string;
}

/**
 * 3D FolioFlow Journal Pages
 * Left empty until authentic gallery archives are curated and published by administrators.
 */
export const folioJournalPages: JournalPage[] = [];
