export interface AcademicResource {
  id: string;
  code: string;
  title: string;
  stream: "Engineering" | "Law" | "Management";
  department: string;
  semester: string;
  semesterNumber: number;
  type: "Syllabus Scheme" | "Previous Year Paper" | "Lab Manual" | "Lecture Notes";
  year: string;
  format: "PDF" | "DOCX";
  fileSize: string;
  downloadsCount: number;
  description: string;
}

export const initialResourcesData: AcademicResource[] = [
  {
    id: "res-etcs-101",
    code: "ETCS-101",
    title: "Applied Programming & Computational Thinking Scheme",
    stream: "Engineering",
    department: "Computer Science & Engineering",
    semester: "Semester 1",
    semesterNumber: 1,
    type: "Syllabus Scheme",
    year: "2026",
    format: "PDF",
    fileSize: "1.4 MB",
    downloadsCount: 1240,
    description: "Official GGSIPU curriculum including weekly lab exercise schemes, terminal examination blueprints, and continuous internal assessment rubrics.",
  },
  {
    id: "res-etcs-202",
    code: "ETCS-202",
    title: "Data Structures & Algorithms Theory & Lab Handout",
    stream: "Engineering",
    department: "Computer Science & Engineering",
    semester: "Semester 3",
    semesterNumber: 3,
    type: "Lab Manual",
    year: "2026",
    format: "PDF",
    fileSize: "2.8 MB",
    downloadsCount: 3120,
    description: "Complete DSA laboratory manual with C++ implementations, time complexity benchmarks, graph traversals, and dynamic programming exercises.",
  },
  {
    id: "res-etaids-304",
    code: "ETAIDS-304",
    title: "Artificial Neural Networks & Deep Learning End-Term PYQ (2025)",
    stream: "Engineering",
    department: "AI & Data Science",
    semester: "Semester 6",
    semesterNumber: 6,
    type: "Previous Year Paper",
    year: "2025",
    format: "PDF",
    fileSize: "980 KB",
    downloadsCount: 1845,
    description: "Verified GGSIPU end-term university question papers covering CNNs, Transformer attention mechanisms, backpropagation derivations, and optimization algorithms.",
  },
  {
    id: "res-etit-306",
    code: "ETIT-306",
    title: "Cloud Computing & Microservices Architecture Lecture Notes",
    stream: "Engineering",
    department: "Information Technology",
    semester: "Semester 6",
    semesterNumber: 6,
    type: "Lecture Notes",
    year: "2026",
    format: "PDF",
    fileSize: "3.2 MB",
    downloadsCount: 2150,
    description: "Comprehensive departmental lecture handouts, Docker containerization guides, Kubernetes orchestration principles, and AWS/GCP architecture case studies.",
  },
  {
    id: "res-llb-101",
    code: "LLB-101",
    title: "Constitutional Law of India (Parts I & II) Case Compendium",
    stream: "Law",
    department: "School of Law",
    semester: "Semester 1 & 2",
    semesterNumber: 1,
    type: "Syllabus Scheme",
    year: "2026",
    format: "PDF",
    fileSize: "4.1 MB",
    downloadsCount: 2890,
    description: "Authoritative compendium of landmark Supreme Court rulings, Fundamental Rights jurisprudence, Directive Principles, and writ jurisdiction case summaries.",
  },
  {
    id: "res-llb-103",
    code: "LLB-103",
    title: "Law of Torts, Consumer Protection & MV Act Past Papers",
    stream: "Law",
    department: "School of Law",
    semester: "Semester 2",
    semesterNumber: 2,
    type: "Previous Year Paper",
    year: "2025",
    format: "PDF",
    fileSize: "1.1 MB",
    downloadsCount: 1670,
    description: "Five-year consolidated GGSIPU question papers with model answers covering negligence, vicarious liability, Consumer Protection Act 2019, and Motor Vehicles claims.",
  },
  {
    id: "res-llb-501",
    code: "LLB-501",
    title: "Moot Court Exercise & Clinical Legal Education Guidelines",
    stream: "Law",
    department: "School of Law",
    semester: "Semester 9 & 10",
    semesterNumber: 9,
    type: "Lab Manual",
    year: "2026",
    format: "PDF",
    fileSize: "2.3 MB",
    downloadsCount: 1420,
    description: "Bar Council of India mandated practical handbook detailing memorial formatting, oral advocacy argumentation rules, courtroom etiquette, and legal aid clinic logs.",
  },
  {
    id: "res-bba-102",
    code: "BBA-102",
    title: "Managerial Economics & Quantitative Methods Compendium",
    stream: "Management",
    department: "School of Management Studies",
    semester: "Semester 2",
    semesterNumber: 2,
    type: "Syllabus Scheme",
    year: "2026",
    format: "PDF",
    fileSize: "1.9 MB",
    downloadsCount: 1980,
    description: "Core syllabus outline and mathematical problem sets covering demand elasticity, market structure pricing, cost curve optimization, and regression analysis.",
  },
  {
    id: "res-bba-201",
    code: "BBA-201",
    title: "Financial Management & Capital Budgeting End-Term Papers",
    stream: "Management",
    department: "School of Management Studies",
    semester: "Semester 4",
    semesterNumber: 4,
    type: "Previous Year Paper",
    year: "2025",
    format: "PDF",
    fileSize: "1.3 MB",
    downloadsCount: 2210,
    description: "University end-term question papers featuring discounted cash flow (DCF), cost of capital (WACC), dividend policy theories, and working capital ratios.",
  },
  {
    id: "res-bba-304",
    code: "BBA-304",
    title: "Business Analytics & Spreadsheet Modeling Lab Manual",
    stream: "Management",
    department: "School of Management Studies",
    semester: "Semester 5",
    semesterNumber: 5,
    type: "Lab Manual",
    year: "2026",
    format: "PDF",
    fileSize: "3.5 MB",
    downloadsCount: 1750,
    description: "Practical exercises in Microsoft Excel & Power BI, financial modeling templates, sensitivity analysis, Monte Carlo simulation, and business data dashboards.",
  },
];

const LOCAL_STORAGE_RESOURCES_KEY = "adgips_published_resources";

export function getResources(): AcademicResource[] {
  if (typeof window === "undefined") return initialResourcesData;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RESOURCES_KEY);
    if (!raw) return initialResourcesData;
    const custom = JSON.parse(raw);
    return [...custom, ...initialResourcesData];
  } catch {
    return initialResourcesData;
  }
}

export function savePublishedResource(res: AcademicResource): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RESOURCES_KEY);
    const custom: AcademicResource[] = raw ? JSON.parse(raw) : [];
    custom.unshift(res);
    localStorage.setItem(LOCAL_STORAGE_RESOURCES_KEY, JSON.stringify(custom));
    window.dispatchEvent(new Event("adgips_resources_updated"));
  } catch (err) {
    console.error("Failed to save resource", err);
  }
}
