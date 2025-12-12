export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      jurusan: {
        Row: {
          id: string
          nama_jurusan: string
          icon: string
          deskripsi: string
          created_at: string
        }
        Insert: {
          id?: string
          nama_jurusan: string
          icon: string
          deskripsi?: string
          created_at?: string
        }
        Update: {
          id?: string
          nama_jurusan?: string
          icon?: string
          deskripsi?: string
          created_at?: string
        }
      }
      level_skill: {
        Row: {
          id: string
          nama_level: string
          urutan: number
          min_skor: number
          max_skor: number
          badge_color: string
          badge_name: string
          hasil_belajar: string
          soft_skill: string
          created_at: string
        }
        Insert: {
          id?: string
          nama_level: string
          urutan: number
          min_skor: number
          max_skor: number
          badge_color: string
          badge_name: string
          hasil_belajar?: string
          soft_skill?: string
          created_at?: string
        }
        Update: {
          id?: string
          nama_level?: string
          urutan?: number
          min_skor?: number
          max_skor?: number
          badge_color?: string
          badge_name?: string
          hasil_belajar?: string
          soft_skill?: string
          created_at?: string
        }
      }
      siswa: {
        Row: {
          id: string
          nama: string
          kelas: string
          jurusan_id: string
          created_at: string
        }
        Insert: {
          id?: string
          nama: string
          kelas: string
          jurusan_id: string
          created_at?: string
        }
        Update: {
          id?: string
          nama?: string
          kelas?: string
          jurusan_id?: string
          created_at?: string
        }
      }
      skill_siswa: {
        Row: {
          id: string
          siswa_id: string
          level_id: string
          skor: number
          tanggal_pencapaian: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          siswa_id: string
          level_id: string
          skor: number
          tanggal_pencapaian?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          siswa_id?: string
          level_id?: string
          skor?: number
          tanggal_pencapaian?: string
          created_at?: string
          updated_at?: string
        }
      }
      level_skill_jurusan: {
        Row: {
          id: string
          jurusan_id: string
          level_id: string
          hasil_belajar: string
          soft_skill: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          jurusan_id: string
          level_id: string
          hasil_belajar?: string
          soft_skill?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          jurusan_id?: string
          level_id?: string
          hasil_belajar?: string
          soft_skill?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
