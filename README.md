# PoultryTrack: Sistem Analisis Operasional, Rekonsiliasi Susut Karkas, dan Pembukuan Piutang Lapak Ayam Potong Pasar Tradisional

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-brightgreen.svg?style=flat&logo=github)](https://izamrosiawan.github.io/poultry-track/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![Tests](https://img.shields.io/badge/Tests-Pytest_Passing-brightgreen.svg)](#)
[![Dataset](https://img.shields.io/badge/Dataset-1.937_Transaksi-orange.svg)](#)

Repositori ini menyajikan analisis komputasi data operasional, kalkulasi rendemen karkas, dan dashboard kasir cepat untuk pedagang ayam potong di pasar tradisional. Berbeda dengan sistem ritel modern, lapak pasar tradisional beroperasi di lingkungan basah (*wet market*) dengan jam kerja intensif (03.00 - 11.00 WIB), komoditas cepat susut (*perishable*), serta sistem piutang tempo (bon) langganan warung makan dan katering.

---

## 1. Masalah Operasional Lapak Pasar Tradisional

1. **Susut Bobot Tidak Terekonsiliasi**: Ayam hidup yang dibeli per kilogram dari supplier mengalami pemotongan, pencabutan bulu, dan pembuangan jeroan. Rerata rendemen karkas berada di kisaran 71% - 76%. Tanpa pencatatan rasio rendemen yang disiplin, pedagang sering salah menetapkan harga jual per kg karkas sehingga marjin keuntungan tergerus.
2. **Kebocoran Piutang Langganan (Sistem Bon)**: Mayoritas langganan tetap (warung Padang, depot mie, pedagang bakso) mengambil ayam setiap subuh dengan sistem pembayaran tempo 3 hingga 14 hari. Pencatatan manual di kertas sering basah, sobek, atau lupa ditagih.
3. **Kebutuhan Antarmuka Khusus Lingkungan Basah**: Kasir lapak memerlukan antarmuka minim ketik dengan tombol sentuh besar yang cepat dioperasikan di atas meja timbangan pasar.

---

## 2. Struktur Repositori

```text
poultry-track/
├── .nojekyll                   # GitHub Pages static deployment
├── README.md                   # Laporan komprehensif, formula matematis, dan visualisasi
├── requirements.txt            # Dependensi pustaka Python
├── notebook.ipynb              # Master Jupyter Notebook di root
├── index.html                  # Interactive Dashboard (GitHub Pages)
├── style.css                   # Desain antarmuka modern ramah lingkungan pasar
├── app.js                      # Logika kalkulator karkas & pemuatan data interaktif
├── data.json                   # Agregasi data operasional untuk visualisasi instan
├── data/
│   └── poultry_transactions.csv  # 1.937 baris data transaksi harian lapak (90 hari)
├── images/                     # Visualisasi komputasi 300 DPI
│   ├── carcass_yield_distribution.png
│   ├── daily_revenue_profit_trend.png
│   ├── profit_margin_by_cut.png
│   └── receivables_aging_summary.png
├── sql/
│   └── analytical_queries.sql  # Kueri SQL analitis omzet, laba kotor, dan piutang
├── src/
│   └── poultry_engine.py       # Modul perhitungan rendemen dan keuangan
└── tests/
    └── test_poultry.py         # Unit testing Pytest (100% lulus)
```

---

## 3. Metodologi Matematis

### A. Rasio Rendemen Karkas (*Carcass Yield Ratio*)
Rasio bobot karkas bersih siap jual ($W_{\text{karkas}}$) terhadap bobot ayam hidup yang dibeli dari supplier ($W_{\text{hidup}}$):

$$\text{Yield Ratio} = \frac{W_{\text{karkas}}}{W_{\text{hidup}}}$$

Persentase susut bobot (darah, bulu, kotoran, dan jeroan terbuang):

$$\text{Weight Loss (\%)} = \left( 1 - \text{Yield Ratio} \right) \times 100\%$$

### B. Titik Impas Harga Jual Karkas (*Break-Even Selling Price*)
Agar pedagang tidak merugi akibat susut karkas, harga jual minimal per kilogram karkas ($P_{\text{karkas}}^{\min}$) dihitung berdasarkan harga beli ayam hidup ($C_{\text{hidup}}$):

$$P_{\text{karkas}}^{\min} = \frac{C_{\text{hidup}}}{\text{Yield Ratio}}$$

*Contoh:* Jika harga ayam hidup Rp 22.000/kg dan rendemen 73,5%, maka titik impas modal karkas adalah Rp 29.932/kg sebelum memperhitungkan biaya es, plastik, dan tenaga kerja.

### C. Laba Kotor Transaksi (*Gross Profit*)
$$\text{Gross Profit} = \left( W_{\text{karkas}} \times P_{\text{jual}} \right) - \left( W_{\text{hidup}} \times C_{\text{hidup}} \right)$$

---

## 4. Hasil Analisis Data Lapak (90 Hari Operasional)

| Metrik Operasional | Nilai Komputasi | Keterangan |
| :--- | :--- | :--- |
| **Total Volume Transaksi** | 1.937 transaksi | Rerata 21,5 transaksi per hari |
| **Total Omzet Penjualan** | Rp 1.267.636.702,- | Rerata omzet Rp 14,08 Juta/hari |
| **Total Laba Kotor** | Rp 253.773.420,- | Rerata laba kotor Rp 2,82 Juta/hari |
| **Rasio Rendemen Rata-rata** | **73,47%** | Standar deviasi: 1,44% |
| **Total Piutang Belum Lunas** | Rp 742.120.000,- | 58,5% omzet berputar di piutang tempo |

---

## 5. Visualisasi Komputasi (300 DPI)

### Distribusi Rendemen Karkas Ayam Potong
![Distribusi Rendemen](images/carcass_yield_distribution.png)

### Tren Omzet dan Laba Kotor Harian
![Tren Finansial Harian](images/daily_revenue_profit_trend.png)

### Margin Laba Berdasarkan Jenis Potongan
![Margin Jenis Potongan](images/profit_margin_by_cut.png)

### Akumulasi Piutang Belum Tertagih per Pelanggan Tetap (Buku Bon)
![Piutang Pelanggan](images/receivables_aging_summary.png)

---

## 6. Verifikasi & Pengujian Otomatis

Seluruh logika matematika susut karkas dan keuangan diuji menggunakan Pytest:

```bash
python -m pytest tests/
```

Hasil pengujian: **4 passed in 0.58s (100% lulus)**.
