import mockData, { getTopStudentForJurusan, getStudentListForJurusan } from '../src/mocks/mockData';

async function main() {
  console.log('--- Mock data smoke test ---');

  const jurusan = 'j1';

  const initialList = getStudentListForJurusan(jurusan);
  console.log('Initial student count for', jurusan, ':', initialList.length);
  console.log('Initial top:', getTopStudentForJurusan(jurusan));

  const now = new Date().toISOString();
  const newId = `s-${jurusan}-test-${Date.now()}`;

  // Simulate CSV import: add a new student + skill
  mockData.mockSiswa.push({ id: newId, nama: 'Automated Test Student', kelas: 'X TKR 1', jurusan_id: jurusan, created_at: now });
  mockData.mockSkillSiswa.push({ id: `ss-${newId}`, siswa_id: newId, level_id: mockData.mockLevels[3].id, skor: 100, tanggal_pencapaian: now, created_at: now, updated_at: now });

  const afterList = getStudentListForJurusan(jurusan);
  console.log('After import student count for', jurusan, ':', afterList.length);
  console.log('Top after import (single):', getTopStudentForJurusan(jurusan));
  console.log('Top 3 after import:', mockData.getTopStudentsForJurusan(jurusan, 3));

  // Simulate inline edit: change the score for the same student to 55
  const skillIdx = mockData.mockSkillSiswa.findIndex((r) => r.siswa_id === newId);
  if (skillIdx >= 0) {
    mockData.mockSkillSiswa[skillIdx].skor = 55;
    mockData.mockSkillSiswa[skillIdx].updated_at = new Date().toISOString();
  }

  console.log('After edit - top:', getTopStudentForJurusan(jurusan));

  // Test per-jurusan level override (hasil_belajar)
  console.log('\n-- Testing per-jurusan level overrides --');
  const beforeLevels = mockData.getLevelsForJurusan(jurusan);
  console.log('Before override for master:', beforeLevels.find(l => l.id === 'lvl-master')?.hasil_belajar);

  // simulate updating hasil_belajar
  const newText = 'Keterampilan mekanik tingkat lanjut - perjurusan test';
  const ovIdx = mockData.mockLevelOverrides.findIndex(o => o.jurusan_id === jurusan && o.level_id === 'lvl-master');
  if (ovIdx >= 0) mockData.mockLevelOverrides[ovIdx].hasil_belajar = newText;
  else mockData.mockLevelOverrides.push({ jurusan_id: jurusan, level_id: 'lvl-master', hasil_belajar: newText });

  const afterLevels = mockData.getLevelsForJurusan(jurusan);
  console.log('After override for master:', afterLevels.find(l => l.id === 'lvl-master')?.hasil_belajar);

  console.log('--- Done ---');
}

main().catch((e) => { console.error(e); process.exit(1); });
