/**
 * Implementasi transformasi skala untuk objek 2D
 */
class Skala {
  /**
   * Melakukan skala pada titik
   * @param {number} x - Koordinat x titik
   * @param {number} y - Koordinat y titik
   * @param {number} sx - Faktor skala pada sumbu x
   * @param {number} sy - Faktor skala pada sumbu y
   * @param {number} xPusat - Koordinat x titik pusat skala (default: 0)
   * @param {number} yPusat - Koordinat y titik pusat skala (default: 0)
   * @returns {Object} Titik hasil skala
   */
  static titik(x, y, sx, sy, xPusat = 0, yPusat = 0) {
    // Translasi ke titik pusat
    const tx = x - xPusat;
    const ty = y - yPusat;

    // Skala
    const xBaru = tx * sx + xPusat;
    const yBaru = ty * sy + yPusat;

    return {
      x: xBaru,
      y: yBaru,
    };
  }

  /**
   * Melakukan skala pada array titik-titik
   * @param {Array} titik - Array titik-titik [[x1,y1], [x2,y2], ...]
   * @param {number} sx - Faktor skala pada sumbu x
   * @param {number} sy - Faktor skala pada sumbu y
   * @param {number} xPusat - Koordinat x titik pusat skala (default: 0)
   * @param {number} yPusat - Koordinat y titik pusat skala (default: 0)
   * @returns {Array} Array titik-titik hasil skala
   */
  static arrayTitik(titik, sx, sy, xPusat = 0, yPusat = 0) {
    return titik.map(([x, y]) => {
      const hasil = this.titik(x, y, sx, sy, xPusat, yPusat);
      return [hasil.x, hasil.y];
    });
  }

  /**
   * Melakukan skala pada objek
   * @param {Object} objek - Objek yang akan diskala
   * @param {number} sx - Faktor skala pada sumbu x
   * @param {number} sy - Faktor skala pada sumbu y
   * @param {number} xPusat - Koordinat x titik pusat skala (default: titik pusat objek)
   * @param {number} yPusat - Koordinat y titik pusat skala (default: titik pusat objek)
   */
  static objek(objek, sx, sy, xPusat = null, yPusat = null) {
    // Jika titik pusat tidak ditentukan, gunakan titik pusat objek
    if (xPusat === null || yPusat === null) {
      if (objek.jenis === "titik") {
        xPusat = objek.x;
        yPusat = objek.y;
      } else if (objek.jenis === "garis") {
        xPusat = (objek.x1 + objek.x2) / 2;
        yPusat = (objek.y1 + objek.y2) / 2;
      } else if (objek.jenis === "lingkaran" || objek.jenis === "elips") {
        xPusat = objek.x;
        yPusat = objek.y;
      } else if (objek.jenis === "poligon") {
        // Hitung titik pusat poligon
        const sumX = objek.titik.reduce((sum, [x]) => sum + x, 0);
        const sumY = objek.titik.reduce((sum, [_, y]) => sum + y, 0);
        xPusat = sumX / objek.titik.length;
        yPusat = sumY / objek.titik.length;
      }
    }

    // Skala objek berdasarkan jenisnya
    if (objek.jenis === "titik") {
      const hasil = this.titik(objek.x, objek.y, sx, sy, xPusat, yPusat);
      objek.x = hasil.x;
      objek.y = hasil.y;
    } else if (objek.jenis === "garis") {
      const titik1 = this.titik(objek.x1, objek.y1, sx, sy, xPusat, yPusat);
      const titik2 = this.titik(objek.x2, objek.y2, sx, sy, xPusat, yPusat);
      objek.x1 = titik1.x;
      objek.y1 = titik1.y;
      objek.x2 = titik2.x;
      objek.y2 = titik2.y;
    } else if (objek.jenis === "lingkaran") {
      const hasil = this.titik(objek.x, objek.y, sx, sy, xPusat, yPusat);
      objek.x = hasil.x;
      objek.y = hasil.y;
      // Untuk lingkaran, gunakan rata-rata sx dan sy untuk radius
      objek.radius *= (sx + sy) / 2;
    } else if (objek.jenis === "elips") {
      const hasil = this.titik(objek.x, objek.y, sx, sy, xPusat, yPusat);
      objek.x = hasil.x;
      objek.y = hasil.y;
      objek.rx *= sx;
      objek.ry *= sy;
    } else if (objek.jenis === "poligon") {
      objek.titik = this.arrayTitik(objek.titik, sx, sy, xPusat, yPusat);
    }
  }

  /**
   * Mendapatkan matriks skala 3x3
   * @param {number} sx - Faktor skala pada sumbu x
   * @param {number} sy - Faktor skala pada sumbu y
   * @returns {Array} Matriks skala 3x3
   */
  static getMatriks(sx, sy) {
    return [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ];
  }
}
