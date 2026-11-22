# Catatan revisi - 2 November 2026

## Desain

1. Palet disesuaikan menjadi cokelat gelap dan krem terang sesuai PDF.
2. Bentuk tombol jumlah, kartu, input, segmented control, dan pilihan potongan dirapikan.
3. Ringkasan tagihan dibuat terang dengan angka cokelat gelap.
4. Kartu laci laporan memakai latar krem; penerimaan dan pengeluaran memiliki warna status yang jelas.
5. Tata letak mendukung 320, 375, dan 430 piksel tanpa overflow horizontal pada pemeriksaan browser.
6. Emoji serta tanda centang berbasis karakter dihapus dari antarmuka. Ikon tetap menggunakan SVG.

## Bug dan perilaku yang diperbaiki

| Masalah awal | Perbaikan |
| --- | --- |
| Kolom berat melebar keluar kartu | Batas lebar flex, input, dan susunan Tara diperbaiki. |
| Angka rusak berubah menjadi nol tanpa penjelasan | Parser membedakan input valid dan tidak valid; penyimpanan ditolak bila angka tidak valid. |
| Format harga ribuan tidak konsisten | Harga, setoran, saldo awal, dan plafon menerima format Indonesia. |
| Kosongkan kembali memasukkan berat contoh | Bobot dan catatan dikosongkan; jumlah kembali satu; harga terakhir dipertahankan. |
| Potongan default dan custom dapat tumpang tindih | Memilih preset mengosongkan custom; memasukkan custom membatalkan pilihan preset. |
| Request utuh dan fillet tidak mengikuti pilihan | Request diselaraskan saat preset Utuh atau Fillet dipilih. |
| Stok tersisa selalu menampilkan 24 ekor | Stok dihitung dari pasokan dikurangi penjualan tunai dan bon. |
| Penjualan dapat melebihi stok | Penyimpanan transaksi ditolak bila stok ekor atau bobot tidak mencukupi. |
| Bon dapat melewati plafon | Nominal diperiksa terhadap sisa plafon pelanggan. |
| Pesanan baru mendahului pesanan sebelumnya | Pesanan baru ditambahkan di belakang; migrasi antrean lama diurutkan berdasarkan tanggal dan jam. |
| Jumlah meja aktif hanya perkiraan tetap | Ringkasan menghitung pesanan berstatus processing. |
| Setoran ikut berpotensi dianggap barang terjual | Penjualan dan setoran dipisahkan dalam perhitungan stok serta tonase. |
| Setoran dapat melebihi utang | Validasi nominal; pilihan cepat dibatasi sisa utang; saldo lunas memperbarui status. |
| Bon baru tidak memiliki tanggal tempo | Bon baru memakai tempo standar tujuh hari dan dihitung terhadap tanggal Jakarta. |
| Nomor WhatsApp tidak valid tetap memiliki tautan | Nomor divalidasi; tautan dinonaktifkan bila tidak tersedia. |
| Mitra dapat dibuat ganda | Nama atau nomor WhatsApp yang sama ditolak. |
| Informasi ARIA jenis pelanggan tidak berubah | aria-selected dan aria-pressed mengikuti pilihan aktif. |
| Riwayat hilang diam-diam saat data gagal dibaca | Data lama tidak ditimpa otomatis; ada pesan kesalahan dan unduh cadangan mentah. |
| Gagal menyimpan tetap mengubah angka di layar | Perubahan memori dibatalkan ke data tersimpan terakhir. |
| Dua tab dapat saling menimpa data | Isi penyimpanan diperiksa sebelum menyimpan; tindakan pada tab yang tertinggal dibatalkan. |
| Saldo laci selalu menganggap kas awal nol | Saldo awal harian dapat dimasukkan dan ditambahkan ke saldo laci. |
| Laporan semua catatan dianggap uang fisik hari ini | Judul menjadi saldo arus kas gabungan; pencocokan hanya untuk Hari ini. |
| Jumlah transaksi dan teks periode berupa angka tetap | Label mengikuti transaksi dan periode yang dipilih. |
| Tutup kasir memakai periode layar | Snapshot penutupan selalu memakai hari ini, termasuk saldo awal. |
| Transaksi masih bisa dicatat ketika lapak tutup | Penjualan dan setoran diblokir sampai lapak dibuka kembali. |
| Struk terakhir memilih catatan awal contoh | Struk dipilih dari tanggal dan jam transaksi terbaru. |
| Semua hasil cetak dibatasi lebar thermal | Cetak buku bon dipisahkan dari lebar thermal. |
| CSV rawan formula pada teks pengguna | Awalan formula dinetralkan dan tanda kutip di-escape. |
| Jam atau tanggal dapat mengikuti zona perangkat | Jam transaksi dan tanggal operasi memakai Asia/Jakarta. |
| Klaim koneksi Bluetooth tidak sesuai kemampuan | Label menjadi cetak struk melalui browser; timbangan dinyatakan manual. |

## Susunan paket

Satu folder aplikasi aktif disediakan agar file index.html yang dibuka tidak tertukar. Data CSV, notebook, Python, SQL, gambar analisis, dan data.json tetap dipertahankan. Dokumentasi analisis lama disimpan sebagai README_ANALISIS_ASLI.md dan DESIGN_ASLI.md. Data uji hanya berada pada browser pemeriksaan, tidak dimasukkan ke file aplikasi.
