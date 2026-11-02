# PoultryTrack - Revisi desain dan perbaikan fungsi

Versi 2 November 2026. Aplikasi kasir dan pembukuan untuk Pelaku Usaha Mikro / Retailer Unggas Komersial Pasar Tradisional.

## Mulai menggunakan

1. Ekstrak ZIP terlebih dahulu.
2. Buka folder `poultry-track`.
3. Buka `index.html` melalui Chrome atau Edge.
4. Gunakan menu Kasir, Antrean, Buku Bon, Stok, dan Laporan di bagian bawah.

Website tidak memerlukan npm, proses build, atau instalasi Python. Untuk penggunaan melalui VS Code, buka folder ini dan jalankan Live Server. Python diperlukan hanya jika ingin menjalankan notebook atau mesin analisis.

## Dokumen yang disertakan

| File | Isi |
| --- | --- |
| `PANDUAN_PENGGUNAAN.md` | Cara membuka, seluruh alur fitur, aturan hitungan, penyimpanan, cetak, dan pemecahan masalah. |
| `CATATAN_REVISI.md` | Perubahan desain dan daftar bug yang diperbaiki. |
| `HASIL_PENGUJIAN.md` | Hasil 17 pengujian JavaScript, pemeriksaan Python, dan uji browser. |
| `DESIGN.md` | Palet, struktur layar, komponen, dan pemetaan ke PDF acuan. |
| `README_ANALISIS_ASLI.md` | Dokumentasi analisis versi sumber, dipertahankan sebagai referensi lama. |
| `DESIGN_ASLI.md` | Catatan desain versi sumber sebelum revisi. |

## Isi proyek

| Bagian | File / folder |
| --- | --- |
| Antarmuka | `index.html`, `style.css`, `app.js`, `core.js`, `manifest.json` |
| Data referensi | `data.json`, `data/poultry_transactions.csv`, `data/supplier_manifests.csv` |
| Analisis | `notebook.ipynb`, `src/poultry_engine.py`, `images/`, `sql/` |
| Pengujian | `tests/core.test.cjs`, `tests/storage.test.cjs`, `tests/test_poultry.py` |
| Dependensi analisis | `requirements.txt` |

Data operasional website berada di localStorage browser. Dataset CSV, data.json, dan notebook merupakan bahan analisis terpisah; memasukkan transaksi di website tidak mengubah file tersebut.

ZIP hanya memuat satu folder aplikasi aktif. Salinan bersarang proyek, cadangan tampilan yang tidak digunakan, metadata Git, file sementara pengujian, dan catatan transaksi uji browser tidak disertakan.

## Pengujian lokal

Dengan Node.js yang mendukung `node:test`:

```bash
node --test tests/core.test.cjs tests/storage.test.cjs
```

Untuk analisis Python dan suite pytest asli:

```bash
python -m pip install -r requirements.txt
python -m pytest tests/test_poultry.py -q
```

## Batas fitur

Timbangan masih diisi manual. Cetak memakai dialog browser dan printer pilihan pengguna. Tombol WhatsApp membuka draf. Penyimpanan belum tersambung ke server atau sinkronisasi antarperangkat. Rincian penggunaan dan batas verifikasi tersedia dalam panduan serta hasil pengujian.
