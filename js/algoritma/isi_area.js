/**
 * Implementasi algoritma Flood Fill untuk mengisi area
 */
class AlgoritmaIsiArea {
  /**
   * Mengisi area menggunakan algoritma Flood Fill
   * @param {CanvasRenderingContext2D} ctx - Context canvas
   * @param {number} x - Koordinat x titik awal
   * @param {number} y - Koordinat y titik awal
   * @param {string} warnaIsi - Warna untuk mengisi area
   * @param {string} warnaBatas - Warna batas area (opsional)
   */
  static floodFill(ctx, x, y, warnaIsi, warnaBatas = null) {
    // Konversi ke integer
    x = Math.round(x);
    y = Math.round(y);

    // Dapatkan data gambar
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const pixels = imageData.data;

    // Dapatkan warna target (warna yang akan diganti)
    const targetColor = this.getPixelColor(pixels, x, y, ctx.canvas.width);
    const fillColor = this.hexToRgb(warnaIsi);

    // Jika warna target sama dengan warna isi, return
    if (this.isSameColor(targetColor, fillColor)) {
      return;
    }

    // Stack untuk menyimpan pixel yang akan diproses
    const stack = [[x, y]];

    while (stack.length > 0) {
      const [currentX, currentY] = stack.pop();

      // Cek apakah pixel valid
      if (
        !this.isValidPixel(
          currentX,
          currentY,
          ctx.canvas.width,
          ctx.canvas.height
        )
      ) {
        continue;
      }

      // Dapatkan warna pixel saat ini
      const currentColor = this.getPixelColor(
        pixels,
        currentX,
        currentY,
        ctx.canvas.width
      );

      // Jika warna tidak sama dengan target atau sama dengan batas, lanjut
      if (!this.isSameColor(currentColor, targetColor)) {
        continue;
      }

      // Jika ada warna batas dan pixel saat ini adalah batas, lanjut
      if (
        warnaBatas &&
        this.isSameColor(currentColor, this.hexToRgb(warnaBatas))
      ) {
        continue;
      }

      // Isi pixel dengan warna baru
      this.setPixelColor(
        pixels,
        currentX,
        currentY,
        fillColor,
        ctx.canvas.width
      );

      // Tambahkan pixel tetangga ke stack
      stack.push([currentX + 1, currentY]);
      stack.push([currentX - 1, currentY]);
      stack.push([currentX, currentY + 1]);
      stack.push([currentX, currentY - 1]);
    }

    // Update canvas dengan data gambar yang baru
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Mengecek apakah koordinat pixel valid
   * @private
   */
  static isValidPixel(x, y, width, height) {
    return x >= 0 && x < width && y >= 0 && y < height;
  }

  /**
   * Mendapatkan warna pixel pada koordinat tertentu
   * @private
   */
  static getPixelColor(pixels, x, y, width) {
    const index = (y * width + x) * 4;
    return {
      r: pixels[index],
      g: pixels[index + 1],
      b: pixels[index + 2],
      a: pixels[index + 3],
    };
  }

  /**
   * Mengatur warna pixel pada koordinat tertentu
   * @private
   */
  static setPixelColor(pixels, x, y, color, width) {
    const index = (y * width + x) * 4;
    pixels[index] = color.r;
    pixels[index + 1] = color.g;
    pixels[index + 2] = color.b;
    pixels[index + 3] = color.a !== undefined ? color.a : 255;
  }

  /**
   * Mengecek apakah dua warna sama
   * @private
   */
  static isSameColor(color1, color2) {
    return (
      color1.r === color2.r &&
      color1.g === color2.g &&
      color1.b === color2.b &&
      (color1.a === color2.a || color2.a === undefined)
    );
  }

  /**
   * Konversi warna hex ke RGB
   * @private
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Mengisi area menggunakan algoritma Boundary Fill
   * @param {CanvasRenderingContext2D} ctx - Context canvas
   * @param {number} x - Koordinat x titik awal
   * @param {number} y - Koordinat y titik awal
   * @param {string} warnaIsi - Warna untuk mengisi area
   * @param {string} warnaBatas - Warna batas area
   */
  static boundaryFill(ctx, x, y, warnaIsi, warnaBatas) {
    // Konversi ke integer
    x = Math.round(x);
    y = Math.round(y);

    // Dapatkan data gambar
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const pixels = imageData.data;

    // Konversi warna
    const fillColor = this.hexToRgb(warnaIsi);
    const boundaryColor = this.hexToRgb(warnaBatas);

    // Stack untuk menyimpan pixel yang akan diproses
    const stack = [[x, y]];

    while (stack.length > 0) {
      const [currentX, currentY] = stack.pop();

      // Cek apakah pixel valid
      if (
        !this.isValidPixel(
          currentX,
          currentY,
          ctx.canvas.width,
          ctx.canvas.height
        )
      ) {
        continue;
      }

      // Dapatkan warna pixel saat ini
      const currentColor = this.getPixelColor(
        pixels,
        currentX,
        currentY,
        ctx.canvas.width
      );

      // Jika pixel adalah batas atau sudah diisi, lanjut
      if (
        this.isSameColor(currentColor, boundaryColor) ||
        this.isSameColor(currentColor, fillColor)
      ) {
        continue;
      }

      // Isi pixel dengan warna baru
      this.setPixelColor(
        pixels,
        currentX,
        currentY,
        fillColor,
        ctx.canvas.width
      );

      // Tambahkan pixel tetangga ke stack
      stack.push([currentX + 1, currentY]);
      stack.push([currentX - 1, currentY]);
      stack.push([currentX, currentY + 1]);
      stack.push([currentX, currentY - 1]);
    }

    // Update canvas dengan data gambar yang baru
    ctx.putImageData(imageData, 0, 0);
  }
}
