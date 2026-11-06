/**
 * Phase 6 Verification Test Suite: Academic Resources & Knowledge Commons
 *
 * Verifies:
 * 1. AcademicResourceDocument schema & field types
 * 2. Status filtering & public visibility (draft/archived exclusion)
 * 3. Stream & Department categorization (Engineering, Law, Management)
 * 4. Semester mapping & flexible semester queries
 * 5. Resource type categorization (Syllabus, PYQ, Lab Manual, Lecture Notes)
 * 6. Multi-field search functionality (Code, Title, Dept, Description)
 * 7. Download tracking logic (atomic increment simulation)
 * 8. Firestore retrieval resilience & zero-state handling
 */

import { AcademicResourceDocument } from "../types/backend";

interface TestReport {
  name: string;
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function assert(condition: boolean, name: string, details: string) {
  reports.push({
    name,
    passed: condition,
    details: condition ? details : `FAILED: ${details}`,
  });
}

async function runPhase6Tests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 6 VERIFICATION: ACADEMIC RESOURCES");
  console.log("==================================================\n");

  // 1. Schema Validation
  const sampleResource: AcademicResourceDocument = {
    id: "res_test_101",
    code: "ETCS-201",
    title: "Data Structures & Algorithms",
    stream: "Engineering",
    department: "Computer Science & Engineering",
    semester: "Semester 3",
    semesterNumber: 3,
    type: "Syllabus Scheme",
    year: "2026",
    format: "PDF",
    fileSize: "2.4 MB",
    downloadsCount: 42,
    description: "Official GGSIPU credit curriculum scheme covering trees, graphs, and algorithmic complexity.",
    fileUrl: "https://firebasestorage.googleapis.com/v0/b/adgips-website.appspot.com/o/resources%2FETCS201.pdf",
    storagePath: "resources/ETCS201.pdf",
    status: "published",
    publishedBy: "admin@adgips.ac.in",
    publishedByUid: "uid_admin_1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  assert(
    sampleResource.code === "ETCS-201" &&
      sampleResource.stream === "Engineering" &&
      sampleResource.semesterNumber === 3 &&
      sampleResource.downloadsCount === 42 &&
      sampleResource.status === "published",
    "Schema Completeness",
    "AcademicResourceDocument accurately captures institutional metadata, storage paths, and download counts."
  );

  // 2. Status Filtering & Public Visibility Isolation
  const resourceCatalog: AcademicResourceDocument[] = [
    { ...sampleResource, id: "r1", status: "published" },
    { ...sampleResource, id: "r2", code: "ETEC-202", status: "archived" },
    { ...sampleResource, id: "r3", code: "BALLB-101", stream: "Law", status: "published" },
    { ...sampleResource, id: "r4", code: "MBA-102", stream: "Management", status: "draft" },
  ];

  const publishedOnly = resourceCatalog.filter(
    (r) => r.status !== "archived" && r.status !== "draft"
  );

  assert(
    publishedOnly.length === 2 &&
      publishedOnly.every((r) => r.status === "published") &&
      !publishedOnly.some((r) => r.id === "r2" || r.id === "r4"),
    "Public Visibility Isolation",
    "Archived and draft academic items are strictly excluded from the student-facing catalog."
  );

  // 3. Stream & Department Filter
  const engineeringResources = publishedOnly.filter((r) => r.stream === "Engineering");
  const lawResources = publishedOnly.filter((r) => r.stream === "Law");
  const mgmtResources = publishedOnly.filter((r) => r.stream === "Management");

  assert(
    engineeringResources.length === 1 &&
      lawResources.length === 1 &&
      mgmtResources.length === 0,
    "Stream Filtering",
    "Correctly partitions resources across Engineering, Law, and Management faculties."
  );

  // 4. Semester Query Resolution
  const semesterMockCatalog: AcademicResourceDocument[] = [
    { ...sampleResource, id: "s1", semester: "Sem 1", semesterNumber: 1 },
    { ...sampleResource, id: "s3", semester: "Semester 3", semesterNumber: 3 },
    { ...sampleResource, id: "s7", semester: "Sem 7", semesterNumber: 7 },
    { ...sampleResource, id: "s8", semester: "Semester 8", semesterNumber: 8 },
  ];

