/**
 * Implementasi algoritma Midpoint untuk menggambar elips
 */
class AlgoritmaMidpointElips {
  /**
   * Menggambar elips menggunakan algoritma Midpoint
   * @param {CanvasRenderingContext2D} ctx - Context canvas
   * @param {number} xPusat - Koordinat x titik pusat
   * @param {number} yPusat - Koordinat y titik pusat
   * @param {number} rx - Radius x (setengah lebar)
   * @param {number} ry - Radius y (setengah tinggi)
   * @param {string} warnaGaris - Warna garis elips
   * @param {string} warnaIsi - Warna isi elips (opsional)
   * @param {string} jenisGaris - Jenis garis (solid, dashed, dotted, dashdot)
   */
  static gambarElips(
    ctx,
    xPusat,
    yPusat,
    rx,
    ry,
    warnaGaris,
    warnaIsi = null,
    jenisGaris = "solid"
  ) {
    // Konversi ke integer
    xPusat = Math.round(xPusat);
    yPusat = Math.round(yPusat);
    rx = Math.round(rx);
    ry = Math.round(ry);

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

    // Array untuk menyimpan titik-titik elips
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

    // Region 1
    let x = 0;
    let y = ry;
    let d1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;
    let dx = 2 * ry * ry * x;
    let dy = 2 * rx * rx * y;

    while (dx < dy) {
      tambahTitik(xPusat + x, yPusat + y);
      tambahTitik(xPusat - x, yPusat + y);
      tambahTitik(xPusat + x, yPusat - y);
      tambahTitik(xPusat - x, yPusat - y);

      if (d1 < 0) {
        x++;
        dx = dx + 2 * ry * ry;
        d1 = d1 + dx + ry * ry;
      } else {
        x++;
        y--;
        dx = dx + 2 * ry * ry;
        dy = dy - 2 * rx * rx;
        d1 = d1 + dx - dy + ry * ry;
      }
    }

    // Region 2
    let d2 =
      ry * ry * ((x + 0.5) * (x + 0.5)) +
      rx * rx * ((y - 1) * (y - 1)) -
      rx * rx * ry * ry;

    while (y >= 0) {
      tambahTitik(xPusat + x, yPusat + y);
      tambahTitik(xPusat - x, yPusat + y);
      tambahTitik(xPusat + x, yPusat - y);
      tambahTitik(xPusat - x, yPusat - y);

      if (d2 > 0) {
        y--;
        dy = dy - 2 * rx * rx;
        d2 = d2 + rx * rx - dy;
      } else {
        y--;
        x++;
        dx = dx + 2 * ry * ry;
        dy = dy - 2 * rx * rx;
        d2 = d2 + dx - dy + rx * rx;
      }
    }

    // Gambar titik-titik
    if (warnaIsi) {
      // Isi elips
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

    // Gambar garis elips
    ctx.fillStyle = warnaGaris;
    for (const [x, y] of titik) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
}
