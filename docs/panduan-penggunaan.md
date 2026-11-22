# Panduan penggunaan PoultryTrack

Versi revisi 2 November 2026.

## 1. Membuka aplikasi

1. Ekstrak ZIP. Jangan membuka index.html langsung dari tampilan isi ZIP.
2. Masuk ke folder poultry-track.
3. Klik dua kali index.html dan buka melalui Chrome atau Edge.
4. Di VS Code, buka folder yang sama dan gunakan Live Server bila diinginkan.

Tidak ada perintah npm atau proses build. Seluruh fitur antarmuka dijalankan oleh index.html, style.css, core.js, dan app.js. Simpan keempat file tersebut di lokasi yang sama. manifest.json juga harus tetap berada dalam folder itu.

Untuk mempertahankan data browser versi sebelumnya, gunakan browser, profil, alamat situs, protokol, dan port yang sama. Membuka file secara langsung dan membukanya melalui Live Server dapat menghasilkan penyimpanan yang berbeda. Perbedaan alamat tidak berarti catatan di lokasi sebelumnya telah dihapus.

## 2. Memahami data awal

Aplikasi membawa data contoh pelanggan, transaksi lama, dan pasokan lama dari proyek sumber. Angka awal pada form mengikuti ilustrasi desain agar tampilan dapat langsung diperiksa. Sebelum mencatat penjualan, ganti jumlah, bobot, harga, potongan, dan nama sesuai kebutuhan.

Laporan Hari ini dapat bernilai nol ketika belum ada transaksi bertanggal hari ini. Pilih Semua catatan untuk melihat riwayat contoh. Saldo piutang adalah saldo pelanggan yang tersimpan, sedangkan angka Bon baru pada laporan adalah penambahan bon pada periode yang dipilih. Kedua angka tersebut memiliki arti berbeda.

Dataset CSV, data.json, dan notebook tidak otomatis menjadi sumber transaksi operasional website. File tersebut dipertahankan untuk kebutuhan analisis. Perubahan data di browser tidak menulis ulang CSV atau notebook.

## 3. Status lapak

Status tampil di kartu cokelat pada semua menu. Sebelum pengguna memilih status secara manual, contoh jam buka mengikuti 07.00-18.00 WIB. Setelah diubah, status pilihan tersebut tersimpan.

Untuk membuka atau menutup lapak, tekan ikon profil di kanan atas lalu gunakan tombol Buka Lapak atau Tutup Lapak. Menutup lapak menghentikan pencatatan penjualan dan setoran bon sampai dibuka kembali. Pencatatan pasokan tetap tersedia untuk persiapan stok.

Tombol Tutup Kasir pada Laporan menyimpan snapshot rekap hari ini dan menandai lapak tutup. Tombol itu tidak mengendalikan laci fisik atau menghapus transaksi. Buka Kembali dapat dipakai apabila perlu melanjutkan pencatatan.

## 4. Kasir Eceran Tunai

### Tahap 1: Timbang dan ekor

1. Pilih Eceran Tunai.
2. Isi jumlah karkas dalam ekor. Tombol minus dan plus membantu mengubah jumlah.
3. Isi bobot netto. Contoh yang diterima: 5,40 atau 5.40.
4. Tombol berat cepat memasukkan bobot sesuai angka pada tombol, bukan menambah bobot sebelumnya.
5. Tara mengatur bobot input menjadi 0,00. Isi bobot positif sebelum melanjutkan.
6. Tekan Lanjut ke Opsi Potong & Transaksi.

Jumlah harus bilangan bulat minimal satu. Bobot harus berupa angka positif. Bobot tetap diisi manual; label Input Manual menjelaskan bahwa aplikasi belum menerima data timbangan digital.

### Tahap 2: Potongan dan transaksi

1. Pilih Utuh, 4 Potong, atau Fillet.
2. Untuk jumlah lain, isi kolom custom dengan bilangan bulat 1-100.
3. Preset dan custom saling menggantikan; tidak dipakai bersamaan.
4. Sesuaikan request bagian, pilihan kulit, dan catatan tambahan.
5. Isi harga per kilogram. Contoh: 42.000 atau 42000.
6. Periksa total tagihan.
7. Pilih Tunai Lunas lalu Simpan Transaksi Kasir.

Memilih Utuh mengarahkan request ke Ayam utuh; memilih Fillet mengarahkan request ke Fillet. Request masih dapat diubah sesuai pesanan. Catatan pesanan ikut ditampilkan pada antrean dan struk.

