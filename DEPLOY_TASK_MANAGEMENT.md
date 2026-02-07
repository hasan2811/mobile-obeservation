# Panduan Deployment Fitur Task Management

## 1. Update Backend (Google Apps Script)

Karena ada perubahan pada kode backend untuk mendukung update status tasks dan upload bukti foto, Anda perlu melakukan **Deploy Ulang** script backend.

1.  Buka project Google Apps Script Anda (Link ada di `code-optimized.gs` atau dashboard Apps Script).
2.  Pastikan kode di `code-optimized.gs` sudah yang terbaru (saya sudah mengupdatenya di editor, tapi pastikan tersimpan).
3.  Klik tombol **Deploy** -> **Manage Deployments**.
4.  Pilih deployment yang aktif (biasanya "Web App").
5.  Klik **Edit** (icon pensil).
6.  Pada bagian **Version**, pilih **New version**.
7.  Klik **Deploy**.
8.  **PENTING:** Salin URL Web App yang baru (jika berubah) atau pastikan URL lama masih valid. Namun biasanya URL tidak berubah jika kita update version pada deployment yang sama. Pastikan `WEB_APP_URL` di frontend (`src/App.js` baris 24) sesuai dengan URL Deployment Anda.

## 2. Update Struktur Spreadsheet (PENTING)

Fitur Task Management membutuhkan kolom tambahan di Spreadsheet untuk menyimpan riwayat aksi (Action Log). Backend `code-optimized.gs` (fungsi `updateTaskOptimized`) mengharapkan kolom berikut:

*   **Column K (Index 11):** Status (Open/Pending/Close) - *Sudah ada* -> Pastikan ini Column 11.
*   **Column L (Index 12):** Action By (Siapa yang update)
*   **Column M (Index 13):** Action Date (Kapan diupdate)
*   **Column N (Index 14):** Action Notes (Catatan tindakan)
*   **Column O (Index 15):** Proof URL (Link foto bukti perbaikan)
*   **Column P (Index 16):** (Optional) History Logs jika diperlukan nanti.

**Action:** Buka Google Sheet Anda, dan pastikan Header di kolom K, L, M, N, O sudah diberi nama (misal: `Status`, `Action By`, `Action Date`, `Action Notes`, `Proof URL`) agar data tidak menimpa kolom lain yang mungkin penting.

## 3. Jalankan Aplikasi Web

Setelah backend siap, jalankan aplikasi frontend:

1.  Buka terminal di VS Code.
2.  Jalankan `npm start` atau `npm run dev`.
3.  Akses localhost (biasanya `http://localhost:3000`).

## 4. Cara Penggunaan Fitur Tasks

1.  **Login** dengan user yang sesuai.
2.  Menu nav bawah sekarang memiliki icon **Task Board** (gantikan Love/Favorites).
3.  Di sini akan muncul semua observasi yang **Assigned To** user yang sedang login.
4.  Klik tombol **"Manage Task"** pada kartu tugas.
5.  Ubah Status (misal: Open -> Pending -> Closed).
6.  Isi Catatan tindakan ("Sudah diperbaiki dengan mengganti kabel...").
7.  Upload Foto Bukti (Optional).
8.  Klik **Update Status**.
9.  Data di Spreadsheet akan terupdate, dan notifikasi akan muncul.

Selamat mencoba!
