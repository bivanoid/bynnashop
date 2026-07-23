# BynnaShop

BynnaShop adalah frontend toko online (single-page application) yang dibangun dengan React + TypeScript dan Vite. Aplikasi ini menggunakan Supabase sebagai library klien untuk integrasi backend dan dirancang untuk dikembangkan dan dideploy cepat ke platform hosting statis (contoh: Vercel).

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/ba4e0a0b-55c1-4062-a2c1-03f38f14e09c" />

### Stack
- Language(s): TypeScript (utama), CSS, HTML, JavaScript
- Framework / runtime: React + Vite
- Notable libraries: @supabase/supabase-js, react-router-dom, gsap, @phosphor-icons/react, vite-plugin-svgr

## How it's organized
Top-level files & direktori penting:
- index.html memuat bundle yang dihasilkan Vite dari entry src/main.tsx. Vite menyediakan dev server (HMR) dan build pipeline.
- Kode aplikasi di bawah src/ (komponen, routing, style, dan integrasi API). package.json mendefinisikan script pengembangan, build, lint, dan preview.
