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

`createRagAgent(userId, catId, prompt)` di `src/agents/agent.ts` menyediakan agent dengan tool pencarian. Buat instance baru per percakapan. Prisma memory sudah terpasang dengan `savePolicy: 'turn'`. Endpoint chat sudah tersedia. UI konsultasi, konteks profil, Lens, dan evaluasi belum diintegrasikan.

## Verifikasi

TypeScript dan ESLint diperiksa. Ingest, retrieval, dan respons model langsung belum diuji karena konfigurasi environment belum tersedia. Dataset merupakan referensi mentah; validasi struktur tidak membuktikan kebenaran medis. Prompt membatasi jawaban pada bukti retrieval dan melarang instruksi obat/dosis; kepatuhan model tetap perlu dievaluasi.

## Prisma memory

`memoryStore` diekspor dari `src/agents/agent.ts` memakai Prisma client aplikasi.
Empat model mengikuti scaffold paket `@anvia/memory-prisma` 1.4.0:
`AgentMemorySession`, `AgentMemoryMessage`, `AgentMemoryError`, dan
`AgentMemoryWrite`. Migrasi `20261108000000_add_agent_memory` sudah diterapkan.

Saat menjalankan agent, wajib teruskan scope dari server:

```ts
const agent = createRagAgent(userId, catId, prompt)
const result = await agent.generate({
  prompt,
  session: { sessionId, userId: session.user.id },
})
```

`session.user.id` harus berasal dari autentikasi server, bukan body request.
Pakai `sessionId` sama untuk melanjutkan percakapan, ID baru untuk percakapan
baru. Scope mencakup pengguna; ID percakapan sama milik pengguna berbeda tidak
berbagi pesan. Jika nanti menambahkan daftar/baca riwayat, autentikasi pengguna
dan periksa kepemilikan di server. Riwayat konsultasi terstruktur berbeda dari
memory percakapan dan belum dibuat.

Uji langsung database berhasil: tulis pesan, tutup koneksi, baca memakai client
baru, cegah penulisan duplikat, dan pastikan pengguna lain tidak menerima pesan.
Data uji dibersihkan. Alur agent/model dan UI chat belum diuji menyeluruh.

## Endpoint chat

`POST /api/chat` memakai cookie login Better Auth. Request mengikuti protokol
Anvia Client dengan body berikut:

```json
{
  "type": "messages",
  "messages": [
    {
      "role": "user",
      "content": "Kucingku bersin dan matanya berair",
      "metadata": {
        "sessionId": "00000000-0000-4000-8000-000000000000",
        "catId": "id-kucing-yang-dipilih"
      }
    }
  ]
}
```

Buat UUID baru untuk percakapan baru; gunakan UUID sama untuk melanjutkan.
Identitas pengguna berasal dari session server. Endpoint hanya memakai pesan
pengguna terakhir; riwayat dibaca oleh agent dari Prisma memory, sehingga
riwayat kiriman client tidak dipercaya sebagai konteks. Respons memakai
stream JSONL Anvia, bukan satu objek JSON biasa. Batalkan fetch untuk
meneruskan sinyal pembatalan ke agent.

Status error: 401 belum login, 403 origin berbeda, 400 pesan/UUID tidak valid,
413 body melebihi 64.000 byte, dan 500 gagal menyiapkan layanan. Pesan dibatasi
4.000 karakter dan hanya teks; respons interaksi dan lampiran belum didukung.
Error model selama streaming dikirim melalui protokol dengan pesan umum.

Verifikasi endpoint: tes validasi input, TypeScript, ESLint, dan build lolos.
HTTP langsung terhadap build mengembalikan 401 tanpa login. Streaming model
dengan cookie login belum diuji langsung.

```powershell
node --experimental-strip-types --test src/modules/chat/chat-request.test.mjs
```

Alur HTTP ditulis langsung dalam handler POST di `src/routes/api/chat.ts`: cek login, validasi input, jalankan agent, lalu kirim stream. `chat-request.ts` hanya memvalidasi format pesan.

## Percakapan per kucing

