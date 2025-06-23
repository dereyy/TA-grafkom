/**
 * Implementasi transformasi rotasi untuk objek 2D
 */
class Rotasi {
  /**
   * Melakukan rotasi pada titik
   * @param {number} x - Koordinat x titik
   * @param {number} y - Koordinat y titik
   * @param {number} sudut - Sudut rotasi dalam derajat
   * @param {number} xPusat - Koordinat x titik pusat rotasi (default: 0)
   * @param {number} yPusat - Koordinat y titik pusat rotasi (default: 0)
   * @returns {Object} Titik hasil rotasi
   */
  static titik(x, y, sudut, xPusat = 0, yPusat = 0) {
    // Konversi sudut ke radian
    const rad = (sudut * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Translasi ke titik pusat
    const tx = x - xPusat;
    const ty = y - yPusat;

    // Rotasi
    const xBaru = tx * cos - ty * sin + xPusat;
    const yBaru = tx * sin + ty * cos + yPusat;

    return {
      x: xBaru,
      y: yBaru,
    };
  }

  /**
   * Melakukan rotasi pada array titik-titik
   * @param {Array} titik - Array titik-titik [[x1,y1], [x2,y2], ...]
   * @param {number} sudut - Sudut rotasi dalam derajat
   * @param {number} xPusat - Koordinat x titik pusat rotasi (default: 0)
   * @param {number} yPusat - Koordinat y titik pusat rotasi (default: 0)
   * @returns {Array} Array titik-titik hasil rotasi
   */
  static arrayTitik(titik, sudut, xPusat = 0, yPusat = 0) {
    return titik.map(([x, y]) => {
      const hasil = this.titik(x, y, sudut, xPusat, yPusat);
      return [hasil.x, hasil.y];
    });
  }

  /**
   * Melakukan rotasi pada objek
   * @param {Object} objek - Objek yang akan dirotasi
   * @param {number} sudut - Sudut rotasi dalam derajat
   * @param {number} xPusat - Koordinat x titik pusat rotasi (default: titik pusat objek)
   * @param {number} yPusat - Koordinat y titik pusat rotasi (default: titik pusat objek)
   */
  static objek(objek, sudut, xPusat = null, yPusat = null) {
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

    // Rotasi objek berdasarkan jenisnya
    if (objek.jenis === "titik") {
      const hasil = this.titik(objek.x, objek.y, sudut, xPusat, yPusat);
      objek.x = hasil.x;
      objek.y = hasil.y;
    } else if (objek.jenis === "garis") {
      const titik1 = this.titik(objek.x1, objek.y1, sudut, xPusat, yPusat);
      const titik2 = this.titik(objek.x2, objek.y2, sudut, xPusat, yPusat);
      objek.x1 = titik1.x;
      objek.y1 = titik1.y;
      objek.x2 = titik2.x;
      objek.y2 = titik2.y;
    } else if (objek.jenis === "lingkaran" || objek.jenis === "elips") {
      const hasil = this.titik(objek.x, objek.y, sudut, xPusat, yPusat);
      objek.x = hasil.x;
      objek.y = hasil.y;
      // Untuk elips, rotasi juga mempengaruhi orientasi
      if (objek.jenis === "elips") {
        objek.sudut = (objek.sudut || 0) + sudut;
      }
    } else if (objek.jenis === "poligon") {
      objek.titik = this.arrayTitik(objek.titik, sudut, xPusat, yPusat);
    }
  }

  /**
   * Mendapatkan matriks rotasi 3x3
   * @param {number} sudut - Sudut rotasi dalam derajat
   * @returns {Array} Matriks rotasi 3x3
   */
  static getMatriks(sudut) {
    const rad = (sudut * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1],
    ];
  }
}
