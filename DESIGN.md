# Sistem desain PoultryTrack

## Arah visual

Tampilan mengikuti rancangan visual wet-market: aplikasi kasir modern bernuansa cokelat espresso gelap, latar krem hangat, kartu putih, dan form kasir adaptif. Pada perangkat mobile (320px - 480px), tata letak satu kolom ramah sentuhan dipertahankan. Pada tablet (768px - 1023px), tata letak beradaptasi menjadi grid 2 kolom dengan bottom-dock melayang dan modal dialog terpusat. Pada desktop/laptop (>= 1024px), antarmuka bertransformasi menjadi stasiun kerja POS penuh dengan top-nav bar dan grid multi-kolom yang optimal untuk penggunaan mouse dan keyboard.

## Palet utama

| Peran | Nilai |
| --- | --- |
| Latar aplikasi | `#F8F8F4` |
| Kartu utama dan tombol utama | `#351900` |
| Permukaan kartu | `#FFFFFF` |
| Permukaan input | `#F1F1ED` |
| Aksen hangat | `#B87943` |
| Garis batas | `#ECECE7` |
| Teks utama | `#1C1917` |
| Status positif | Hijau lembut |
| Tunggakan dan pengeluaran | Merah lembut |

Tipografi memakai Plus Jakarta Sans dengan fallback font sistem. Angka menggunakan bentuk tabular agar kolom harga dan nominal tetap rapi. Semua ikon antarmuka berupa SVG; tidak ada emoji.

## Pemetaan layar

| PDF acuan | Implementasi |
| --- | --- |
| Kasir Ecer - 1 | Pilihan Eceran Tunai, indikator tahap, jumlah karkas, bobot, Tara, dan tombol lanjut. |
| Kasir Mitra - 1 | Pilihan Mitra, pemilihan nama, informasi WhatsApp, jumlah, dan bobot. |
| Kasir Ecer - 2 / Kasir Mitra - 2 | Pilihan potongan, custom, request, kulit, harga, total, pembayaran, simpan, dan cetak. |
| Antrean 1 / Antrean 2 | Dua kartu per halaman, status proses, tombol perpindahan halaman, dan ringkasan beban kerja. |
| Buku Bon-1 | Ringkasan piutang, dua kartu awal, pencarian, filter, daftar lengkap, tambah mitra, setoran, dan rekap. |
| Stok-1 | Informasi pemasok, jumlah masuk, berat, harga, pembayaran, simpan, dan riwayat. |
| Laporan | Kartu laci kas, arus kas, pencocokan, tutup kasir, cetak, dan ekspor. |
| Enam PDF layar panjang lainnya | Referensi tambahan susunan kartu dan detail komponen. |

Angka operasional mengikuti catatan aplikasi, sehingga tidak dipaksakan sama dengan angka ilustrasi pada PDF. Beberapa label diperjelas agar sesuai kemampuan aplikasi, seperti Input Manual dan Cetak struk terakhir.

## Komponen dan aksesibilitas

- Tombol jumlah berbentuk kotak membulat; tombol utama memiliki kontras tinggi.
- Input dan elemen flex diberi batas minimum lebar nol agar tidak melampaui kartu.
- Grid menggunakan kolom `minmax(0, 1fr)` untuk menghindari overflow.
- Teks panjang pada nama mitra, nominal, dan rincian antrean dapat membungkus.
- Penanda fokus keyboard, label input, role status, dan pesan validasi tersedia.
- Pilihan jenis pelanggan memperbarui aria-selected dan dapat dipindahkan dengan tombol panah.
- Dialog setoran membatasi fokus dan membuat konten belakang tidak aktif selama dialog terbuka.
- Animasi dikurangi ketika pengguna mengaktifkan preferensi reduced motion.
- Cetak bon memakai lebar dokumen normal; struk dan rekap thermal memakai lebar isi 48 mm.
