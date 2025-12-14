# Panduan Deploy Backend ke Render.com

## Langkah 1: Push ke GitHub

Pertama, pastikan semua perubahan sudah di-push ke GitHub repository Anda.

## Langkah 2: Buat Akun Render

1. Buka [render.com](https://render.com)
2. Klik **Get Started for Free**
3. Sign up dengan **GitHub** (lebih mudah untuk deploy)

## Langkah 3: Create New Web Service

1. Di dashboard, klik **New +** → **Web Service**
2. Pilih **Build and deploy from a Git repository**
3. Connect repository GitHub **mitragudang**
4. Konfigurasi:

| Setting | Value |
|---------|-------|
| **Name** | `mitragudang-api` |
| **Region** | Singapore (Southeast Asia) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

## Langkah 4: Set Environment Variables

Klik **Advanced** → **Add Environment Variable**:

| Key | Value |
|-----|-------|
| `DB_HOST` | `mitragudang-nugrohodc06-6b74.l.aivencloud.com` |
| `DB_PORT` | `19278` |
| `DB_USER` | `avnadmin` |
| `DB_PASSWORD` | (Lihat di Dashboard Aiven) |
| `DB_NAME` | `defaultdb` |
| `DB_SSL` | `true` |
| `PORT` | `3002` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://gudang-mitra-app.netlify.app` |

## Langkah 5: Deploy

1. Klik **Create Web Service**
2. Tunggu build selesai (~2-5 menit)
3. Setelah deploy berhasil, Anda akan dapat URL seperti:
   `https://mitragudang-api.onrender.com`

## Langkah 6: Update Frontend

Setelah dapat URL dari Render, update file `.env.production` di root project:

```
VITE_API_URL=https://mitragudang-api.onrender.com/api
```

Kemudian redeploy frontend di Netlify.
