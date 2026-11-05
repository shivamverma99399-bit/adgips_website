export type EventStatus = 'upcoming' | 'ongoing' | 'past' | 'completed' | 'registrations_open';

export type EventCategory = 
  | 'Technical' 
  | 'Cultural' 
  | 'Workshops' 
  | 'Competitions' 
  | 'Sports' 
  | 'Seminars' 
  | 'Academic'
  | 'Institutional'
  | 'Industrial Visits';

export interface EventActivity {
  number: number;
  title: string;
  tagline: string;
  date: string;
  time: string;
  venue: string;
  eligibility: string;
  description: string;
  guidelines: string[];
}

export interface EventScheduleItem {
  time: string;
  activity: string;
  venue?: string;
  speakerOrLead?: string;
}

export interface EventRecap {
  summary: string;
  participantCount?: string;
  keyTakeaways?: string[];
  certificateInfo?: string;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  description: string;
  shortDescription?: string;
  date: string;
  time: string;
  venue: string;
  category: EventCategory;
  status: EventStatus;
  image: string;
  featured?: boolean;
  registrationLink?: string;
  eligibility: string;
  organizedBy: string;
  department?: string;
  tags: string[];
  activities?: EventActivity[];
  poster?: string;
  highlights?: string[];
  schedule?: EventScheduleItem[];
  recap?: EventRecap;
  galleryImages?: string[];
  isPast?: boolean;
}

export type OpportunityCategory = 
  | 'Hackathon' 
  | 'Internship' 
  | 'Competition' 
  | 'Scholarship' 
  | 'Workshop' 
  | 'Student Programme';

export interface OpportunityItem {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  deadline: string;
  eligibility: string;
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  applyLink: string;
  stipendOrPrize?: string;
  tags: string[];
  featured?: boolean;
  verifiedExternal?: boolean;
}

export interface InstitutionalHighlight {
  id: string;
  metric: string;
  label: string;
  sublabel: string;
  description: string;
  category: 'Infrastructure' | 'Placements' | 'Academics' | 'Campus Life';
  verifiedSource: string;
  icon: string;
}

export interface ProgrammeItem {
  id: string;
  school: 'Engineering & Technology' | 'Legal Education' | 'Management Studies';
  title: string;
  degree: string;
  duration: string;
  intake?: string;
  description: string;
  specializations: string[];
  eligibility: string;
  affiliation: string;
  image: string;
  brochureUrl?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'Academic' | 'Examination' | 'Placement' | 'Events' | 'Administrative';
  date: string;
  isUrgent?: boolean;
  isDemo: boolean;
  summary: string;
  details?: string;
  fileSize?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Technical' | 'Cultural' | 'Sports' | 'Academic';
  image: string;
  description: string;
  date?: string;
  aspect?: 'square' | 'wide' | 'tall';
}

export interface QuickAccessItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  iconName: string;
  badge?: string;
  accentColor: string;
}
