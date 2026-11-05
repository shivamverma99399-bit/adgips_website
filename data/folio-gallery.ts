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

export const folioJournalPages: JournalPage[] = [
  // Spread 1: Campus Gateway & Student Life
  {
    id: "folio-01",
    pageNumber: 1,
    title: "8.08-Acre Gateway",
    subtitle: "Architectural Landmark",
    date: "Session 2026",
    location: "Shastri Park Corridor, New Delhi",
    category: "Campus",
    image: "/images/campus-main.png",
    caption:
      "Five interconnected circular red-brick academic blocks spanning over 23,636 square meters along East Delhi's institutional corridor.",
    tag: "CAMPUS",
    note: "Eco-friendly barrier-free collegiate complex designed for multidisciplinary education.",
  },
  {
    id: "folio-02",
    pageNumber: 2,
    title: "Amphitheater & Life",
    subtitle: "Open Air Theatre",
    date: "Daily Campus Hours",
    location: "Central Courtyard & OAT",
    category: "Campus",
    image: "/images/campus-life.jpg",
    caption:
      "Acoustic jamming circles, collegiate society rehearsals, and spontaneous intellectual debates under the shaded metropolitan canopy.",
    tag: "STUDENT LIFE",
    note: "The beating heart of campus gatherings between engineering and law lectures.",
  },

  // Spread 2: Engineering Laboratories & Innovation
  {
    id: "folio-03",
    pageNumber: 3,
    title: "Advanced AI & Systems Lab",
    subtitle: "High-Performance Computing",
    date: "Academic Year 2026",
    location: "Block 2 • Computing Centre",
    category: "Technical",
    image: "/images/engineering.jpg",
    caption:
      "Dedicated 1 Gbps fiber backbone powering parallel workstation clusters for deep learning, autonomous systems, and algorithm design.",
    tag: "TECH LABS",
    note: "Domain-specific research setups for machine learning and distributed networks.",
  },
  {
    id: "folio-04",
    pageNumber: 4,
    title: "Annual Hackathon Sprint",
    subtitle: "36-Hour Prototype Sprint",
    date: "October 2026",
    location: "Auditorium Innovation Labs",
    category: "Technical",
    image: "/images/hackathon.jpg",
    caption:
      "Inter-collegiate teams collaborating overnight to architect production-ready cloud architectures, fintech tools, and agentic workflows.",
    tag: "INNOVATION",
    note: "Over 45 teams building functional prototypes evaluated by industry mentors.",
  },

  // Spread 3: Central Library & Moot Court Hall
  {
    id: "folio-05",
    pageNumber: 5,
    title: "Central Research Library",
    subtitle: "Knowledge Commons",
    date: "Open 24/7 Digital Access",
    location: "Central Academic Block",
    category: "Academic",
    image: "/images/library.jpg",
    caption:
      "Multi-tiered learning repository holding over 85,000 reference volumes, international IEEE/Springer journals, and quiet research alcoves.",
    tag: "LIBRARY",
    note: "Round-the-clock digital database connectivity for scholars and competitive aspirants.",
  },
  {
    id: "folio-06",
    pageNumber: 6,
    title: "School of Law Moot Court",
    subtitle: "Trial Advocacy Chambers",
    date: "Jurisprudence Round 2026",
    location: "School of Law, Block 4",
    category: "Academic",
    image: "/images/law-moot-court.jpg",
    caption:
      "Authentic judicial bench simulation hall where student advocates prepare appellate memorials and argue constitutional jurisprudence.",
    tag: "ADVOCACY",
    note: "BCI-approved practical advocacy training for legal scholars and national rounds.",
  },

  // Spread 4: Utkarsh Cultural Fiesta & Battle of Bands
  {
    id: "folio-07",
    pageNumber: 7,
    title: "Utkarsh Cultural Fiesta",
    subtitle: "Annual College Festival",
    date: "14 & 15 November 2026",
    location: "Main Stage & Open Air Theatre",
    category: "Cultural",
    image: "/images/cultural-fest.jpg",
    caption:
      "The premier socio-cultural festival uniting collegiate dance troupes, street theatre (Nukkad Natak), and fine arts competitions.",
    tag: "UTKARSH",
    note: "Over 3,000 collegiate attendees from across Delhi-NCR participating in live arts.",
  },
  {
    id: "folio-08",
    pageNumber: 8,
    title: "Live Concerts & Bands",
    subtitle: "Rhythms Under The Stars",
    date: "Festival Finale Evening",
    location: "Main Auditorium Arena",
    category: "Cultural",
    image: "/images/cultural-fest.jpg",
    caption:
      "Electrifying musical resonance as top university rock and fusion bands vie for the annual trophy under dynamic festival stage strobes.",
    tag: "LIVE MUSIC",
    note: "Student music society ensembles delivering headline performances.",
  },

  // Spread 5: Corporate Leadership & Athletic Arena
  {
    id: "folio-09",
    pageNumber: 9,
    title: "Management Colloquium",
    subtitle: "Executive Leadership Suite",
    date: "Corporate Series 2026",
    location: "DMS Executive Boardroom",
    category: "Leadership",
    image: "/images/management.jpg",
    caption:
      "Department of Management Studies boardroom colloquiums, business case analytics, and corporate mentorship forums with tech recruiters.",
    tag: "MANAGEMENT",
    note: "Strategic corporate interaction bridging classroom theory and boardroom execution.",
  },
  {
    id: "folio-10",
    pageNumber: 10,
    title: "Athletics & Sports Meet",
    subtitle: "Inter-Collegiate Championship",
    date: "Annual Sports Week",
    location: "Campus Sports Grounds",
    category: "Sports",
    image: "/images/sports.jpg",
    caption:
      "Outdoor athletics championship featuring track and field, basketball leagues, volleyball tournaments, and collegiate sportsmanship.",
    tag: "ATHLETICS",
    note: "Promoting physical wellness, teamwork, and championship athletic discipline.",
  },

  // Spread 6: Technical Exhibition & Commencement Legacy
  {
    id: "folio-11",
    pageNumber: 11,
    title: "Tech Innovation Expo",
    subtitle: "Hardware & Robotics Showcase",
    date: "Annual Project Display",
    location: "Central Concourse",
    category: "Technical",
    image: "/images/hackathon.jpg",
    caption:
      "Student engineers demonstrating patented IoT hardware, embedded robotics controllers, and social impact software solutions.",
    tag: "EXHIBITION",
    note: "Mentored under faculty guidance with external industry evaluation panels.",
  },
  {
    id: "folio-12",
    pageNumber: 12,
    title: "Commencement & Legacy",
    subtitle: "Class of 2026",
    date: "Convocation Hall",
    location: "Main Auditorium Complex",
    category: "Campus",
    image: "/images/campus-main.png",
    caption:
      "Celebrating graduating engineers, corporate managers, and legal advocates stepping forth into global roles across Fortune 500 technology firms.",
    tag: "COMMENCEMENT",
    note: "Honoring academic excellence, ethical stewardship, and collegiate pride.",
  },
];
