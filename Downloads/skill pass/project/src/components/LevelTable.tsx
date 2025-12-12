import { useState } from 'react';
import type { LevelSkill } from '../types';
import { Badge } from './Badge';

function LevelHasilCell({
  level,
  allowEdit,
  onUpdate,
}: {
  level: LevelSkill;
  allowEdit: boolean;
  onUpdate?: (levelId: string, newHasil: string) => Promise<void> | void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(level.hasil_belajar || '');
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!onUpdate) return;
    try {
      setLoading(true);
      await onUpdate(level.id, value);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update hasil_belajar', err);
    } finally {
      setLoading(false);
    }
  }

  return allowEdit ? (
    <div className="max-w-md">
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={3} className="w-full p-2 border rounded text-gray-900" />
          <div className="flex justify-end gap-2">
            <button className="px-3 py-1 border border-white/30 rounded text-white" onClick={() => { setEditing(false); setValue(level.hasil_belajar || ''); }} disabled={loading}>Batal</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={save} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm text-white max-w-md whitespace-pre-wrap">{level.hasil_belajar}</div>
          <button className="px-2 py-1 text-sm text-white border border-white/30 rounded hover:bg-white/10" onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  ) : (
    <div className="text-sm text-white max-w-md whitespace-pre-wrap">{level.hasil_belajar}</div>
  );
}

interface LevelTableProps {
  levels: LevelSkill[];
  jurusanId?: string; // optional - used when editing per-jurusan descriptions
  onUpdateHasil?: (levelId: string, newHasil: string) => Promise<void> | void;
  isTeacher?: boolean; // role-based access control
}

export function LevelTable({ levels, jurusanId, onUpdateHasil, isTeacher = false }: LevelTableProps) {
  return (
    <div className="card-glass rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-xl font-semibold text-white">Level Skill & Badge System</h2>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden p-4 space-y-3">
        {levels.map((level) => (
          <div key={level.id} className="card-glass rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: level.badge_color }}>
                <div className="text-xs font-bold text-black">{level.badge_name.charAt(0)}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm text-[color:var(--text-primary)] truncate">{level.nama_level}</div>
                  <div className="text-xs text-[color:var(--text-muted)]">{level.min_skor} - {level.max_skor}</div>
                </div>
                <div className="text-sm text-[color:var(--text-muted)] mt-2 whitespace-pre-wrap">{level.hasil_belajar}</div>
                <div className="text-xs text-[color:var(--text-muted)] mt-2">Soft skills: {level.soft_skill}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[color:var(--text-primary)] uppercase tracking-wider">
                Badge
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[color:var(--text-primary)] uppercase tracking-wider">
                Skor Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[color:var(--text-primary)] uppercase tracking-wider">
                Hasil Belajar
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[color:var(--text-primary)] uppercase tracking-wider">
                Soft Skills
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {levels.map((level) => (
              <tr key={level.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[color:var(--text-primary)]">{level.nama_level}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge name={level.badge_name} color={level.badge_color} size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[color:var(--text-primary)] font-medium">
                    {level.min_skor} - {level.max_skor}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <LevelHasilCell
                    level={level}
                    allowEdit={isTeacher && !!jurusanId && !!onUpdateHasil}
                    onUpdate={onUpdateHasil}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[color:var(--text-muted)] max-w-md">{level.soft_skill}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
