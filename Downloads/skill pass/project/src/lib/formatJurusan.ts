export function letterToIndex(letter?: string): number | null {
  if (!letter) return null;
  const t = letter.trim().toUpperCase();
  if (!/^[A-Z]$/.test(t)) return null;
  return t.charCodeAt(0) - 64; // A -> 1
}

export function extractYear(kelas?: string): string | null {
  if (!kelas) return null;
  const s = kelas.toUpperCase();
  // common school year tokens: X, XI, XII, I - V (just in case)
  const m = s.match(/\b(XII|XI|X|IV|V|I{1,3})\b/);
  return m ? m[0] : null;
}

export function extractLastNumber(kelas?: string): number | null {
  if (!kelas) return null;
  const m = kelas.match(/(\d+)\s*$/);
  return m ? Number(m[1]) : null;
}

/**
 * formatClassLabel: given a jurusan name and a kelas string, return the compact display label
 * Rules (per spec):
 * - Listrik -> "{year} Listrik {index}" (try to extract year + index)
 * - Teknik Kimia -> "TKI {index}" (no year)
 * - Akuntansi -> "AK {index}"
 * - Perhotelan -> "{year} Hotel" (no index)
 * - Fallback: return the original kelas unchanged
 */
export function formatClassLabel(jurusanName?: string, kelas?: string): string {
  if (!jurusanName || !kelas) return kelas ?? '';

  const j = jurusanName.toLowerCase();
  const year = extractYear(kelas);
  const lastNum = extractLastNumber(kelas);

  // if kelas like X-A or XII-A or X-A-1, also try to extract trailing letter
  const letterMatch = (kelas.match(/[- ]([A-Z])$/i) || []).pop() || null;
  const letterIndex = letterMatch ? letterToIndex(letterMatch) : null;
  const index = lastNum ?? letterIndex;

  // Mesin
  if (j.includes('mesin')) {
    if (year && index) return `${year} MESIN ${index}`;
    if (index) return `MESIN ${index}`;
    if (year) return `${year} MESIN`;
    return `MESIN`;
  }

  // Kendaraan Ringan (TKR)
  if (j.includes('kendaraan') || j.includes('tkr')) {
    if (year && index) return `${year} TKR ${index}`;
    if (index) return `TKR ${index}`;
    if (year) return `${year} TKR`;
    return `TKR`;
  }

  // Sepeda Motor (TSM)
  if (j.includes('sepeda') || j.includes('tsm')) {
    if (year && index) return `${year} TSM ${index}`;
    if (index) return `TSM ${index}`;
    if (year) return `${year} TSM`;
    return `TSM`;
  }

  // Elektronika Industri (ELIND)
  if (j.includes('elektronika') || j.includes('elind') || j.includes('elektronika industri')) {
    if (year && index) return `${year} ELIND ${index}`;
    if (index) return `ELIND ${index}`;
    if (year) return `${year} ELIND`;
    return `ELIND`;
  }

  // Instalasi Tenaga Listrik (LISTRIK)
  if (j.includes('listrik')) {
    if (year && index) return `${year} LISTRIK ${index}`;
    if (index) return `LISTRIK ${index}`;
    if (year) return `${year} LISTRIK`;
    return `LISTRIK`;
  }

  // Kimia -> TKI
  if (j.includes('kimia')) {
    if (index) return `TKI ${index}`;
    return `TKI`;
  }

  // Akuntansi -> AK
  if (j.includes('akuntan') || j.includes('akuntansi')) {
    if (index) return `AK ${index}`;
    return `AK`;
  }

  // Perhotelan -> HOTEL
  if (j.includes('hotel') || j.includes('perhotelan')) {
    if (year && index) return `${year} HOTEL ${index}`;
    if (year) return `${year} HOTEL`;
    if (index) return `HOTEL ${index}`;
    return `HOTEL`;
  }

  // fallback: if we have both year and index, return them together; otherwise original kelas
  if (year && index) return `${year} ${index}`;
  return kelas;
}

export default formatClassLabel;
