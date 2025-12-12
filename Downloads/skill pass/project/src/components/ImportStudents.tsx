import { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
// no runtime types needed here
import mockData from '../mocks/mockData';
import { supabase } from '../lib/supabase';

interface ParsedRow { nama: string; kelas?: string; skor?: number }

interface ImportStudentsProps {
  jurusanId: string;
  onClose: () => void;
  onImported: () => void; // parent should refresh
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  // detect header
  const first = lines[0];
  const hasHeader = /nama|kelas|skor/i.test(first);
  const rows = (hasHeader ? lines.slice(1) : lines).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    // flexible parsing: 1 column -> nama, 2 columns -> nama,kelas, 3 -> nama,kelas,skor
    const nama = cols[0] ?? '';
    const kelas = cols[1] ?? undefined;
    const skor = cols[2] ? Number(cols[2]) : undefined;
    return { nama, kelas, skor } as ParsedRow;
  }).filter(r => r.nama);

  return rows;
}

export function ImportStudents({ jurusanId, onClose, onImported }: ImportStudentsProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setPreview([]);
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    const parsed = parseCSV(text);
    setPreview(parsed);
  }

  async function handlePaste(text: string) {
    setError(null);
    setPreview(parseCSV(text));
  }

  async function doImport() {
    if (preview.length === 0) {
      setError('Tidak ada data untuk di-import');
      return;
    }

    setError(null);
    setLoading(true);
    const useMock = import.meta.env.VITE_USE_MOCK === 'true';

    try {
      if (useMock) {
        // push into mockData.mockSiswa
        const now = new Date().toISOString();
        for (const row of preview) {
          const id = `s-${jurusanId}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
          mockData.mockSiswa.push({ id, nama: row.nama, kelas: row.kelas ?? 'X', jurusan_id: jurusanId, created_at: now });
          // optional: create a skill record if skor provided
          if (typeof row.skor === 'number') {
            // narrow skor to a number and compute a level id safely
            const skor = row.skor;
            const levelId = mockData.mockLevels.find((l) => skor >= l.min_skor && skor <= l.max_skor)?.id ?? mockData.mockLevels[0].id;
            mockData.mockSkillSiswa.push({ id: `ss-${id}`, siswa_id: id, level_id: levelId, skor, tanggal_pencapaian: now, created_at: now, updated_at: now });
          }
        }
      } else {
        // Insert siswa rows into supabase
        const rows = preview.map((r) => ({ nama: r.nama, kelas: r.kelas ?? 'X', jurusan_id: jurusanId }));
        const { error: insertErr } = await supabase.from('siswa').insert(rows);
        if (insertErr) throw insertErr;

        // If rows included skor, attempt to insert skill_siswa records for those names
        // only keep rows that actually include a numeric skor
        const withSkor = preview.filter((p) => typeof p.skor === 'number');
        if (withSkor.length) {
          // fetch the inserted siswa IDs by name+jurusan (best-effort)
          for (const p of withSkor) {
            const { data: sdata, error: sErr } = await supabase.from('siswa').select('id').eq('nama', p.nama).eq('jurusan_id', jurusanId).limit(1);
            if (sErr || !sdata || sdata.length === 0) continue;
            // figure out level id
            const { data: levels } = await supabase.from('level_skill').select('*');
            // p.skor is guaranteed present here but let's make a local const to convince the typechecker
            const skor = p.skor as number;
            const level = levels?.find((l: any) => skor >= l.min_skor && skor <= l.max_skor);
            const levelId = level?.id;
            await supabase.from('skill_siswa').insert({ siswa_id: sdata[0].id, level_id: levelId, skor: p.skor });
          }
        }
      }

      onImported();
      onClose();
    } catch (err: any) {
      console.error('Import error', err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="card-glass w-full max-w-2xl rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">Import Siswa — CSV (nama,kelas,skor)</h3>
          <button onClick={onClose} className="p-2 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"><X /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="inline-flex items-center px-3 py-2 border rounded-lg bg-transparent cursor-pointer">
              <UploadCloud className="w-4 h-4 mr-2" />
              <span className="text-sm">Pilih file CSV</span>
              <input type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-[color:var(--text-muted)]">Atau tempel CSV di sini (baris: nama,kelas,skor)</label>
            <textarea rows={4} onChange={(e) => handlePaste(e.target.value)} className="w-full mt-1 p-2 border rounded text-[color:var(--text-primary)] bg-transparent" placeholder={`Contoh:\nNama Siswa,Kelas,Skor\nBudi, X TKR 1, 78`} />
          </div>

          {preview.length > 0 && (
            <div className="border rounded p-3 bg-transparent">
              <div className="text-sm text-[color:var(--text-muted)] font-medium mb-2">Preview ({preview.length})</div>
              <div className="overflow-x-auto max-h-56">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-[color:var(--text-muted)]"><th>Nama</th><th>Kelas</th><th>Skor</th></tr></thead>
                  <tbody>
                    {preview.map((r, i) => (
                      <tr key={i} className="border-t"><td className="py-1 text-[color:var(--text-primary)]">{r.nama}</td><td className="text-[color:var(--text-muted)]">{r.kelas ?? '-'}</td><td className="text-[color:var(--text-muted)]">{r.skor ?? '-'}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded text-[color:var(--text-muted)]">Batal</button>
            <button disabled={loading || preview.length === 0} onClick={doImport} className="px-4 py-2 bg-[color:var(--accent-1)] text-white rounded disabled:opacity-60">{loading ? 'Memproses...' : 'Import'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportStudents;
