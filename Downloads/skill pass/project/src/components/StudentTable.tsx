import { useMemo, useState } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Download } from 'lucide-react';
import type { StudentListItem } from '../types';
import formatClassLabel from '../lib/formatJurusan';
import { Badge } from './Badge';

interface StudentTableProps {
  students: StudentListItem[];
  onExportExcel: () => void;
  onExportPDF: () => void;
  onEditScore?: (siswaId: string, newSkor: number) => Promise<void> | void;
  topRanks?: Record<string, number>;
  onSelectStudent?: (student: StudentListItem) => void;
  jurusanName?: string;
}

type SortField = 'nama' | 'kelas' | 'skor';
type SortOrder = 'asc' | 'desc';

export function StudentTable({ students, onExportExcel, onExportPDF, onEditScore, topRanks, onSelectStudent, jurusanName }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('skor');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [minScore, setMinScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(100);

  const handleSort = (field: SortField) => {
    if (field === sortField) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((s) => {
      const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesScore = s.skor >= minScore && s.skor <= maxScore;
      return matchesSearch && matchesScore;
    });

    filtered.sort((a, b) => {
      let av: any = a[sortField];
      let bv: any = b[sortField];
      if (typeof av === 'string' && typeof bv === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sortOrder === 'asc' ? -1 : 1;
      if (av > bv) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [students, searchTerm, sortField, sortOrder, minScore, maxScore]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-[color:var(--text-muted)]" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4 text-[color:var(--accent-1)]" /> : <ArrowDown className="w-4 h-4 text-[color:var(--accent-1)]" />;
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number | ''>('');

  const startEdit = (id: string, current: number) => { setEditingId(id); setEditValue(current); };
  const cancelEdit = () => { setEditingId(null); setEditValue(''); };

  return (
    <div className="card-glass rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">Daftar Siswa ({filteredAndSortedStudents.length})</h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
              <input
                type="text"
                value={searchTerm}
                placeholder="Cari nama siswa..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[color:var(--accent-1)] focus:border-transparent text-sm w-full sm:w-64 text-[color:var(--text-primary)] bg-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={onExportExcel} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"><Download className="w-4 h-4" />Excel</button>
              <button onClick={onExportPDF} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"><Download className="w-4 h-4" />PDF</button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[color:var(--text-muted)] font-medium whitespace-nowrap">Filter Skor:</label>
            <input type="number" min={0} max={100} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-20 px-3 py-1.5 border rounded-lg text-sm text-[color:var(--text-primary)] bg-transparent" placeholder="Min" />
            <span className="text-[color:var(--text-muted)]">-</span>
            <input type="number" min={0} max={100} value={maxScore} onChange={(e) => setMaxScore(Number(e.target.value))} className="w-20 px-3 py-1.5 border rounded-lg text-sm text-[color:var(--text-primary)] bg-transparent" placeholder="Max" />
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className="md:hidden px-4 py-4 space-y-3">
        {filteredAndSortedStudents.map((student) => (
          <div key={student.id} className="card-glass rounded-xl p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm text-[color:var(--text-primary)] truncate">{student.nama}</div>
                {topRanks?.[student.id] && (
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${topRanks[student.id] === 1 ? 'bg-yellow-400 text-black' :
                      topRanks[student.id] === 2 ? 'bg-gray-300 text-black' :
                        topRanks[student.id] === 3 ? 'bg-orange-300 text-black' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                    #{topRanks[student.id]}
                  </div>
                )}
              </div>
              <div className="text-xs text-[color:var(--text-muted)] mt-1 truncate">{formatClassLabel(jurusanName, student.kelas)} • Level {student.level_name}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="text-sm font-semibold text-[color:var(--text-primary)] w-8">{student.skor}</div>
                <div className="flex-1 bg-white/5 rounded-full h-2"><div className="bg-[color:var(--accent-1)] h-2 rounded-full" style={{ width: `${student.skor}%` }} /></div>
              </div>
            </div>

            <div className="ml-3">
              {onEditScore ? <button onClick={() => { setEditingId(student.id); setEditValue(student.skor); }} className="px-3 py-1 border rounded text-sm text-[color:var(--text-muted)]">Edit</button> : <div className="w-8 h-8" />}
            </div>
          </div>
        ))}
      </div>

      {/* desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="px-6 py-3 text-left"><button onClick={() => handleSort('nama')} className="flex items-center gap-2 text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wider hover:text-[color:var(--text-primary)]">Nama Siswa <SortIcon field="nama" /></button></th>
              <th className="px-6 py-3 text-left"><button onClick={() => handleSort('kelas')} className="flex items-center gap-2 text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wider hover:text-[color:var(--text-primary)]">Kelas <SortIcon field="kelas" /></button></th>
              <th className="px-6 py-3 text-left"><button onClick={() => handleSort('skor')} className="flex items-center gap-2 text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wider hover:text-[color:var(--text-primary)]">Skor <SortIcon field="skor" /></button></th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wider">Badge</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredAndSortedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-between">
                    <button onClick={() => onSelectStudent?.(student)} className="text-sm font-medium text-[color:var(--accent-1)] hover:underline text-left">{student.nama}</button>
                    {topRanks?.[student.id] && (
                      <div className="ml-3 flex-shrink-0">
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${topRanks[student.id] === 1 ? 'bg-yellow-400 text-black' :
                            topRanks[student.id] === 2 ? 'bg-gray-300 text-black' :
                              topRanks[student.id] === 3 ? 'bg-orange-300 text-black' :
                                'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                          #{topRanks[student.id]}
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-[color:var(--text-muted)]">{formatClassLabel(jurusanName, student.kelas)}</div></td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2"><div className="text-sm font-semibold text-[color:var(--text-primary)]">{student.skor}</div><div className="w-24 bg-white/5 rounded-full h-2"><div className="bg-[color:var(--accent-1)] h-2 rounded-full transition-all" style={{ width: `${student.skor}%` }} /></div></div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center"><Badge name={student.badge_name} color={student.badge_color} size="sm" /></td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {onEditScore ? (editingId === student.id ? (
                    <div className="flex items-center gap-2 justify-end">
                      <input type="number" min={0} max={100} value={editValue === '' ? '' : String(editValue)} onChange={(e) => setEditValue(Number(e.target.value))} className="w-20 px-2 py-1 border rounded text-sm text-[color:var(--text-primary)] bg-transparent" />
                      <button onClick={async () => { if (!editValue && editValue !== 0) return; try { await onEditScore(student.id, Number(editValue)); cancelEdit(); } catch (err) { console.error('Failed to save score', err); } }} className="px-3 py-1 bg-[color:var(--accent-1)] text-white rounded text-sm">Simpan</button>
                      <button onClick={cancelEdit} className="px-3 py-1 border rounded text-sm text-[color:var(--text-muted)]">Batal</button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(student.id, student.skor)} className="px-3 py-1 border rounded text-sm hover:bg-white/5 text-[color:var(--text-muted)]">Edit</button>
                  )) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedStudents.length === 0 && (
        <div className="text-center py-12"><p className="text-[color:var(--text-muted)]">Tidak ada data siswa yang sesuai</p></div>
      )}
    </div>
  );
}

export default StudentTable;