Transaksi berhasil disimpan bila jumlah, bobot, dan harga valid, lapak buka, serta stok tercatat mencukupi. Setelah disimpan, pesanan masuk antrean, stok berkurang, dan laporan tunai bertambah. Form kembali ke tahap pertama dengan bobot kosong, jumlah satu, dan harga terakhir tetap tersedia.

Kosongkan menghapus bobot serta catatan, mengembalikan opsi dasar dan jumlah satu, lalu kembali ke tahap pertama. Kembali ke timbangan mempertahankan isi form yang sedang dikerjakan. Draft form belum disimpan sebagai transaksi dan tidak dipulihkan setelah reload.

## 5. Kasir Mitra Langganan

1. Pilih Mitra Langganan (Bon).
2. Pilih pelanggan dari daftar. Informasi saldo bon dan nomor WhatsApp ditampilkan.
3. Nomor WhatsApp yang tersimpan juga dapat dipakai untuk mencocokkan mitra.
4. Jika belum terdaftar, gunakan Tambah mitra baru.
5. Isi ekor dan bobot, lalu lanjutkan ke tahap kedua.
6. Periksa potongan dan harga.
7. Pilih Catat Bon atau Tunai Lunas.
8. Simpan transaksi.

Mitra juga dapat membeli tunai. Transaksi bon menambah saldo pelanggan; transaksi tunai tidak menambah utang. Bon ditolak jika total melewati plafon yang ditetapkan. Pilih tunai atau catat setoran terlebih dahulu jika sisa plafon tidak cukup.

Untuk mitra dengan utang baru, tempo standar adalah tujuh hari sejak pencatatan pertama saldo tersebut. Tambahan bon selama saldo itu belum lunas tidak memperpanjang tanggal tempo yang sudah tercatat. Setelah seluruh utang lunas, bon berikutnya memulai tempo baru. Saldo lama tanpa tanggal tempo mempertahankan status keterlambatan awal yang tersedia pada sumber.

Nomor WhatsApp bersifat opsional. Jika diisi, gunakan nomor Indonesia yang valid dengan awalan 08 atau +62. Nama atau nomor yang sudah terdaftar tidak dapat dipakai membuat mitra baru yang sama. Plafon harus positif dan saldo awal bon tidak boleh negatif.

## 6. Antrean

Transaksi tunai dan bon masuk ke antrean; setoran pelunasan tidak masuk antrean.

Urutan pesanan mengikuti waktu masuk. Dua kartu ditampilkan per halaman. Tekan Lihat Detail Antrean untuk halaman berikutnya. Pada halaman terakhir, tombol mengembalikan tampilan ke halaman pertama.

| Status sekarang | Tindakan tombol | Status berikutnya |
| --- | --- | --- |
| Waitlist | Mulai potong | Processing |
| Processing | Tandai siap diambil | Siap Diambil |
| Siap Diambil | Tandai sudah diambil | Sudah Diambil |
| Sudah Diambil | Tombol nonaktif | Tetap selesai |

Filter Aktif menampilkan pesanan yang belum diambil. Filter Sudah diambil menampilkan arsip pesanan selesai. Jumlah antrean dan total karkas mengikuti pesanan aktif. Ringkasan pesanan diproses menghitung status Processing, bukan memperkirakan jumlah meja fisik.

Catatan pesanan dapat dibuka di masing-masing kartu. Riwayat status dipertahankan setelah reload. Perubahan status tidak mengubah nilai penjualan atau mengurangi stok untuk kedua kalinya.

## 7. Buku Bon

Kartu atas memperlihatkan total saldo piutang, jumlah mitra yang masih memiliki utang, serta jumlah yang terlambat.

Dua pelanggan ditampilkan terlebih dahulu agar halaman tetap ringkas. Gunakan Lihat Mitra Lainnya untuk membuka seluruh daftar. Tombol Cari membuka pencarian berdasarkan nama, kode, atau nomor serta filter Semua, Jatuh tempo, dan Plafon kritis. Plafon kritis berarti pemakaian minimal 85 persen.

### Mencatat setoran

1. Tekan Setor pada kartu pelanggan.
2. Isi nominal atau pilih nominal cepat.
3. Pastikan nominal tidak lebih besar dari sisa bon.
4. Tekan Simpan Setoran Tunai.

