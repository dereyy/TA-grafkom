/**
 * Implementasi algoritma Bresenham
 * untuk menggambar garis pada canvas
 */
class AlgoritmaBresenham {
  /**
   * Menggambar garis menggunakan algoritma Bresenham
   * @param {CanvasRenderingContext2D} ctx - Context canvas
   * @param {number} x1 - Koordinat x titik awal
   * @param {number} y1 - Koordinat y titik awal
   * @param {number} x2 - Koordinat x titik akhir
   * @param {number} y2 - Koordinat y titik akhir
   * @param {string} warna - Warna garis
   * @param {string} jenisGaris - Jenis garis (solid, dashed, dotted, dashdot)
   */
  static gambarGaris(ctx, x1, y1, x2, y2, warna, jenisGaris = "solid") {
    // Konversi ke integer
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    x2 = Math.round(x2);
    y2 = Math.round(y2);

    // Hitung delta
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    // Tentukan arah
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;

    // Inisialisasi error
    let err = dx - dy;

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

    // Koordinat saat ini
    let x = x1;
    let y = y1;

    while (true) {
      if (pola === null || gambar) {
        ctx.fillRect(x, y, 1, 1);
      }

      // Update pola garis jika bukan solid
      if (pola !== null) {
        hitungPola++;
        if (hitungPola >= pola[indeksPola]) {
          hitungPola = 0;
          indeksPola = (indeksPola + 1) % pola.length;
          gambar = !gambar;
        }
      }

      // Cek apakah sudah sampai titik akhir
      if (x === x2 && y === y2) break;

      // Hitung error berikutnya
      const e2 = 2 * err;

      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }

      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }
}
