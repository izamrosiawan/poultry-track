# Catatan lapisan interaksi

Interaksi ditambahkan sebagai lapisan terpisah (`interactive.css`, `interactive.js`). `app.js`, `core.js`, dan logika hitungan tidak diubah. Jika kedua file dilepas dari `index.html`, aplikasi tetap berjalan seperti sebelumnya.

## Yang ditambahkan

| Area | Perilaku |
| --- | --- |
| Navigasi | Transisi saat pindah tab, judul halaman bergeser masuk, kartu muncul bertahap, garis progres scroll, bayangan header saat digulir. |
| Tombol | Efek tekan, efek riak, dan angkat tipis saat kursor di atasnya. |
| Kasir | Tahap Timbang dan Pembayaran bergeser searah langkah; indikator tahap 1 berubah selesai; rata-rata kg per ekor dihitung langsung dengan peringatan bila di luar kisaran 1,2 sampai 2,8 kg. |
| Input | Tombol plus dan minus dapat ditahan untuk menambah beruntun; panah atas dan bawah pada Bobot (0,1; Shift 1; Alt 0,01) dan Harga (500; Shift 5.000; Alt 100). |
| Angka | Total tagihan, stok, saldo laci, piutang, dan KPI dashboard menghitung naik atau turun ke nilai baru. |
| Antrean | Bilah tahap Antri, Dipotong, Siap, Diambil pada tiap pesanan; kartu berkedip setelah statusnya diubah. |
| Buku Bon | Hasil pencarian disorot; meter pemakaian plafon (merah mulai 80%). |
| Dashboard | Batang tren dan porsi potongan tumbuh saat tab dibuka. |
| Dialog dan toast | Dialog masuk dengan transisi; toast bergeser masuk dengan penanda sisa waktu. |

## Pintasan keyboard

| Tombol | Fungsi |
| --- | --- |
| Alt+1 sampai Alt+6 | Pindah ke Kasir, Antrean, Buku Bon, Stok, Laporan, Dashboard. |
| Enter pada Ekor atau Bobot | Lanjut ke Pembayaran. |
| Ctrl+Enter pada tahap Pembayaran | Simpan transaksi. |
| / pada Buku Bon | Fokus ke kolom cari mitra. |

Seluruh animasi dimatikan bila perangkat memakai preferensi reduced motion.

## Panel tab Stok

Kolom kiri tab Stok sebelumnya hanya berisi kartu pemasok sehingga tampak kosong di layar lebar. Kini kedua kolom terisi seimbang (`supply-panel.css`, `supply-panel.js`).

| Kartu | Isi |
| --- | --- |
| Stok saat ini | Jumlah ekor dan berat tersisa dari data stok yang sama dengan Kasir, meter persentase sisa terhadap total pasokan, dan status Aman, Menipis (10 ekor atau kurang), atau Habis. |
| Pratinjau pasokan | Dihitung langsung dari formulir: total modal, modal per ekor, rata-rata bobot, stok setelah disimpan, dampak kas, dan selisih harga dengan pasokan terakhir. Lencana Lunas tunai atau Tempo dapat diketuk untuk berganti. |
| Pasokan terakhir | Tiga catatan terbaru dengan tombol Salin ke form untuk mengisi ulang ekor, berat, harga, dan pembayaran, serta tombol Semua riwayat. |

Pada layar di bawah 1024 piksel urutannya: pemasok, stok, formulir, pratinjau, pasokan terakhir, riwayat. Panel hanya membaca data dan tidak mengubah perhitungan stok atau kas.
