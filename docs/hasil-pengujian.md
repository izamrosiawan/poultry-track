# Hasil pengujian revisi PoultryTrack

Tanggal pemeriksaan: 2 November 2026.

## 1. Pengujian JavaScript

Perintah yang dijalankan pada sumber final:

```bash
node --check app.js
node --check core.js
node --test tests/core.test.cjs tests/storage.test.cjs
```

Hasil: pemeriksaan sintaks lulus; 17 pengujian otomatis lulus, 0 gagal.

| No. | Pemeriksaan |
| --- | --- |
| 1 | Bobot format Indonesia dan titik desimal; penolakan input rusak. |
| 2 | Harga dengan pemisah ribuan Indonesia. |
| 3 | Pemisahan penjualan tunai, setoran, bon, dan pasokan tempo. |
| 4 | Saldo awal ditambahkan sekali pada laporan harian. |
| 5 | Stok berubah menurut pasokan dan penjualan; setoran bukan barang terjual. |
| 6 | Migrasi tidak mengubah sumber dan membentuk antrean menurut urutan waktu. |
| 7 | Penolakan identitas pelanggan ganda dan angka antrean rusak saat migrasi. |
| 8 | Status lunas dan pergantian tanggal Jakarta. |
| 9 | Keterlambatan bon baru berdasarkan tanggal tempo. |
| 10 | Urutan transisi status antrean. |
| 11 | Validasi nomor WhatsApp. |
| 12 | Data penyimpanan yang rusak tidak ditimpa data contoh. |
| 13 | Gagal menyimpan membatalkan perubahan saldo di memori. |
| 14 | Tab yang tertinggal tidak menimpa isi penyimpanan tab lain. |
| 15 | Struk terakhir mengikuti tanggal dan jam terbaru. |
| 16 | CSV mengikuti periode dan menetralkan formula dari teks pengguna. |
| 17 | Rekap bon mencakup seluruh mitra dan meng-escape karakter HTML. |

Pengujian penyimpanan menggunakan lingkungan Node VM dan localStorage tiruan. Pengujian ini menguji kegagalan tulis serta konflik data secara deterministik; tidak menggantikan seluruh variasi perilaku penyimpanan browser.

## 2. Pemeriksaan browser

Pemeriksaan menggunakan pratinjau lokal pada Chrome. Data uji hanya berada pada browser pemeriksaan dan tidak ditanamkan ke kode atau data.json.

| Skenario | Hasil teramati |
| --- | --- |
| Tara lalu lanjut dengan bobot nol | Form ditolak dan pesan validasi muncul. |
| Harga abc | Penyimpanan transaksi ditolak. |
| Tunai: 3 ekor, 5,40 kg, Rp42.000/kg | Transaksi Rp226.800 tersimpan dan masuk antrean. |
| Penambahan mitra, plafon 1.000.000 | Mitra tersimpan dan dapat dipilih pada kasir. |
| Bon: 1 ekor, 2 kg, Rp42.000/kg | Utang mitra bertambah Rp84.000; potongan custom 12 dan request tercatat. |
| Setoran Rp100.000 atas saldo Rp84.000 | Ditolak karena melebihi sisa bon. |
| Setoran Rp34.000 lalu Rp50.000 | Saldo menjadi nol, status Lunas, dan Setor nonaktif. |
| Pasokan 2 ekor, 2,5 kg, Rp23.500/kg | Modal Rp58.750 tersimpan; bobot dan harga Indonesia terbaca benar. |
| Laporan skenario di atas | Masuk Rp310.800, keluar Rp58.750, saldo sebelum kas awal Rp252.050. |
| Saldo awal Rp100.000 | Saldo laci menjadi Rp352.050. |
| Pencocokan uang fisik Rp352.050 | Status seimbang muncul. |
| Periode Semua catatan | Judul menjadi arus kas gabungan; pencocokan fisik nonaktif. |
| Tutup kasir lalu simpan penjualan | Ditolak sampai lapak dibuka kembali. |
| Processing ke Siap Diambil ke Sudah Diambil | Pesanan selesai keluar dari daftar aktif dan jumlah antrean berkurang. |
| Halaman antrean berikutnya | Rincian transaksi uji tunai dan bon tampil di belakang pesanan lama. |
| Reload | Transaksi, saldo, stok, dan status antrean tetap terbaca. |
| Bon Rp420.000 dengan sisa plafon Rp378.000 | Ditolak dengan pesan sisa plafon. |
| Jumlah penjualan melebihi stok | Ditolak dengan pesan stok tidak mencukupi. |
| Menambahkan nama mitra yang sama | Ditolak dengan pesan nama/nomor sudah terdaftar. |

## 3. Responsivitas dan kelengkapan antarmuka

Pemeriksaan dilakukan dalam iframe browser dengan lebar 320, 375, dan 430 piksel. Kasir tahap pertama dan kedua diperiksa secara visual. Antrean, Buku Bon, Stok, dan Laporan diperiksa setelah navigasi ke masing-masing halaman; judul aktif turut diverifikasi.

Hasil: lebar scroll isi sama dengan lebar body pada pemeriksaan tersebut, sehingga tidak ditemukan overflow horizontal. Kartu laporan dan kasir juga diperiksa secara visual. Lebar area isi dapat berkurang 15 piksel saat scrollbar vertikal muncul.

Pemeriksaan struktur HTML dan referensi JavaScript tidak menemukan ID ganda, ID referensi yang hilang, atau aset lokal wajib yang tidak tersedia. Pemindaian index.html, app.js, core.js, style.css, dan manifest.json tidak menemukan emoji, variation selector emoji, atau tanda centang berbasis karakter.

## 4. Pemeriksaan Python

Kode Python analisis tidak diubah. Pemeriksaan langsung dijalankan untuk:

1. Rendemen 10 kg hidup dan 7,4 kg karkas menghasilkan 74 persen.
2. Bobot hidup nol/negatif serta karkas negatif/melebihi bobot hidup memicu ValueError.
3. Perhitungan 20 kg hidup, 14,8 kg karkas, biaya Rp22.000/kg dan jual Rp35.000/kg menghasilkan COGS Rp440.000, omzet Rp518.000, dan laba kotor Rp78.000.
4. Agregasi contoh utang menghasilkan Rp750.000 dari dua transaksi belum lunas.

Keempat pemeriksaan langsung lulus. Suite pytest asli tidak dijalankan karena modul pytest tidak tersedia pada lingkungan pemeriksaan. Perintah untuk menjalankannya setelah memasang requirements.txt tersedia di README.md. Notebook dan seluruh uji statistik tidak dijalankan ulang; angka dalam dokumentasi analisis lama tidak diverifikasi kembali sebagai bagian revisi antarmuka ini.

## 5. Batas verifikasi

- Cetak diuji pada penyusunan HTML rekap/struk dan pemisahan CSS dokumen biasa dari thermal. Printer fisik 58 mm serta dialog cetak pada komputer pengguna belum diuji.
- CSV diuji pada pembentukan isi, pemilihan periode, dan escaping. Tampilan impor Excel bergantung pada aplikasi serta pengaturan regional pengguna.
- WhatsApp tidak digunakan untuk mengirim pesan; validasi nomor dan tautan hanya diperiksa secara lokal.
- Tidak dilakukan pengujian perangkat timbangan, Bluetooth, laci kas, sinkronisasi server, atau autentikasi karena fitur tersebut belum diimplementasikan.
- Pengujian di atas mencakup skenario yang disebutkan; hasil ini tidak menyatakan seluruh kemungkinan bug telah dieliminasi.