Setoran mengurangi saldo bon dan menambah penerimaan kas hari ini. Pelunasan penuh mengubah status menjadi Lunas, menghapus tanggal tempo saldo tersebut, dan menonaktifkan tombol Setor sampai ada utang baru.

### WhatsApp

Kirim WA membuka draf WhatsApp berisi pengingat saldo. Pesan tidak dikirim otomatis. Jika nomor belum valid atau belum tersedia, tautannya nonaktif. Untuk memperbarui nomor, pilih mitra pada Kasir, isi nomor baru, lalu simpan bersama transaksi yang sesuai.

### Rekap

Export PDF Rekap dan Rekap menyiapkan rekap seluruh mitra, bukan hanya dua kartu atau hasil filter yang terlihat. Dialog cetak browser dapat dipakai untuk menyimpan sebagai PDF.

## 8. Stok dan pasokan

1. Buka Stok.
2. Isi jumlah ayam masuk.
3. Isi bobot bersih. Format 300,5 atau 300.5 dapat digunakan.
4. Isi harga per kilogram. Format 23.500 atau 23500 dapat digunakan.
5. Buka Detail pembayaran & total modal untuk memilih pembayaran.
6. Pilih Lunas Tunai Meja atau Tempo 7 Hari sesuai pencatatan.
7. Simpan Manifes Pasokan.

Total modal adalah bobot dikalikan harga, dibulatkan ke rupiah. Pasokan tunai menjadi pengeluaran kas; pasokan tempo tidak langsung mengurangi kas tunai. Keduanya menambah stok barang tercatat.

Tombol +0.5 dan +2.0 menambah bobot input. Reset hanya mengatur ulang form pasokan, tidak menghapus riwayat yang sudah disimpan. Setelah berhasil menyimpan, jumlah kembali satu dan bobot dikosongkan untuk mengurangi kemungkinan pencatatan ganda.

Stok dihitung dari seluruh catatan pasokan sampai hari ini dikurangi penjualan sampai hari ini, dalam ekor dan kilogram. Stok ini bukan angka contoh 24 ekor dan tidak otomatis direset setiap pagi. Belum tersedia pencatatan susut, retur, atau koreksi stok fisik. Jika stok fisik berbeda, periksa kelengkapan catatan terlebih dahulu.

Riwayat pasokan menampilkan lima catatan terbaru. Cadangan JSON mencakup semua riwayat, termasuk yang tidak ditampilkan di kartu.

## 9. Laporan dan kas

### Hari ini

Tanggal mengikuti Asia/Jakarta. Laporan memisahkan penjualan tunai, setoran bon, pengeluaran pasokan tunai, bon baru, ekor terjual, dan bobot terjual.

```text
Total uang masuk = penjualan tunai + setoran bon
Saldo laci = saldo awal + total uang masuk - pasokan tunai
```

Penjualan bon tidak langsung menjadi uang masuk. Setoran bon menambah kas, tetapi tidak menambah tonase atau jumlah ekor terjual.

### Saldo awal

Buka Ringkasan tonase & ekspor transaksi. Masukkan saldo awal laci hari ini dan tekan Simpan. Nilai awal bawaan adalah nol. Masukkan uang awal hanya sekali untuk hari yang sama; mengganti angka memperbarui saldo awal, bukan menambahkannya berulang kali.

### Cocokkan Fisik

Hitung uang tunai aktual, tekan Cocokkan Fisik, lalu masukkan nominalnya. Status awal adalah Belum dicocokkan. Status seimbang hanya muncul setelah uang fisik dimasukkan dan sama dengan saldo sistem. Jika ada transaksi baru setelah pencocokan, perbedaan dapat muncul sampai uang fisik dihitung ulang.

### Semua catatan

Periode gabungan memperlihatkan saldo arus kas dari seluruh riwayat sampai hari ini. Saldo awal harian tidak dijumlahkan pada periode ini agar uang yang dibawa dari hari sebelumnya tidak dihitung berulang kali. Pencocokan laci hanya aktif pada Hari ini.

Arus kas gabungan dapat negatif karena data contoh menyimpan sebagian pasokan dan sebagian transaksi. Angka arus kas bukan laba usaha. Gunakan catatan yang lengkap sebelum menafsirkan saldo operasional.

### Tutup Kasir

Tombol menyimpan snapshot hari ini, termasuk saldo awal, tunai, setoran, modal pasokan tunai, dan saldo. Snapshot selalu memakai hari ini meskipun layar sedang menampilkan Semua catatan. Data transaksi tetap tersedia. Tidak ada perintah kunci ke perangkat laci fisik.

