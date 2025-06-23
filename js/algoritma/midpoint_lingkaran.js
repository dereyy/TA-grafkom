/**
 * Implementasi algoritma Midpoint untuk menggambar lingkaran
 */
class AlgoritmaMidpointLingkaran {
  /**
   * Menggambar lingkaran menggunakan algoritma Midpoint
   * @param {CanvasRenderingContext2D} ctx - Context canvas
   * @param {number} xPusat - Koordinat x titik pusat
   * @param {number} yPusat - Koordinat y titik pusat
   * @param {number} radius - Radius lingkaran
   * @param {string} warnaGaris - Warna garis lingkaran
   * @param {string} warnaIsi - Warna isi lingkaran (opsional)
   * @param {string} jenisGaris - Jenis garis (solid, dashed, dotted, dashdot)
   */
  static gambarLingkaran(
    ctx,
    xPusat,
    yPusat,
    radius,
    warnaGaris,
    warnaIsi = null,
    jenisGaris = "solid"
  ) {
    // Konversi ke integer
    xPusat = Math.round(xPusat);
    yPusat = Math.round(yPusat);
    radius = Math.round(radius);

    // Inisialisasi variabel
    let x = radius;
    let y = 0;
    let p = 1 - radius;

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

    // Array untuk menyimpan titik-titik lingkaran
    const titik = [];

    // Fungsi untuk menambah titik
    const tambahTitik = (x, y) => {
      if (pola === null || gambar) {
        titik.push([x, y]);
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
    };

    // Gambar titik-titik menggunakan simetri lingkaran
    while (x >= y) {
      tambahTitik(xPusat + x, yPusat + y);
      tambahTitik(xPusat - x, yPusat + y);
      tambahTitik(xPusat + x, yPusat - y);
      tambahTitik(xPusat - x, yPusat - y);
      tambahTitik(xPusat + y, yPusat + x);
      tambahTitik(xPusat - y, yPusat + x);
      tambahTitik(xPusat + y, yPusat - x);
      tambahTitik(xPusat - y, yPusat - x);

      y++;

      if (p <= 0) {
        p = p + 2 * y + 1;
      } else {
        x--;
        p = p + 2 * y - 2 * x + 1;
      }
    }

    // Gambar titik-titik
    if (warnaIsi) {
      // Isi lingkaran
      ctx.fillStyle = warnaIsi;
      ctx.beginPath();
      for (let i = 0; i < titik.length; i++) {
        if (i === 0) {
          ctx.moveTo(titik[i][0], titik[i][1]);
        } else {
          ctx.lineTo(titik[i][0], titik[i][1]);
        }
      }
      ctx.fill();
    }

    // Gambar garis lingkaran
    ctx.fillStyle = warnaGaris;
    for (const [x, y] of titik) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
}
