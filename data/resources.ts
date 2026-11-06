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
  fileUrl?: string;
}

/**
 * Knowledge Commons Repository
 * Left empty until faculty or administrators upload genuine course materials.
 */
export const initialResourcesData: AcademicResource[] = [];

export function getResources(): AcademicResource[] {
  return initialResourcesData;
}

export function savePublishedResource(res: AcademicResource): void {
  initialResourcesData.unshift(res);
}
