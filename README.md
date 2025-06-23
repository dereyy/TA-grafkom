# Proyek Paint 2D - Grafika Komputer

Aplikasi Paint 2D sederhana yang dibangun menggunakan HTML5 Canvas, CSS3, dan JavaScript murni. Aplikasi ini dibuat untuk memenuhi tugas mata kuliah Grafika Komputer.

## Fitur

### Algoritma Dasar

- Algoritma DDA (Digital Differential Analyzer) untuk menggambar garis
- Algoritma Bresenham untuk menggambar garis
- Algoritma Midpoint untuk menggambar lingkaran
- Algoritma Midpoint untuk menggambar elips
- Algoritma Flood Fill dan Boundary Fill untuk pengisian area

### Bentuk 2D

- Garis
- Persegi
- Segitiga
- Lingkaran
- Elips
- Jajargenjang
- Trapesium

### Transformasi

- Translasi (perpindahan)
- Rotasi (perputaran)
- Skala (perbesaran/pengecilan)
- Refleksi (pencerminan)
- Shear (pembelokan)

### Pengaturan Garis

- Garis Biasa (Solid Line)
- Garis Putus-putus (Dashed Line)
- Garis Titik-titik (Dotted Line)
- Garis Kombinasi (Dash-dotted Line)

### Warna

- Pengaturan warna garis (stroke)
- Pengaturan warna isi (fill)

### Interaksi

- Pilih/seleksi objek dengan klik
- Drag untuk menggambar
- Duplikasi objek
- Hapus objek
- Reset kanvas

## Cara Penggunaan

1. Buka file `index.html` di browser modern (Chrome, Firefox, Edge, dll)
2. Pilih bentuk yang ingin digambar dari menu sebelah kiri
3. Klik dan drag pada kanvas untuk menggambar
4. Pilih objek dengan mengklik untuk melakukan transformasi
5. Gunakan panel transformasi untuk mengubah posisi, ukuran, atau orientasi objek
6. Atur warna garis dan isi sesuai keinginan
7. Gunakan tombol aksi untuk menduplikasi atau menghapus objek

## Struktur Folder

```
proyek-paint-2d/
├── index.html
├── css/
│   └── gaya.css
├── js/
│   ├── algoritma/
│   │   ├── dda.js
│   │   ├── bresenham.js
│   │   ├── midpoint_lingkaran.js
│   │   ├── midpoint_elips.js
│   │   └── isi_area.js
│   ├── transformasi/
│   │   ├── translasi.js
│   │   ├── rotasi.js
│   │   ├── skala.js
│   │   ├── refleksi.js
│   │   └── shear.js
│   └── utama.js
└── assets/
    └── ikon/
```

## Teknologi yang Digunakan

- HTML5 Canvas untuk menggambar grafik
- CSS3 untuk styling dan layout
- JavaScript murni (vanilla) untuk logika dan interaksi
- Tidak menggunakan library atau framework eksternal

## Pengembang

[Nama Anda]
[NIM]
[Kelas]

## Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan dapat digunakan secara bebas dengan mencantumkan sumber.
