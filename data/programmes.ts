import { ProgrammeItem } from "@/types";

export const programmesData: ProgrammeItem[] = [
  {
    id: "school-of-engineering",
    school: "Engineering & Technology",
    title: "Bachelor of Technology (B.Tech)",
    degree: "B.Tech (4 Years / 8 Semesters)",
    duration: "4 Years Full Time",
    intake: "Multiple Specialized Streams",
    description:
      "A rigorous, industry-aligned engineering curriculum emphasizing applied computing, algorithmic problem solving, hardware-software co-design, and modern intelligence systems.",
    specializations: [
      "Computer Science & Engineering (CSE)",
      "Information Technology (IT)",
      "Artificial Intelligence & Machine Learning (AIML)",
      "Artificial Intelligence & Data Science (AI&DS)",
      "Electronics & Communication Engineering (ECE)",
      "Mechanical Engineering (ME)",
      "Civil Engineering (CE)",
    ],
    eligibility: "10+2 with Physics, Chemistry & Mathematics. Admission strictly through JEE Main Paper-1 via GGSIPU Central Counselling.",
    affiliation: "Affiliated to GGSIPU, Delhi • Approved by AICTE",
    image: "/images/engineering.jpg",
    brochureUrl: "https://adgips.ac.in/",
  },
  {
    id: "school-of-law",
    school: "Legal Education",
    title: "Integrated Law Programmes (Hons.)",
    degree: "B.A. LL.B. (Hons.) / B.B.A. LL.B. (Hons.)",
    duration: "5 Years Integrated Full Time",
    intake: "Comprehensive Legal Academics",
    description:
      "Premier legal pedagogy combining substantive jurisprudence, constitutional interpretation, corporate law, legal drafting, and extensive trial practice in institutional moot courts.",
    specializations: [
      "B.A. LL.B. (Hons.) — Humanities & Jurisprudence",
      "B.B.A. LL.B. (Hons.) — Business Management & Corporate Law",
      "Constitutional & Administrative Law",
      "Intellectual Property Rights (IPR)",
      "Cyber Law & Digital Evidence",
    ],
    eligibility: "10+2 with minimum 50% aggregate. Admission based on National Law Entrance Tests / CUET / GGSIPU CET counselling.",
    affiliation: "Affiliated to GGSIPU, Delhi • Approved by Bar Council of India (BCI)",
    image: "/images/law-moot-court.jpg",
    brochureUrl: "https://adgips.ac.in/",
  },
  {
    id: "school-of-management",
    school: "Management Studies",
    title: "Business & Management Education",
    degree: "BBA (3 Years) / MBA (2 Years)",
    duration: "3 Years (Undergraduate) / 2 Years (Postgraduate)",
    intake: "Morning & Evening Shifts",
    description:
      "Developing future business leaders, analytical thinkers, and entrepreneurs with deep exposure to corporate governance, financial analytics, digital marketing, and organizational dynamics.",
    specializations: [
      "Financial Management & Fintech",
      "Marketing Strategy & Brand Innovation",
      "Human Resource Analytics",
      "International Business & Operations",
      "Entrepreneurship & Venture Incubation",
    ],
    eligibility: "BBA: 10+2 with 50% marks. MBA: Recognized Bachelor's Degree. Admission via CUET / CAT / GGSIPU CET counselling rounds.",
    affiliation: "Affiliated to GGSIPU, Delhi • Approved by AICTE",
    image: "/images/management.jpg",
    brochureUrl: "https://adgips.ac.in/",
  },
];
