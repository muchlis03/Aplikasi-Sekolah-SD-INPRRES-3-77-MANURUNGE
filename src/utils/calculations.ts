/**
 * Pure calculation utilities for Attendance and Grading
 */

export interface AttendanceRecord {
  had: number;
  sak: number;
  iz: number;
  alp: number;
  total: number;
  percentage: number;
}

export function calculateAttendance(
  studentId: string,
  attendance: Record<string, Record<string, string>>
): AttendanceRecord {
  let had = 0;
  let sak = 0;
  let iz = 0;
  let alp = 0;

  if (attendance && typeof attendance === 'object') {
    Object.values(attendance).forEach((day) => {
      if (day && typeof day === 'object') {
        const status = day[studentId];
        if (status === 'Hadir') had++;
        else if (status === 'Sakit') sak++;
        else if (status === 'Izin') iz++;
        else if (status === 'Alpa') alp++;
      }
    });
  }

  const total = had + sak + iz + alp;
  const percentage = total > 0 ? Math.round((had / total) * 100) : 0;

  return { had, sak, iz, alp, total, percentage };
}

export function calculateScoreFromData(gradeData: any): number | null {
  if (typeof gradeData === 'number') {
    return gradeData;
  }
  if (!gradeData || typeof gradeData !== 'object') {
    return null;
  }

  const f = gradeData.formatif;
  let sumatifTotal = 0;
  let sumatifCount = 0;

  for (let i = 1; i <= 5; i++) {
    const val = gradeData[`s${i}`];
    if (val !== '' && val !== undefined && val !== null && !isNaN(Number(val))) {
      sumatifTotal += Number(val);
      sumatifCount++;
    }
  }

  const s = sumatifCount > 0 ? sumatifTotal / sumatifCount : undefined;
  const hasFormatif = f !== '' && f !== undefined && f !== null && !isNaN(Number(f));

  if (hasFormatif && s !== undefined) {
    return Math.round((Number(f) + s) / 2);
  } else if (hasFormatif) {
    return Number(f);
  } else if (s !== undefined) {
    return Math.round(s);
  }

  return null;
}

export function sanitizeScore(value: string | number): number | '' {
  if (value === '' || value === undefined || value === null) {
    return '';
  }
  const parsed = parseInt(String(value), 10);
  if (isNaN(parsed)) return '';
  if (parsed > 100) return 100;
  if (parsed < 0) return 0;
  return parsed;
}
