# PROJECT CHARTER: POULTRYTRACK SYSTEM

| Atribut Proyek | Informasi Proyek |
| :--- | :--- |
| **Judul Proyek** | PoultryTrack: Sistem Informasi Manajemen Pemesanan, Pemotongan Karkas, dan Piutang Usaha Ayam Potong Pasar Tradisional |
| **Kode Proyek** | PRJ-TIK-2026-PT01 |
| **Tanggal Efektif** | September 2026 |
| **Sponsor Proyek** | Pemilik Usaha Lapak Ayam Potong Pasar Tradisional |
| **Project Manager** | Izam Rosiawan & Tim Mahasiswa Manpro TIK |
| **Departemen Pelaksana** | Program Studi Sains Data / Informatika, Telkom University |

---

## 1. Tujuan Proyek (Project Objectives)

Proyek ini bertujuan merancang dan mendokumentasikan perencanaan komprehensif pengembangan sistem informasi kasir dan manajemen rantai pasok mikro lapak ayam potong pasar tradisional guna:
1. **Mengurangi Waktu Tunggu Pemotongan**: Memangkas waktu antre penyiapan karkas ayam di jam sibuk subuh (03.00 - 06.00 WIB) sebesar minimal 40% melalui rekapitulasi pre-order H-1.
2. **Menghilangkan Selisih Susut Bobot Tidak Tercatat**: Menyediakan modul rekonsiliasi timbangan ayam hidup supplier vs karkas bersih siap jual.
3. **Mencegah Kerugian Piutang Terlupakan (Bon)**: Mendigitalkan pencatatan piutang pelanggan tetap dengan kartu piutang digital dan pengingat jatuh tempo via pesan ringkas.
4. **Memberikan Antarmuka Tahan Lingkungan Basah**: Merancang UX tablet minim sentuhan (large touch target) yang dapat dioperasikan dengan cepat pada kondisi lapak basah.

---

## 2. Ruang Lingkup Proyek (High-Level Scope)

### Termasuk dalam Ruang Lingkup (In-Scope):
* Modul Input Pre-Order Langganan H-1 (Web Form / Pesan ringkas terstruktur).
* Modul Antrean Pemotongan Juru Potong (Kategori: Potong 4, 8, 12, Fillet, Karkas Utuh).
* Modul Point of Sales (POS) Penjualan Eceran Cepat dengan integrasi printer struk Bluetooth.
* Modul Manajemen Piutang (Buku Bon Digital per Pelanggan & Riwayat Setoran).
* Modul Rekapitulasi Keuangan Harian & Laba Rugi Operasional.
* Penyusunan Bundel Dokumen Manajemen Proyek 12 Bab standar PMBOK.

### Di Luar Ruang Lingkup (Out-of-Scope):
* Pengadaan fisik timbangan digital bersensor IoT nirkabel (timbangan masih dibaca manual lalu diinput ke sistem).
* Integrasi pembayaran non-tunai perbankan skala enterprise (pembayaran QRIS menggunakan QR statis UMKM).
* Pengantaran logistik armada skala besar antarkota.

---

## 3. Asumsi dan Batasan Proyek (Assumptions & Constraints)

### Asumsi:
* Mitra lapak bersedia memberikan data riil rata-rata pembelian ayam harian, harga beli karkas, dan kebiasaan bon pelanggan untuk analisis kebutuhan.
* Perangkat keras yang digunakan di lapangan adalah tablet Android kelas pemula (8–10 inci) dengan proteksi casing silikon kedap percikan air.
* Jaringan internet di area pasar tradisional minimal tersedia koneksi data seluler 4G yang stabil.

### Batasan:
* **Batas Waktu**: Seluruh dokumen perencanaan manajemen proyek dan pengujian prototipe harus diselesaikan dalam 16 pekan masa perkuliahan semester ganjil.
* **Batas Biaya**: Estimasi alokasi biaya pengadaan hardware dan lisensi cloud operasional skala UMKM tidak melebihi Rp 4.500.000,-.
* **Kepatuhan Akademik**: Wajib mematuhi kaidah penulisan dan rubrik penilaian mata kuliah Manajemen Proyek TIK.

---

## 4. Rencana Anggaran Awal (Preliminary Budget)

| Kategori Pengeluaran | Estimasi Biaya (Rp) | Keterangan |
| :--- | :--- | :--- |
| **Perangkat Keras Kasir (Tablet & Printer)** | Rp 2.200.000,- | 1 unit Tablet Android 8.7" + 1 unit Mini Thermal Printer 58mm |
| **Perlengkapan Proteksi & Dudukan** | Rp 300.000,- | Waterproof silicon case, tablet desk clamp mount anti-air |
| **Infrastruktur Cloud & Hosting (1 Tahun)** | Rp 600.000,- | Sewa VPS / Database cloud tier mikro & domain |
| **Biaya Riset Lapangan & Wawancara** | Rp 400.000,- | Operasional observasi subuh di pasar tradisional |
| **Dana Cadangan Kontinjensi (10%)** | Rp 500.000,- | Buffer risiko kenaikan harga perangkat keras |
| **Total Estimasi Anggaran** | **Rp 4.000.000,-** | *Kelayakan investasi UMKM mandiri* |

---

## 5. Ringkasan Milestone Proyek (Milestone Schedule)

| Milestone | Target Waktu | Kriteria Keberhasilan |
| :--- | :--- | :--- |
| **M1: Approval Project Charter** | Pekan ke-3 | Charter disepakati oleh tim dan disetujui dosen pengampu |
| **M2: WBS & Scope Baseline** | Pekan ke-5 | WBS berstruktur hingga level 3 beserta WBS Dictionary |
| **M3: Schedule & Cost Baseline** | Pekan ke-7 | Gantt Chart dan Rencana Anggaran Biaya (RAB) rampung |
| **M4: Evaluasi Ujian Tengah Semester** | Pekan ke-8 | Laporan bagian 1 (Inisiasi & Perencanaan Awal) siap nilai |
| **M5: Quality, HR, & Risk Baseline** | Pekan ke-13 | Matriks risiko dan rencana pengelolaan mutu tervalidasi |
| **M6: Presentasi Akhir & Final Handover** | Pekan ke-15 - 16 | Laporan utuh 12 Bab PMBOK dijilid dan prototipe didemokan |

---

## 6. Persetujuan dan Otorisasi (Charter Sign-off)

Dokumen ini menjadi dasar otorisasi formal dimulainya proyek **PoultryTrack**:

| Pihak | Nama | Tanda Tangan / Persetujuan | Tanggal |
| :--- | :--- | :--- | :--- |
| **Project Sponsor** | Mitra Lapak Usaha Ayam Potong | `[Disetujui]` | September 2026 |
| **Project Manager** | Perwakilan Tim Mahasiswa | `[Disetujui]` | September 2026 |
| **Dosen Pengampu** | Dosen Manajemen Proyek TIK | `[Ditinjau]` | September 2026 |
