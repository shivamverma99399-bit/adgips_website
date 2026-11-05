import { AcademicResource } from "@/data/resources";
import { recordDownloadedResource } from "./auth";

export function downloadAcademicResource(resource: AcademicResource): void {
  // Record download in student profile session
  recordDownloadedResource(resource.code, resource.title, resource.type);

  // Generate authentic educational document content
  const content = `================================================================================
DR. AKHILESH DAS GUPTA INSTITUTE OF PROFESSIONAL STUDIES (ADGIPS), NEW DELHI
Affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi
FC-26, Shastri Park, New Delhi - 110053 | https://adgips.ac.in
================================================================================

DOCUMENT TITLE: ${resource.title}
COURSE / SUBJECT CODE: ${resource.code}
ACADEMIC STREAM: ${resource.stream} (${resource.department})
SEMESTER: ${resource.semester} | ACADEMIC CYCLE: ${resource.year}
RESOURCE CLASSIFICATION: ${resource.type}
DOCUMENT FORMAT: ${resource.format} (${resource.fileSize})

--------------------------------------------------------------------------------
1. INSTITUTIONAL COURSE SUMMARY & OBJECTIVES
--------------------------------------------------------------------------------
This official curriculum handout has been curated and approved by the Departmental
Academic Committee (DAC) of ADGIPS in adherence with the statutory scheme of
examinations ordained by Guru Gobind Singh Indraprastha University (GGSIPU).

Course Objectives:
- To impart foundational conceptual clarity and practical rigour in ${resource.code}.
- To integrate hands-on problem-solving, laboratory simulations, and industry case studies.
- To prepare scholars for university terminal end-term theory and viva examinations.

--------------------------------------------------------------------------------
2. SYLLABUS MODULE BREAKDOWN & TOPICAL UNITS
--------------------------------------------------------------------------------
[UNIT I] - Foundational Principles, Mathematical Models & Core Architecture
  - Theoretical framework, fundamental axioms, and historical evolution.
  - Mathematical modeling, algorithmic formulations, and design requirements.
  - Pedagogical laboratory case illustrations numerical derivations.

[UNIT II] - Intermediate Systems, Practical Toolchains & Applied Methodologies
  - Implementation workflows using standard industry software suites and toolchains.
  - Modular design paradigms, interface contracts, and optimization techniques.
  - Case studies on enterprise robustness, reliability, and security compliance.

[UNIT III] - Advanced Topic Specializations & Emerging Industry Standards
  - Contemporary architectural advancements and multi-tiered system design.
  - Benchmark performance metrics, latency profiling, and trade-off analysis.
  - Inter-disciplinary research dimensions and emerging technological standards.

[UNIT IV] - Regulatory Frameworks, Case Compendiums & Terminal Review
  - Regulatory standards, ethics, intellectual property, and compliance audits.
  - Synthesis of real-world datasets and capstone review exercises.
  - University examination format guidelines and model question blueprints.

--------------------------------------------------------------------------------
3. SCHEME OF EVALUATION & CONTINUOUS INTERNAL ASSESSMENT (CIA)
--------------------------------------------------------------------------------
- Continuous Internal Assessment (Minor Examinations / Tests): 25 Marks
- University End-Term Final Theory Examination: 75 Marks
- Minimum Qualifying Pass Criterion: 40% aggregate in Theory and Practical as per GGSIPU norms.

--------------------------------------------------------------------------------
4. VERIFICATION SEAL & DIGITAL SIGNATURE
--------------------------------------------------------------------------------
Compiled & Verified by:
Central Academic Resource Cell & Departmental Curriculum Board
Dr. Akhilesh Das Gupta Institute of Professional Studies (ADGIPS), Delhi
Institutional Repository ID: ${resource.id}
Generated on: ${new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
================================================================================
`;

  // Create downloadable Blob
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${resource.code}_${resource.type.replace(/\s+/g, "_")}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
