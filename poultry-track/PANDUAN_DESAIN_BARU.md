# PoultryTrack, revisi sesuai ekspor Figma

Desain mengikuti gambar di PolytryTrack Design Prototype.zip. Acuan utama adalah
sembilan layar dengan header dan form kasir dua tahap (Kasir Mitra/Ecer tahap 1
& 2, Antrean 1 & 2, Buku Bon-1, Stok-1, dan Laporan). Enam gambar lain dipakai
sebagai referensi tambahan untuk detail kartu dan komponen.

## Membuka proyek

1. Ekstrak ZIP ini dan buka folder poultry-track.
2. Buka index.html dengan Chrome atau Edge.
3. Di VS Code, alternatifnya klik kanan index.html dan pilih Open with Live Server
   setelah memasang ekstensi Live Server dari Ritwick Dey.

UI tidak memerlukan npm, proses build, atau instalasi paket Python.

## Memasang pada folder hasil clone

Ganti empat file berikut dengan versi dalam ZIP ini:
- index.html
- style.css
- app.js
- manifest.json

README.md dan PANDUAN_DESAIN_BARU.md berisi petunjuk. Notebook, dataset, kode
analisis Python, SQL, serta gambar analisis tidak berubah.

## Alur

- Kasir: pilih Eceran Tunai atau Mitra Langganan (Bon). Tahap 1 mengisi jumlah
  ekor dan bobot netto. Tahap 2 memilih potongan, request bagian ayam, tanpa/dengan
  kulit, harga per kg, dan pembayaran. Format berat 5,40 dan harga 42.000 didukung.
- Mitra: pilih nama pelanggan atau cari melalui nomor WhatsApp yang sudah
  tersimpan. Nomor dapat diubah sebelum menyimpan transaksi. Mitra baru bisa
  ditambahkan dari form kasir atau halaman Buku Bon.
- Tara: mengosongkan input netto. Isi berat baru sebelum melanjutkan.
- Antrean: daftar ditampilkan dua kartu per halaman. Lihat Detail Antrean membuka
  pesanan berikutnya. Klik status untuk beralih dari Waitlist ke Processing,
  Siap Diambil, lalu Sudah Diambil. Filter memperlihatkan pesanan yang telah diambil.
- Buku Bon: dua mitra tampil lebih dulu. Tombol Lihat Mitra Lainnya membuka seluruh
  daftar. Cari membuka kolom pencarian dan filter. Setor mencatat cicilan dan
  mengurangi saldo bon. Kirim WA membuka draf WhatsApp, bukan mengirim otomatis.
- Stok: tombol +/- mengubah jumlah ekor; +0.5 dan +2.0 menambah berat pasokan.
  Reset hanya mengatur ulang formulir. Riwayat yang sudah disimpan tetap ada.
- Laporan: periode Hari ini dan Semua catatan. Cocokkan Fisik membandingkan uang
  hasil hitungan manual dengan saldo sistem. Selisih baru ditampilkan setelah
  nominal dimasukkan, tidak otomatis dianggap seimbang.
- Tutup Kasir menyimpan snapshot rekap dan menandai lapak tutup. Catatan tidak
  dihapus. Tombol Buka Kembali atau ikon profil dapat mengubah status lapak.

## Cetak dan ekspor

- Export PDF Rekap / Rekap pada Buku Bon membuka fasilitas cetak browser. Pilih
  Save as PDF untuk menyimpan PDF. Isi rekap mencakup seluruh mitra.
- Cetak Rekap Kasir dan Cetak struk mempersiapkan layout lebar isi 48mm untuk
  kertas thermal 58mm. Pilih printer dan ukuran kertas yang sesuai di browser.
- Ringkasan & ekspor transaksi pada Laporan menyediakan CSV untuk Excel.

## Batas prototipe dan data

UI mengikuti tampilan Figma, tetapi belum terhubung ke timbangan atau printer
Bluetooth. Label timbangan merupakan tampilan prototipe; input bobot tetap manual.
Tombol Tara tidak mengirim perintah ke timbangan. Tutup Kasir tidak mengunci laci
fisik. Cetak memakai fasilitas browser dan printer yang dipilih pengguna.

Data tetap disimpan di localStorage, dengan kunci POULTRYTRACK_APP_STATE_V1.
Browser, alamat, dan port yang sama diperlukan agar data versi sebelumnya terbaca.
Beralih dari file langsung ke Live Server dapat menggunakan tempat penyimpanan
browser yang berbeda. Tidak ada sinkronisasi antarperangkat. Jangan membersihkan
data situs jika ingin mempertahankan catatan. Tanggal dan jam memakai Asia/Jakarta.

Isi angka mengikuti data proyek yang tersimpan, sehingga dapat berbeda dari
angka contoh pada gambar Figma. Antrean awal versi sebelumnya tetap dipertahankan.
Data uji dari pemeriksaan browser tidak dimasukkan ke ZIP.

## Pemeriksaan yang dilakukan

Transaksi tunai dan bon, format angka Indonesia, potongan khusus, pilihan kulit,
Tara dan validasi bobot nol, data WhatsApp mitra, setoran bon, halaman Antrean,
perubahan status pesanan, penambahan pasokan, reset formulir, laporan kas,
pencocokan uang fisik, tutup/buka kasir, persiapan cetak kas dan bon, serta unduhan CSV.
