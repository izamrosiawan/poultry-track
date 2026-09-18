# 🐔 PoultryTrack (Sistem Manajemen Operasional & Pencatatan Lapak Ayam Potong Tradisional)

[![Mata Kuliah](https://img.shields.io/badge/Mata%20Kuliah-Manajemen%20Proyek%20TIK-blue.svg)](https://telkomuniversity.ac.id/)
[![Kurikulum](https://img.shields.io/badge/Standar-PMBOK%206th%20%2F%207th%20Edition-green.svg)]()
[![Status Proyek](https://img.shields.io/badge/Status-Inisiasi%20%26%20Perencanaan-orange.svg)]()
[![Target Pengguna](https://img.shields.io/badge/Mitra-Pedagang%20Pasar%20Tradisional-red.svg)]()

> **PoultryTrack** adalah rancangan sistem manajemen proyek teknologi informasi (TIK) yang ditujukan untuk mendigitalisasi operasional lapak ayam potong di pasar tradisional. Sistem ini mengintegrasikan pemesanan pelanggan tetap (pre-order H-1 via web/WhatsApp), antrean pemotongan karkas, pencatatan kasir cepat tahan air, serta buku piutang tempo (bon) langganan.

---

## 📌 Ringkasan Eksekutif Proyek

| Parameter | Keterangan |
| :--- | :--- |
| **Nama Proyek** | PoultryTrack (Integrated Poultry Retail Management System) |
| **Domain Masalah** | Efisiensi rantai pasok mikro & akuntansi kasir pedagang ayam pasar tradisional |
| **Mitra / Stakeholder Utama** | Pelaku Usaha Mikro Lapak Ayam Potong Tradisional |
| **Pendekatan Metodologi** | Waterfall terstruktur berbasis 10 Knowledge Areas PMBOK |
| **Target Luaran** | Dokumen Rencana Manajemen Proyek (12 Bab PMBOK) & Prototipe Antarmuka Kasir |

---

## 🎯 Latar Belakang & Permasalahan Riil di Lapangan

Pedagang ayam potong di pasar tradisional beroperasi dengan dinamika waktu yang ekstrem (pukul 02.00 subuh hingga 11.00 siang) dengan karakteristik dagangan yang sangat mudah rusak (*highly perishable*). Permasalahan utama yang dihadapi meliputi:

1. **Kekacauan Antrean Pemotongan Subuh**: Pesanan dari langganan tetap (warung makan, katering, pedagang bakso) masuk sporadis melalui pesan singkat tanpa urutan prioritas jenis potongan (potong 4, 8, fillet, karkas utuh).
2. **Ketiadaan Rekonsiliasi Susut Bobot**: Ayam hidup yang dibeli per kilogram dari supplier mengalami penyusutan bobot saat disembelih, dicabuti bulu, dan dibersihkan kotorannya (*yield percentage*). Selisih bobot ini jarang tercatat sehingga laba kotor harian tidak akurat.
3. **Kebocoran Piutang Dagang (Sistem Bon)**: Sistem bon langganan sering kali hanya dicatat di kertas kardus atau buku tulis basah yang rawan robek atau hilang saat aktivitas pasar sedang padat.
4. **Kondisi Lingkungan Kerja Ekstrem**: Meja kasir dan area kerja pasar basah sering terpapar air dan lendir ayam, menuntut antarmuka sentuh berukuran besar dan minim input ketik rumit.

---

## 🏗️ Arsitektur Alur Operasional Sistem

```text
[Malam: H-1, 19.00 - 23.00 WIB]
   │ Pre-order kebutuhan daging dari langganan tetap (warung makan/katering)
   ▼
[Subuh: 03.00 - 05.00 WIB]
   │ Penerimaan ayam hidup supplier, cetak daftar antrean juru potong
   ▼
[Pagi: 05.00 - 09.00 WIB]
   │ Penyerahan pesanan langganan & transaksi eceran kasir cepat
   ▼
[Siang: 11.00 WIB]
   │ Tutup buku harian, rekapitulasi piutang (bon), dan analisis marjin bersih
```

---

## 📁 Struktur Repositori Dokumen Manajemen Proyek (PMBOK)

Repositori ini disusun mengikuti pembagian 12 Bab standar dokumen manajemen proyek:

```text
poultry-track/
├── assets/
│   └── diagrams/                        # Diagram alur, WBS Tree, Mockup
├── docs/
│   ├── 01_pendahuluan/                  # Bab I: Latar Belakang, Masalah, & Tujuan
│   ├── 02_project_charter/              # Bab II: Project Charter & Lembar Kontrak Proyek
│   ├── 03_scope_wbs/                    # Bab IV & V: Scope Management, WBS & WBS Dictionary
│   ├── 04_schedule_gantt/               # Bab III: Schedule Management Plan & Gantt Chart
│   ├── 05_cost_budget/                  # Bab VI: Cost Management, RAB, & Analisis EVM
│   ├── 06_quality_plan/                 # Bab VII: Quality Management Plan & Standar SLA
│   ├── 07_human_resource/               # Bab XII: Human Resource Plan, Organisasi, RACI Matrix
│   ├── 08_communications/               # Bab VIII: Communications Management Plan & Matriks Rapat
│   ├── 09_risk_register/                # Bab IX: Risk Management Plan, Matriks Risiko & Mitigasi
│   └── 10_procurement_stakeholder/      # Bab X & XI: Procurement Plan & Stakeholder Management
├── src/                                 # Prototipe aplikasi antarmuka kasir & pelaporan
└── README.md
```

---

## 👥 Rencana Struktur Organisasi Tim Proyek

| Peran Tim | Tanggung Jawab Utama |
| :--- | :--- |
| **Project Manager** | Mengendalikan integrasi proyek, ruang lingkup, jadwal, dan komunikasi stakeholder. |
| **System Analyst** | Menganalisis kebutuhan bisnis lapak pasar, memetakan alur data (DFD/UML), dan WBS. |
| **UI/UX Designer** | Merancang antarmuka tablet ramah kondisi pasar basah (high-contrast, touch target besar). |
| **Software Engineer** | Membangun prototipe modul kasir, rekonsiliasi stok, dan pencatatan buku bon. |
| **Quality Assurance** | Menguji akurasi kalkulasi susut bobot, keandalan struk printer, dan mitigasi risiko. |

---

## 📅 Peta Jadwal Milestone Perkuliahan

| Pekan | Aktivitas & Target Luaran Manajemen Proyek |
| :---: | :--- |
| **Minggu 1 - 2** | Identifikasi kebutuhan bisnis, observasi lapangan, penyusunan Bab I (Pendahuluan) |
| **Minggu 3 - 4** | Finalisasi Project Charter (Bab II) & Identifikasi Stakeholder Awal |
| **Minggu 5** | Penyusunan Work Breakdown Structure (WBS) & WBS Dictionary (Bab IV-V) |
| **Minggu 6** | Penyusunan Jadwal, Critical Path Method (CPM), & Gantt Chart (Bab III) |
| **Minggu 7** | Estimasi Anggaran Biaya, Cost Baseline, & Rencana Manajemen Biaya (Bab VI) |
| **Minggu 8** | Evaluasi Capaian Pembelajaran UTS (CLO 2) |
| **Minggu 9 - 10** | Rencana Manajemen Mutu & Standar Pengujian Perangkat Lunak (Bab VII) |
| **Minggu 11 - 12** | Perencanaan SDM, Struktur Tim, RACI Matrix, & Tata Kelola Komunikasi (Bab VIII, XII) |
| **Minggu 13 - 14** | Risk Register, Analisis Dampak Kualitatif-Kuantitatif, & Rencana Pengadaan (Bab IX, X, XI) |
| **Minggu 15** | Simulasi Sidang Proyek & Presentasi Kelompok (CLO 4) |
| **Minggu 16** | Pengumpulan Final Bundel Laporan Manajemen Proyek 12 Bab Lengkap (CLO 3) |

---
*Dikembangkan untuk pemenuhan Tugas Besar Mata Kuliah Manajemen Proyek TIK.*
