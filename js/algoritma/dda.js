/**
 * Implementasi algoritma DDA (Digital Differential Analyzer)
 * untuk menggambar garis pada canvas
 */
class AlgoritmaDDA {
  /**
   * Menggambar garis menggunakan algoritma DDA
   * @param {CanvasRenderingContext2D} ctx - Context canvas
   * @param {number} x1 - Koordinat x titik awal
   * @param {number} y1 - Koordinat y titik awal
   * @param {number} x2 - Koordinat x titik akhir
   * @param {number} y2 - Koordinat y titik akhir
   * @param {string} warna - Warna garis
   * @param {string} jenisGaris - Jenis garis (solid, dashed, dotted, dashdot)
   */
  static gambarGaris(ctx, x1, y1, x2, y2, warna, jenisGaris = "solid") {
    // Hitung perbedaan koordinat
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Tentukan jumlah langkah berdasarkan delta yang lebih besar
    const langkah = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

    // Hitung increment untuk setiap langkah
    const xIncrement = dx / langkah;
    const yIncrement = dy / langkah;

    // Inisialisasi koordinat awal
    let x = x1;
    let y = y1;

    // Pola garis
    let pola;
    switch (jenisGaris) {
      case "dashed":
        pola = [5, 5]; // 5 pixel on, 5 pixel off
        break;
      case "dotted":
        pola = [2, 2]; // 2 pixel on, 2 pixel off
        break;
      case "dashdot":
        pola = [5, 2, 2, 2]; // 5 on, 2 off, 2 on, 2 off
        break;
      default:
        pola = null; // Solid line
    }

    let indeksPola = 0;
    let hitungPola = 0;
    let gambar = true;

    // Set warna
    ctx.fillStyle = warna;

    // Gambar pixel untuk setiap langkah
    for (let i = 0; i <= langkah; i++) {
      if (pola === null || gambar) {
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      }

      // Update posisi
      x += xIncrement;
      y += yIncrement;

      // Update pola garis jika bukan solid
      if (pola !== null) {
        hitungPola++;
        if (hitungPola >= pola[indeksPola]) {
          hitungPola = 0;
          indeksPola = (indeksPola + 1) % pola.length;
          gambar = !gambar;
        }
      }
    }
  }
}
