# 🎨 StyleSync CLI

> AI-powered design token translator & Tailwind CSS guard for enterprise design systems.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)

**StyleSync** menjembatani bahasa natural / *shorthand* developer menjadi kelas Tailwind CSS yang patuh pada *Design System Tokens* (`stylesync.config.json`). Dilengkapi *Token Guard* & *File Linter* untuk mencegah polusi warna/spacing *arbitrary*.

---

## ✨ Features
- **Natural Language to Tailwind**: Ubah deskripsi (misal: *"primary card center content padding 32px"*) jadi kelas rapi.
- **Strict Token Guard**: Menolak / memperingatkan warna *arbitrary* (`#HEX` tak dikenal) di luar `stylesync.config.json`.
- **File Linter (`stylesync check`)**: Pindai file `.tsx`/`.jsx`/`.html` dari pelanggaran token desain.
- **Hybrid Engine**: Cerdas secara lokal (mock fallback offline) atau terhubung ke Google Gemini 2.5 Flash.

---

## 🚀 Quick Start

1. **Clone & Install Dependencies**:
   ```bash
   git clone [https://github.com/username/stylesync-cli.git](https://github.com/username/stylesync-cli.git)
   cd stylesync-cli
   npm install