Pilih kucing pada halaman `/chat` sebelum mengirim pesan pertama. Dropdown
terkunci selama percakapan; untuk ganti kucing, pilih Chat baru. Profil yang
belum ada dapat ditambahkan lewat tautan Kelola/Tambah kucing.

Server memeriksa kepemilikan `catId`, mengambil profil terbaru dari database,
dan menyimpannya sebagai relasi `ChatConversation` dengan unique
`[userId, sessionId]`. Upsert tidak mengganti `catId` yang sudah terikat;
permintaan untuk ganti kucing mendapat 409. Kucing milik orang lain mendapat 404. Profil kiriman client diabaikan. Agent menerima nama, tanggal lahir,
jenis kelamin, ras, vaksin, dan riwayat kesehatan sebagai data, bukan instruksi.

Memory tetap memakai scope pengguna dan percakapan. Riwayat lama tanpa relasi
kucing hanya dapat dibaca, agar tidak tercampur saat memilih kucing baru.
Jika profil dihapus, relasinya menjadi null, riwayat tetap ada dan tidak dapat
dilanjutkan untuk kucing lain. Migrasi `20261108010000_chat_cat_profile`
sudah diterapkan. Penghapusan pengguna menghapus relasi percakapannya.

Verifikasi relasi kucing: empat tes input, TypeScript, ESLint, dan build lolos. Uji HTTP dengan akun sementara membuktikan penolakan kucing bukan milik pengguna (404), pergantian kucing (409), penggunaan kembali memory lama tanpa kaitan kucing (409), dan percakapan yang profilnya sudah dihapus (409). Data uji dibersihkan. Kesesuaian jawaban model terhadap profil dan tampilan pilihan kucing di browser belum diuji langsung.

Profil sekarang dibaca melalui tool `get_cat_profile` di `src/agents/tools/get-cat-profile.ts`. Factory agent menerima ID pengguna dari autentikasi dan ID kucing yang sudah diperiksa server. Model tidak menerima argumen untuk memilih pengguna atau kucing lain. Endpoint hanya memeriksa kepemilikan dan relasi percakapan; isi profil diambil tool saat dipanggil.

## Tool konsultasi

- `ask_followup`: satu atau dua pertanyaan ditampilkan sebagai kartu di chat.
  Pengguna menjawab melalui pesan biasa berikutnya. Tool tidak memakai protokol
  interaction/resume Anvia, tidak memblokir proses server menunggu manusia,
  dan tidak mengarang jawaban. Prompt meminta agent berhenti setelah bertanya.
- `assess_urgency`: checklist 20 contoh kondisi darurat dari
  [Cornell Emergency and Critical Care](https://www.vet.cornell.edu/hospitals/services/emergency-and-critical-care-0),
  diakses 8 November 2026. Input reported/denied memerlukan kutipan persis yang
  ada dalam pesan terbaru dari server. Informasi tak disebut menjadi unknown.
  Ada tanda terlapor: arahkan segera ke dokter hewan. Hasil kosong tidak
  membuktikan aman. Makna tanda tetap hasil interpretasi model, bukan
  pemeriksaan klinis. Tidak ada batas waktu atau skor diagnosis tambahan.
- `grade_evidence`: periksa ID dokumen, sumber, halaman pada metadata, dan
  kutipan dalam teks record hasil pencarian aktual di request yang sama.
  Registry bukti dibuat per instance agent, bukan state global atau argumen
  teks referensi dari model. Pada pesan baru, cari ulang referensi yang hendak
  dikutip. Verifikasi halaman sebatas metadata; bukan pemeriksaan posisi teks
  pada PDF asli, kebenaran medis, atau ketepatan diagnosis.

Tool profil dan pencarian tetap tersedia. Nilai minScore pencarian yang sudah
ada tidak diubah. Tidak ada perubahan schema database untuk tiga tool ini.

```powershell
node --experimental-strip-types --test src/agents/tools/consultation-tools.test.mjs
```

Pengujian ini memeriksa perilaku tool tanpa provider LLM atau Qdrant langsung.
Kepatuhan agent terhadap urutan tool masih perlu diuji dengan model aktual.
