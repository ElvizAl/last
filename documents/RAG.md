# RAG AnabulCare

Diadaptasi dari [ElvizAl/muehehe](https://github.com/ElvizAl/muehehe), commit `624f7cfb932159cfcbfde40472d90b291e48b24d`.

## Alur

`documents/dataset.json` -> satu dokumen per penyakit -> embedding -> Qdrant -> `cari_penyakit` -> agent.

Dataset berisi 21 penyakit. Ingest memvalidasi struktur dan nomor unik, mempertahankan setiap penyakit utuh, dan menyimpan metadata sumber serta halaman. ID stabil memungkinkan pengulangan ingest mengganti dokumen yang sama. Penyakit yang dihapus dari dataset tidak otomatis dihapus dari collection. Metadata menunjuk JSON lokal; halaman mengikuti dataset dan belum diverifikasi terhadap PDF asli.

## Konfigurasi

Isi environment server atau `.env` lokal. Jangan commit kredensial.

- `SUMOPOD_API_KEY`, `SUMOPOD_BASE_URL`: provider embedding.
- `QDRANT_URL`: server vector database.
- `QDRANT_API_KEY`: jika server memerlukan autentikasi.
- `QDRANT_COLLECTION`: opsional, default `anabulcare-dataset`.
- `OPENAI_API_KEY`, `OPENAI_BASE_URL`: provider model percakapan.

Embedding: `text-embedding-3-small`, 1536 dimensi, cosine. Gunakan collection terpisah dari aplikasi lain dengan model embedding dan dimensi yang sama. Model percakapan mengikuti konfigurasi awal di `src/agents/model.ts`; ketersediaannya di provider belum diuji.

## Penggunaan

```powershell
pnpm rag:ingest
pnpm rag:search "kucing bersin dan mata berair"
```

Ingest mengirim teks dataset ke provider embedding dan menyimpan vektor di Qdrant. Search mengambil lima kandidat tanpa ambang skor tetap. Skor bukan probabilitas diagnosis; periksa kecocokan isi dan halaman.

`createRagAgent()` di `src/agents/agent.ts` menyediakan agent dengan tool pencarian. Buat instance baru per percakapan. Endpoint chat, UI konsultasi, konteks profil, memory, Lens, dan evaluasi belum diintegrasikan.

## Verifikasi

TypeScript dan ESLint diperiksa. Ingest, retrieval, dan respons model langsung belum diuji karena konfigurasi environment belum tersedia. Dataset merupakan referensi mentah; validasi struktur tidak membuktikan kebenaran medis. Prompt membatasi jawaban pada bukti retrieval dan melarang instruksi obat/dosis; kepatuhan model tetap perlu dievaluasi.
