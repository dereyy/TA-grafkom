/**
 * Implementasi transformasi translasi untuk objek 2D
 */
class Translasi {
  /**
   * Melakukan translasi pada titik
   * @param {number} x - Koordinat x titik
   * @param {number} y - Koordinat y titik
   * @param {number} tx - Translasi pada sumbu x
   * @param {number} ty - Translasi pada sumbu y
   * @returns {Object} Titik hasil translasi
   */
  static titik(x, y, tx, ty) {
    return {
      x: x + tx,
      y: y + ty,
    };
  }

  /**
   * Melakukan translasi pada array titik-titik
   * @param {Array} titik - Array titik-titik [[x1,y1], [x2,y2], ...]
   * @param {number} tx - Translasi pada sumbu x
   * @param {number} ty - Translasi pada sumbu y
   * @returns {Array} Array titik-titik hasil translasi
   */
  static arrayTitik(titik, tx, ty) {
    return titik.map(([x, y]) => [x + tx, y + ty]);
  }

  /**
   * Melakukan translasi pada objek
   * @param {Object} objek - Objek yang akan ditranslasi
   * @param {number} tx - Translasi pada sumbu x
   * @param {number} ty - Translasi pada sumbu y
   */
  static objek(objek, tx, ty) {
    if (objek.jenis === "titik") {
      objek.x += tx;
      objek.y += ty;
    } else if (objek.jenis === "garis") {
      objek.x1 += tx;
      objek.y1 += ty;
      objek.x2 += tx;
      objek.y2 += ty;
    } else if (objek.jenis === "lingkaran" || objek.jenis === "elips") {
      objek.x += tx;
      objek.y += ty;
    } else if (objek.jenis === "poligon") {
      objek.titik = this.arrayTitik(objek.titik, tx, ty);
    }
  }

  /**
   * Mendapatkan matriks translasi 3x3
   * @param {number} tx - Translasi pada sumbu x
   * @param {number} ty - Translasi pada sumbu y
   * @returns {Array} Matriks translasi 3x3
   */
  static getMatriks(tx, ty) {
    return [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1],
    ];
  }
}