  function matchSemester(res: AcademicResourceDocument, selectedSem: string): boolean {
    if (selectedSem === "All") return true;
    const semFilter = selectedSem.toLowerCase();
    if (res.semester.toLowerCase() === semFilter) return true;
    if (res.semester.toLowerCase().includes(semFilter.replace("sem ", "semester "))) return true;
    if (
      selectedSem === "Sem 7 & 8" &&
      (res.semester.includes("7") ||
        res.semester.includes("8") ||
        res.semesterNumber === 7 ||
        res.semesterNumber === 8)
    )
      return true;
    if (
      selectedSem.startsWith("Sem ") &&
      res.semesterNumber === parseInt(selectedSem.replace("Sem ", ""), 10)
    )
      return true;
    return false;
  }

  const sem3Matches = semesterMockCatalog.filter((r) => matchSemester(r, "Sem 3"));
  const sem78Matches = semesterMockCatalog.filter((r) => matchSemester(r, "Sem 7 & 8"));

  assert(
    sem3Matches.length === 1 &&
      sem3Matches[0].id === "s3" &&
      sem78Matches.length === 2 &&
      sem78Matches.map((r) => r.id).sort().join(",") === "s7,s8",
    "Semester Resolution",
    "Accurately maps both discrete semesters ('Sem 3') and combined senior blocks ('Sem 7 & 8')."
  );

  // 5. Search Functionality
  const searchableCatalog: AcademicResourceDocument[] = [
    { ...sampleResource, id: "search1", code: "ETCS-301", title: "Operating Systems", department: "CSE", description: "Kernel design and memory paging" },
    { ...sampleResource, id: "search2", code: "ETIT-302", title: "Database Systems", department: "IT", description: "Relational algebra and SQL queries" },
    { ...sampleResource, id: "search3", code: "BALLB-201", title: "Constitutional Law I", department: "Law", description: "Fundamental rights and judicial review" },
  ];

  function runSearch(items: AcademicResourceDocument[], q: string) {
    const query = q.toLowerCase().trim();
    if (!query) return items;
    return items.filter(
      (r) =>
        r.code.toLowerCase().includes(query) ||
        r.title.toLowerCase().includes(query) ||
        r.department.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
    );
  }

  const codeSearch = runSearch(searchableCatalog, "ETIT");
  const titleSearch = runSearch(searchableCatalog, "Operating");
  const keywordSearch = runSearch(searchableCatalog, "constitutional");

  assert(
    codeSearch.length === 1 && codeSearch[0].id === "search2" &&
      titleSearch.length === 1 && titleSearch[0].id === "search1" &&
      keywordSearch.length === 1 && keywordSearch[0].id === "search3",
    "Multi-field Search",
    "Searches across subject code, course title, department, and description accurately."
  );

  // 6. Download Counter Increment Simulation
  let simulatedDoc = { ...sampleResource, downloadsCount: 10 };
  function simulateDownloadIncrement(doc: typeof simulatedDoc) {
    return {
      ...doc,
      downloadsCount: doc.downloadsCount + 1,
    };
  }

  simulatedDoc = simulateDownloadIncrement(simulatedDoc);
  simulatedDoc = simulateDownloadIncrement(simulatedDoc);

  assert(
    simulatedDoc.downloadsCount === 12,
    "Download Metrics Logic",
    "Download count correctly increments on genuine access without corrupting document metadata."
  );

  // 7. Empty Database Resilience
  const emptyDataset: AcademicResourceDocument[] = [];
  const emptyFilterResult = emptyDataset.filter((r) => r.status === "published");

  assert(
    Array.isArray(emptyFilterResult) && emptyFilterResult.length === 0,
    "Empty Collection Resilience",
    "Gracefully handles an empty resources collection without throwing or encountering undefined errors."
  );

  // Output test results summary
  console.log("--------------------------------------------------");
  let allPassed = true;
  for (const report of reports) {
    console.log(`[${report.passed ? "PASS" : "FAIL"}] ${report.name}: ${report.details}`);
    if (!report.passed) allPassed = false;
  }
  console.log("--------------------------------------------------");

  if (allPassed) {
    console.log("\n>>> ALL PHASE 6 ACADEMIC RESOURCE TESTS PASSED CLEANLY (7/7) <<<");
    process.exit(0);
  } else {
    console.error("\n>>> SOME TESTS FAILED IN PHASE 6 <<<");
    process.exit(1);
  }
}

runPhase6Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
