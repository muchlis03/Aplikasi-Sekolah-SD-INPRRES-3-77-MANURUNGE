export interface CustomField {
  label: string;
  value: string;
}

export interface SchoolInfo {
  name: string;
  npsn: string;
  level: string;
  address: string;
  phone: string;
  principal: string;
  principalNip: string;
  principalTitle: string;
  headmaster: string;
  headmasterNip: string;
  academicYear: string;
  semester: string;
  teacherPhoto: string;
  schoolLogo: string;
  customFields: CustomField[];
}

export interface Student {
  id: string;
  name: string;
  class: string;
  nis: string;
  gender: string;
}

export interface AssessmentData {
  diagnostik?: number | string;
  formatif?: number | string;
  s1?: number | string;
  s2?: number | string;
  s3?: number | string;
  s4?: number | string;
  s5?: number | string;
  tp?: string;
  bukti?: string;
  deskripsi?: string;
  tindakLanjut?: string;
}

export type AttendanceMap = Record<string, Record<string, string>>; // date -> studentId -> status
export type GradeMap = Record<string, Record<string, AssessmentData | number>>; // class-subject -> studentId -> AssessmentData
