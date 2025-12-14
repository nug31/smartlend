export interface User {
    id: string;
    username: string;
    password: string;
    name: string;
    role: 'student' | 'teacher';
    jurusan_id?: string;
}

// Mock users for authentication
export const mockUsers: User[] = [
    // Student accounts (one per jurusan)
    { id: 'u-s1', username: 'siswa_mesin', password: '123', name: 'Siswa Mesin', role: 'student', jurusan_id: 'j1' },
    { id: 'u-s2', username: 'siswa_tkr', password: '123', name: 'Siswa TKR', role: 'student', jurusan_id: 'j2' },
    { id: 'u-s3', username: 'siswa_tsm', password: '123', name: 'Siswa TSM', role: 'student', jurusan_id: 'j3' },
    { id: 'u-s4', username: 'siswa_elind', password: '123', name: 'Siswa Elind', role: 'student', jurusan_id: 'j4' },
    { id: 'u-s5', username: 'siswa_listrik', password: '123', name: 'Siswa Listrik', role: 'student', jurusan_id: 'j5' },
    { id: 'u-s6', username: 'siswa_kimia', password: '123', name: 'Siswa Kimia', role: 'student', jurusan_id: 'j6' },
    { id: 'u-s7', username: 'siswa_akuntansi', password: '123', name: 'Siswa Akuntansi', role: 'student', jurusan_id: 'j7' },
    { id: 'u-s8', username: 'siswa_hotel', password: '123', name: 'Siswa Perhotelan', role: 'student', jurusan_id: 'j8' },

    // Teacher account
    {
        id: 'u-guru',
        username: 'guru',
        password: '123',
        name: 'Guru',
        role: 'teacher',
    },
];

export function authenticateUser(username: string, password: string): User | null {
    const user = mockUsers.find(
        (u) => u.username === username && u.password === password
    );
    return user || null;
}
