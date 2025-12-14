# Panduan Deploy Backend ke Netlify Functions

Backend aplikasi telah diubah menjadi **Serverless** agar bisa berjalan di Netlify Functions (gratis).

## Langkah 1: Push ke GitHub

Pastikan kode terbaru sudah di-push:

```bash
git add .
git commit -m "Convert backend to Netlify Functions"
git push
```

## Langkah 2: Konfigurasi Environment Variables di Netlify

1. Buka [app.netlify.com](https://app.netlify.com)
2. Pilih site **gudang-mitra-app**
3. Masuk ke **Site configuration** > **Environment variables**
4. Tambahkan variables berikut (sama seperti di Railway/Aiven):

| Key | Value |
|-----|-------|
| `DB_HOST` | `mitragudang-nugrohodc06-6b74.l.aivencloud.com` |
| `DB_PORT` | `19278` |
| `DB_USER` | `avnadmin` |
| `DB_PASSWORD` | (Lihat di Dashboard Aiven) |
| `DB_NAME` | `defaultdb` |
| `DB_SSL` | `true` |
| `NODE_ENV` | `production` |
| `OPENAI_API_KEY` | (API Key OpenAI Anda jika ada) |

> **Note**: `PORT` tidak perlu diset di Netlify. `VITE_API_URL` akan otomatis menggunakan `/api`.

## Langkah 3: Redeploy

1. Masuk ke tab **Deploys**
2. Klik **Trigger deploy** > **Deploy site**
3. Tunggu sampai selesai.

## Langkah 4: Test

Buka aplikasi dan coba login. Request API akan otomatis diarahkan ke Netlify Functions.
