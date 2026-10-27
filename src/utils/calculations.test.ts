import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAttendance, calculateScoreFromData, sanitizeScore } from './calculations';

test('calculateAttendance calculates counts and percentage accurately', () => {
  const attendance = {
    '2026-10-01': { 'std-1': 'Hadir', 'std-2': 'Sakit' },
    '2026-10-02': { 'std-1': 'Hadir', 'std-2': 'Izin' },
    '2026-10-03': { 'std-1': 'Izin', 'std-2': 'Alpa' },
    '2026-10-04': { 'std-1': 'Hadir', 'std-2': 'Hadir' }
  };

  const stat1 = calculateAttendance('std-1', attendance);
  assert.equal(stat1.had, 3);
  assert.equal(stat1.iz, 1);
  assert.equal(stat1.sak, 0);
  assert.equal(stat1.alp, 0);
  assert.equal(stat1.total, 4);
  assert.equal(stat1.percentage, 75); // 3/4 = 75%

  const stat2 = calculateAttendance('std-2', attendance);
  assert.equal(stat2.had, 1);
  assert.equal(stat2.sak, 1);
  assert.equal(stat2.iz, 1);
  assert.equal(stat2.alp, 1);
  assert.equal(stat2.total, 4);
  assert.equal(stat2.percentage, 25); // 1/4 = 25%
});

test('calculateAttendance handles empty days safely', () => {
  const stat = calculateAttendance('std-none', {});
  assert.equal(stat.total, 0);
  assert.equal(stat.percentage, 0);
});

test('calculateScoreFromData calculates composite score properly', () => {
  // Only Formatif
  assert.equal(calculateScoreFromData({ formatif: 80 }), 80);

  // Formatif + Sumatif
  // Formatif = 80, S1 = 90, S2 = 70 -> Sumatif avg = 80 -> Final = 80
  assert.equal(calculateScoreFromData({ formatif: 80, s1: 90, s2: 70 }), 80);

  // Direct number
  assert.equal(calculateScoreFromData(85), 85);

  // Empty data
  assert.equal(calculateScoreFromData({}), null);
  assert.equal(calculateScoreFromData(null), null);
});

test('sanitizeScore handles clamping and validation', () => {
  assert.equal(sanitizeScore('95'), 95);
  assert.equal(sanitizeScore(105), 100);
  assert.equal(sanitizeScore(-10), 0);
  assert.equal(sanitizeScore('abc'), '');
  assert.equal(sanitizeScore(''), '');
});
