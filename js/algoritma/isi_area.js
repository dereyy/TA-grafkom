/**
 * Kelas yang berisi implementasi algoritma pengisian area.
 */
class AlgoritmaIsiArea {
  /**
   * Mengkonversi warna dari format hex ke RGB.
   * @param {string} hex - Warna dalam format hex (#RRGGBB)
   * @returns {number[]} Array berisi nilai RGB [r, g, b]
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  }

  /**
   * Mengisi area dengan algoritma boundary fill.
   * @param {CanvasRenderingContext2D} ctx - Konteks canvas 2D
   * @param {number} x - Koordinat x titik awal
   * @param {number} y - Koordinat y titik awal
   * @param {string} warnaIsi - Warna yang akan digunakan untuk mengisi area
   * @param {string} warnaBatas - Warna batas area yang akan diisi
   */
  static boundaryFill(ctx, x, y, warnaIsi, warnaBatas) {
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const pixels = imageData.data;
    const canvasWidth = ctx.canvas.width;

    const warnaIsiRgb = this.hexToRgb(warnaIsi);
    const warnaBatasRgb = this.hexToRgb(warnaBatas);

    // Jangan proses jika warna isi sama dengan warna batas
    if (warnaIsiRgb.every((val, i) => val === warnaBatasRgb[i])) {
      return;
    }

    const stack = [[x, y]];

    const getPixel = (px, py) => {
      const index = (py * canvasWidth + px) * 4;
      return [
        pixels[index],
        pixels[index + 1],
        pixels[index + 2],
        pixels[index + 3],
      ];
    };

    const setPixel = (px, py) => {
      const index = (py * canvasWidth + px) * 4;
      pixels[index] = warnaIsiRgb[0];
      pixels[index + 1] = warnaIsiRgb[1];
      pixels[index + 2] = warnaIsiRgb[2];
      pixels[index + 3] = 255;
    };

    const isSameColor = (c1, c2, tolerance = 15) => {
      return (
        Math.abs(c1[0] - c2[0]) <= tolerance &&
        Math.abs(c1[1] - c2[1]) <= tolerance &&
        Math.abs(c1[2] - c2[2]) <= tolerance
      );
    };

    while (stack.length > 0) {
      const [px, py] = stack.pop();

      if (px < 0 || px >= canvasWidth || py < 0 || py >= ctx.canvas.height) {
        continue;
      }

      const currentColor = getPixel(px, py);

      // Anggap batas jika alpha > 0 dan warnanya cocok
      const isBoundary =
        currentColor[3] > 0 && isSameColor(currentColor, warnaBatasRgb);
      // Anggap sudah diisi jika alpha = 255 dan warnanya cocok
      const isFilled =
        currentColor[3] === 255 && isSameColor(currentColor, warnaIsiRgb);

      if (!isBoundary && !isFilled) {
        setPixel(px, py);
        stack.push([px + 1, py]);
        stack.push([px - 1, py]);
        stack.push([px, py + 1]);
        stack.push([px, py - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Mengisi area dengan algoritma flood fill.
   * @param {CanvasRenderingContext2D} ctx - Konteks canvas 2D
   * @param {number} x - Koordinat x titik awal
   * @param {number} y - Koordinat y titik awal
   * @param {string} warnaIsi - Warna yang akan digunakan untuk mengisi area
   */
  static floodFill(ctx, x, y, warnaIsi) {
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const pixels = imageData.data;
    const canvasWidth = ctx.canvas.width;

    const warnaIsiRgb = this.hexToRgb(warnaIsi);

    const getPixel = (px, py) => {
      const index = (py * canvasWidth + px) * 4;
      return [
        pixels[index],
        pixels[index + 1],
        pixels[index + 2],
        pixels[index + 3],
      ];
    };

    const warnaAwal = getPixel(x, y);

    // Jangan proses jika warna awal sama dengan warna isi
    if (
      warnaAwal[0] === warnaIsiRgb[0] &&
      warnaAwal[1] === warnaIsiRgb[1] &&
      warnaAwal[2] === warnaIsiRgb[2] &&
      warnaAwal[3] === 255
    ) {
      return;
    }

    // Jangan proses jika titik awal adalah garis (opaque, tapi bukan warna isi)
    if (warnaAwal[3] === 255 && !this.isSameColor(warnaAwal, warnaIsiRgb)) {
      // Ini mungkin garis batas, jangan lakukan apa-apa
      return;
    }

    const stack = [[x, y]];

    const setPixel = (px, py) => {
      const index = (py * canvasWidth + px) * 4;
      pixels[index] = warnaIsiRgb[0];
      pixels[index + 1] = warnaIsiRgb[1];
      pixels[index + 2] = warnaIsiRgb[2];
      pixels[index + 3] = 255;
    };

    const isSameColor = (c1, c2, tolerance = 10) => {
      return (
        Math.abs(c1[0] - c2[0]) <= tolerance &&
        Math.abs(c1[1] - c2[1]) <= tolerance &&
        Math.abs(c1[2] - c2[2]) <= tolerance &&
        Math.abs((c1[3] || 255) - (c2[3] || 255)) <= tolerance
      );
    };

    while (stack.length > 0) {
      const [px, py] = stack.pop();

      if (px < 0 || px >= canvasWidth || py < 0 || py >= ctx.canvas.height) {
        continue;
      }

      const currentColor = getPixel(px, py);

      if (isSameColor(currentColor, warnaAwal)) {
        setPixel(px, py);
        stack.push([px + 1, py]);
        stack.push([px - 1, py]);
        stack.push([px, py + 1]);
        stack.push([px, py - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  // Helper untuk floodFill
  static isSameColor(c1, c2, tolerance = 10) {
    return (
      Math.abs(c1[0] - c2[0]) <= tolerance &&
      Math.abs(c1[1] - c2[1]) <= tolerance &&
      Math.abs(c1[2] - c2[2]) <= tolerance &&
      Math.abs((c1[3] || 255) - (c2[3] || 255)) <= tolerance
    );
  }
}