## 10. Cetak dan ekspor

| Tombol | Hasil |
| --- | --- |
| Cetak struk terakhir | Struk penjualan dengan tanggal dan jam terbaru. Setoran tidak dianggap struk penjualan. |
| Cetak Rekap Kasir | Ringkasan kas sesuai periode yang dipilih. |
| Export PDF Rekap / Rekap Bon | Tabel seluruh mitra dan saldo bon. |
| Unduh transaksi CSV / Excel | File CSV sesuai periode laporan, dapat dibuka melalui Excel. |
| Unduh cadangan semua data | File JSON berisi seluruh state aplikasi. |

Untuk struk thermal, pilih printer dan kertas 58 mm pada browser; lebar isi disiapkan 48 mm. Margin, skala, dan kemampuan printer tetap perlu disesuaikan pada perangkat pengguna. Cetak bon menggunakan format dokumen biasa agar tabel tidak terpotong menjadi lebar thermal.

File CSV berformat UTF-8 dan memiliki header. Data teks yang menyerupai formula spreadsheet dinetralkan. Jika Excel menampilkan seluruh baris dalam satu kolom, gunakan impor Text/CSV dan pilih koma sebagai delimiter.

Cadangan JSON merupakan salinan lengkap data browser, bukan CSV analisis. Versi ini menyediakan unduh cadangan, belum menyediakan tombol impor kembali.

## 11. Penyimpanan dan pemulihan

Kunci penyimpanan dipertahankan: POULTRYTRACK_APP_STATE_V1. Skema internal memiliki versi 2. Data dengan struktur versi lama dimigrasikan saat dibaca tanpa menghapus transaksi, pelanggan, atau antrean yang sudah selesai.

Jika browser gagal menulis data, aplikasi membatalkan perubahan di memori dan menampilkan pesan. Jika data lama rusak, data itu tidak diganti otomatis dengan data contoh. Cadangan mentah masih dapat diunduh melalui Pengaturan data jika akses baca tersedia.

Ketika data berubah pada tab lain, tab yang tertinggal menampilkan peringatan. Sebelum menulis, aplikasi memeriksa ulang isi penyimpanan. Jika berbeda, tindakan dibatalkan agar transaksi tab lain tidak tertimpa. Muat ulang halaman dan periksa angka sebelum mengulang tindakan.

Reset data memerlukan konfirmasi pengguna dan mengembalikan seluruh catatan lokal ke contoh bawaan. Unduh cadangan terlebih dahulu. Reset bukan tindakan untuk sekadar mengosongkan form kasir atau form pasokan.

## 12. Batas dan pemecahan masalah

| Gejala | Pemeriksaan |
| --- | --- |
| Data tampak berbeda setelah pindah folder / Live Server | Periksa browser, profil, protokol, alamat, dan port yang digunakan sebelumnya. |
| Tampilan masih versi lama | Reload paksa halaman. Pastikan membuka index.html dari folder hasil ekstrak terbaru. |
| Simpan transaksi ditolak | Periksa status lapak, mitra, ekor, bobot, harga, plafon, dan stok. |
| Laporan Hari ini nol | Data contoh bertanggal lama; buat transaksi hari ini atau pilih Semua catatan. |
| Saldo laci tidak sama dengan uang fisik | Periksa saldo awal, transaksi tunai, setoran, pembayaran pasokan, lalu hitung fisik ulang. |
| Tombol WhatsApp tidak aktif | Isi nomor Indonesia yang valid saat pencatatan mitra. |
| Data tidak tersimpan | Izinkan penyimpanan situs, periksa kapasitas browser, hindari mode yang memblokir localStorage. |
| Font berbeda ketika tanpa internet | Aplikasi memakai fallback font sistem; fungsi lokal tetap tersedia. |
| Tidak ada keluaran printer | Pilih printer pada dialog browser. Tidak ada koneksi Bluetooth otomatis dalam aplikasi. |

Belum tersedia akun pengguna, backend, sinkronisasi antarperangkat, autentikasi kasir, koneksi timbangan, koneksi Bluetooth langsung, retur barang, atau perubahan transaksi lama. Dokumen ini menjelaskan kemampuan yang sudah diimplementasikan; fitur perangkat tersebut memerlukan pengembangan dan pengujian tersendiri.
