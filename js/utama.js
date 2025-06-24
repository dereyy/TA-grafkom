/**
 * File JavaScript utama untuk aplikasi Paint 2D
 */

// Inisialisasi variabel global
let kanvas;
let ctx;
let objekTerpilih = null;
let objekList = [];
let sedangMenggambar = false;
let titikAwal = { x: 0, y: 0 };
let jenisObjek = "garis";
let algoritmaGaris = "dda";
let jenisGaris = "solid";
let warnaGaris = "#000000";
let warnaIsi = "#ffffff";
let mode = "gambar"; // Mode: 'gambar', 'isi', atau 'pilih'
let isiAreaAktif = false;

// Fungsi inisialisasi
function init() {
  // Inisialisasi kanvas
  kanvas = document.getElementById("kanvas");
  ctx = kanvas.getContext("2d");

  // Set ukuran kanvas
  kanvas.width = window.innerWidth - 380; // Sesuaikan dengan lebar sidebar baru
  kanvas.height = window.innerHeight - 40;

  // Event listener untuk resize window
  window.addEventListener("resize", () => {
    kanvas.width = window.innerWidth - 380;
    kanvas.height = window.innerHeight - 40;
    gambarUlangSemuaObjek();
  });

  // Event listener untuk pilihan algoritma
  document.getElementById("pilihAlgoritma").addEventListener("change", (e) => {
    algoritmaGaris = e.target.value;
  });

  // Event listener untuk jenis garis
  document.getElementById("jenisGaris").addEventListener("change", (e) => {
    jenisGaris = e.target.value;
    if (objekTerpilih) {
      objekTerpilih.jenisGaris = jenisGaris;
      gambarUlangSemuaObjek();
    }
  });

  // Event listener untuk warna
  document.getElementById("warnaGaris").addEventListener("change", (e) => {
    warnaGaris = e.target.value;
    if (objekTerpilih) {
      objekTerpilih.warnaGaris = warnaGaris;
      gambarUlangSemuaObjek();
    }
  });

  document.getElementById("warnaIsi").addEventListener("change", (e) => {
    warnaIsi = e.target.value;
    if (objekTerpilih) {
      objekTerpilih.warnaIsi = warnaIsi;
      gambarUlangSemuaObjek();
    }
  });

  // Event listener untuk aksi
  document.getElementById("btnDuplikat").addEventListener("click", () => {
    if (objekTerpilih) {
      const objekBaru = { ...objekTerpilih };
      if (objekBaru.jenis === "poligon") {
        objekBaru.titik = [...objekTerpilih.titik];
      }
      objekList.push(objekBaru);
      Translasi.objek(objekBaru, 20, 20); // Geser sedikit agar terlihat
      gambarUlangSemuaObjek();
    }
  });

  document.getElementById("btnHapus").addEventListener("click", () => {
    if (objekTerpilih) {
      const index = objekList.indexOf(objekTerpilih);
      if (index > -1) {
        objekList.splice(index, 1);
        objekTerpilih = null;
        gambarUlangSemuaObjek();
      }
    }
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    objekList = [];
    objekTerpilih = null;
    ctx.clearRect(0, 0, kanvas.width, kanvas.height);
  });

  // Tambahkan event listener untuk mode isi area
  const btnModeIsi = document.getElementById("btnModeIsi");
  const btnNonaktifIsi = document.getElementById("btnNonaktifIsi");
  if (btnModeIsi && btnNonaktifIsi) {
    btnModeIsi.addEventListener("click", () => {
      isiAreaAktif = true;
      mode = "isi";
      kanvas.style.cursor = "cell";
      btnModeIsi.style.display = "none";
      btnNonaktifIsi.style.display = "";
    });
    btnNonaktifIsi.addEventListener("click", () => {
      isiAreaAktif = false;
      mode = "gambar";
      kanvas.style.cursor = "crosshair";
      btnModeIsi.style.display = "";
      btnNonaktifIsi.style.display = "none";
    });
  }

  // Event listener untuk kanvas
  kanvas.addEventListener("mousedown", (e) => {
    if (mode === "gambar") {
      mulaiMenggambar(e);
    } else if (mode === "isi") {
      isiArea(e);
    }
  });
  kanvas.addEventListener("mousemove", sedangMenggambarObjek);
  kanvas.addEventListener("mouseup", selesaiMenggambar);
  kanvas.addEventListener("click", pilihObjek);

  // Tambahan: Dynamic Dropdown dan Form Transformasi
  setupDropdownsAndDynamicForm();

  // Event listener dropdown bentuk
  const dropdownBentuk = document.getElementById("dropdownBentuk");
  if (dropdownBentuk) {
    jenisObjek = dropdownBentuk.value;
    dropdownBentuk.addEventListener("change", (e) => {
      jenisObjek = e.target.value;
    });
  }
}

// Fungsi untuk memulai menggambar
function mulaiMenggambar(e) {
  sedangMenggambar = true;
  kanvas.style.cursor = "grabbing";
  const rect = kanvas.getBoundingClientRect();
  titikAwal.x = e.clientX - rect.left;
  titikAwal.y = e.clientY - rect.top;
}

// Fungsi untuk menggambar objek saat mouse bergerak
function sedangMenggambarObjek(e) {
  if (!sedangMenggambar) return;

  const rect = kanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  gambarUlangSemuaObjek();

  switch (jenisObjek) {
    case "garis":
      if (algoritmaGaris === "dda") {
        AlgoritmaDDA.gambarGaris(
          ctx,
          titikAwal.x,
          titikAwal.y,
          x,
          y,
          warnaGaris,
          jenisGaris
        );
      } else {
        AlgoritmaBresenham.gambarGaris(
          ctx,
          titikAwal.x,
          titikAwal.y,
          x,
          y,
          warnaGaris,
          jenisGaris
        );
      }
      break;

    case "persegi":
      gambarPersegi(titikAwal.x, titikAwal.y, x - titikAwal.x, y - titikAwal.y);
      break;

    case "segitiga":
      gambarSegitiga(titikAwal.x, titikAwal.y, x, y);
      break;

    case "lingkaran":
      const radius = Math.sqrt(
        Math.pow(x - titikAwal.x, 2) + Math.pow(y - titikAwal.y, 2)
      );
      AlgoritmaMidpointLingkaran.gambarLingkaran(
        ctx,
        titikAwal.x,
        titikAwal.y,
        radius,
        warnaGaris,
        warnaIsi,
        jenisGaris
      );
      break;

    case "elips":
      const rx = Math.abs(x - titikAwal.x);
      const ry = Math.abs(y - titikAwal.y);
      AlgoritmaMidpointElips.gambarElips(
        ctx,
        titikAwal.x,
        titikAwal.y,
        rx,
        ry,
        warnaGaris,
        warnaIsi,
        jenisGaris
      );
      break;

    case "jajargenjang":
      gambarJajargenjang(titikAwal.x, titikAwal.y, x, y);
      break;

    case "trapesium":
      gambarTrapesium(titikAwal.x, titikAwal.y, x, y);
      break;
  }
}

// Fungsi untuk menyelesaikan menggambar
function selesaiMenggambar(e) {
  if (!sedangMenggambar) return;

  const rect = kanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  let objekBaru;
  switch (jenisObjek) {
    case "garis":
      objekBaru = {
        jenis: "garis",
        x1: titikAwal.x,
        y1: titikAwal.y,
        x2: x,
        y2: y,
        warnaGaris,
        jenisGaris,
      };
      break;

    case "persegi":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikPersegi(
          titikAwal.x,
          titikAwal.y,
          x - titikAwal.x,
          y - titikAwal.y
        ),
        warnaGaris,
        warnaIsi,
        jenisGaris,
      };
      break;

    case "segitiga":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikSegitiga(titikAwal.x, titikAwal.y, x, y),
        warnaGaris,
        warnaIsi,
        jenisGaris,
      };
      break;

    case "lingkaran":
      const radius = Math.sqrt(
        Math.pow(x - titikAwal.x, 2) + Math.pow(y - titikAwal.y, 2)
      );
      objekBaru = {
        jenis: "lingkaran",
        x: titikAwal.x,
        y: titikAwal.y,
        radius,
        warnaGaris,
        warnaIsi,
        jenisGaris,
      };
      break;

    case "elips":
      objekBaru = {
        jenis: "elips",
        x: titikAwal.x,
        y: titikAwal.y,
        rx: Math.abs(x - titikAwal.x),
        ry: Math.abs(y - titikAwal.y),
        sudut: 0,
        warnaGaris,
        warnaIsi,
        jenisGaris,
      };
      break;

    case "jajargenjang":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikJajargenjang(titikAwal.x, titikAwal.y, x, y),
        warnaGaris,
        warnaIsi,
        jenisGaris,
      };
      break;

    case "trapesium":
      objekBaru = {
        jenis: "poligon",
        titik: hitungTitikTrapesium(titikAwal.x, titikAwal.y, x, y),
        warnaGaris,
        warnaIsi,
        jenisGaris,
      };
      break;
  }

  if (objekBaru) {
    objekList.push(objekBaru);
    objekTerpilih = objekBaru;
  }

  sedangMenggambar = false;
  kanvas.style.cursor = "crosshair";
  gambarUlangSemuaObjek();
}

// Fungsi untuk memilih objek
function pilihObjek(e) {
  if (sedangMenggambar) return;

  const rect = kanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Cari objek yang diklik
  for (let i = objekList.length - 1; i >= 0; i--) {
    const objek = objekList[i];
    if (apakahTitikDalamObjek(x, y, objek)) {
      objekTerpilih = objek;
      gambarUlangSemuaObjek();
      return;
    }
  }

  objekTerpilih = null;
  gambarUlangSemuaObjek();
}

// Fungsi untuk mengecek apakah titik berada dalam objek
function apakahTitikDalamObjek(x, y, objek) {
  switch (objek.jenis) {
    case "garis":
      const jarak = jarakTitikKeGaris(
        x,
        y,
        objek.x1,
        objek.y1,
        objek.x2,
        objek.y2
      );
      return jarak < 5; // Toleransi 5 pixel

    case "lingkaran":
      const jarakKePusat = Math.sqrt(
        Math.pow(x - objek.x, 2) + Math.pow(y - objek.y, 2)
      );
      return Math.abs(jarakKePusat - objek.radius) < 5;

    case "elips":
      // Transformasi titik ke koordinat relatif terhadap pusat elips
      const cosA = Math.cos((-objek.sudut * Math.PI) / 180);
      const sinA = Math.sin((-objek.sudut * Math.PI) / 180);
      const xt = cosA * (x - objek.x) - sinA * (y - objek.y);
      const yt = sinA * (x - objek.x) + cosA * (y - objek.y);
      // Cek apakah titik berada dekat dengan kurva elips
      const jarakRelatif = Math.abs(
        (xt * xt) / (objek.rx * objek.rx) +
          (yt * yt) / (objek.ry * objek.ry) -
          1
      );
      return jarakRelatif < 0.1;

    case "poligon":
      return apakahTitikDalamPoligon(x, y, objek.titik);
  }
  return false;
}

// Fungsi untuk menghitung jarak titik ke garis
function jarakTitikKeGaris(x, y, x1, y1, x2, y2) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  const param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

// Fungsi untuk mengecek apakah titik berada dalam poligon
function apakahTitikDalamPoligon(x, y, titik) {
  let inside = false;
  for (let i = 0, j = titik.length - 1; i < titik.length; j = i++) {
    const xi = titik[i][0],
      yi = titik[i][1];
    const xj = titik[j][0],
      yj = titik[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Fungsi untuk menghitung titik-titik persegi
function hitungTitikPersegi(x, y, width, height) {
  return [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
}

// Fungsi untuk menghitung titik-titik segitiga
function hitungTitikSegitiga(x1, y1, x2, y2) {
  const x3 = x1 - (x2 - x1); // Titik ketiga segitiga sama kaki
  return [
    [x1, y1],
    [x2, y2],
    [x3, y2],
  ];
}

// Fungsi untuk menghitung titik-titik jajargenjang
function hitungTitikJajargenjang(x1, y1, x2, y2) {
  const offset = (x2 - x1) / 3; // Offset untuk kemiringan
  return [
    [x1 + offset, y1],
    [x2 + offset, y1],
    [x2, y2],
    [x1, y2],
  ];
}

// Fungsi untuk menghitung titik-titik trapesium
function hitungTitikTrapesium(x1, y1, x2, y2) {
  const offset = (x2 - x1) / 4; // Offset untuk sisi atas yang lebih pendek
  return [
    [x1 + offset, y1],
    [x2 - offset, y1],
    [x2, y2],
    [x1, y2],
  ];
}

// Fungsi untuk menggambar persegi
function gambarPersegi(x, y, width, height) {
  const titik = hitungTitikPersegi(x, y, width, height);
  gambarPoligon(titik);
}

// Fungsi untuk menggambar segitiga
function gambarSegitiga(x1, y1, x2, y2) {
  const titik = hitungTitikSegitiga(x1, y1, x2, y2);
  gambarPoligon(titik);
}

// Fungsi untuk menggambar jajargenjang
function gambarJajargenjang(x1, y1, x2, y2) {
  const titik = hitungTitikJajargenjang(x1, y1, x2, y2);
  gambarPoligon(titik);
}

// Fungsi untuk menggambar trapesium
function gambarTrapesium(x1, y1, x2, y2) {
  const titik = hitungTitikTrapesium(x1, y1, x2, y2);
  gambarPoligon(titik);
}

// Fungsi untuk menggambar poligon
function gambarPoligon(titik) {
  // Gambar isi poligon jika ada warna isi
  if (warnaIsi) {
    ctx.fillStyle = warnaIsi;
    ctx.beginPath();
    ctx.moveTo(titik[0][0], titik[0][1]);
    for (let i = 1; i < titik.length; i++) {
      ctx.lineTo(titik[i][0], titik[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Gambar garis poligon
  for (let i = 0; i < titik.length; i++) {
    const j = (i + 1) % titik.length;
    if (algoritmaGaris === "dda") {
      AlgoritmaDDA.gambarGaris(
        ctx,
        titik[i][0],
        titik[i][1],
        titik[j][0],
        titik[j][1],
        warnaGaris,
        jenisGaris
      );
    } else {
      AlgoritmaBresenham.gambarGaris(
        ctx,
        titik[i][0],
        titik[i][1],
        titik[j][0],
        titik[j][1],
        warnaGaris,
        jenisGaris
      );
    }
  }
}

// Fungsi untuk menggambar ulang semua objek
function gambarUlangSemuaObjek() {
  ctx.clearRect(0, 0, kanvas.width, kanvas.height);

  for (const objek of objekList) {
    if (objek === objekTerpilih) {
      // Gambar highlight untuk objek terpilih
      const warnaAsli = objek.warnaGaris;
      objek.warnaGaris = "#ff0000";
      gambarObjek(objek);
      objek.warnaGaris = warnaAsli;
    } else {
      gambarObjek(objek);
    }
  }
}

// Fungsi untuk menggambar objek
function gambarObjek(objek) {
  switch (objek.jenis) {
    case "garis":
      if (algoritmaGaris === "dda") {
        AlgoritmaDDA.gambarGaris(
          ctx,
          objek.x1,
          objek.y1,
          objek.x2,
          objek.y2,
          objek.warnaGaris,
          objek.jenisGaris
        );
      } else {
        AlgoritmaBresenham.gambarGaris(
          ctx,
          objek.x1,
          objek.y1,
          objek.x2,
          objek.y2,
          objek.warnaGaris,
          objek.jenisGaris
        );
      }
      break;

    case "lingkaran":
      AlgoritmaMidpointLingkaran.gambarLingkaran(
        ctx,
        objek.x,
        objek.y,
        objek.radius,
        objek.warnaGaris,
        objek.warnaIsi,
        objek.jenisGaris
      );
      break;

    case "elips":
      AlgoritmaMidpointElips.gambarElips(
        ctx,
        objek.x,
        objek.y,
        objek.rx,
        objek.ry,
        objek.warnaGaris,
        objek.warnaIsi,
        objek.jenisGaris
      );
      break;

    case "poligon":
      // Gambar isi poligon jika ada warna isi
      if (objek.warnaIsi) {
        ctx.fillStyle = objek.warnaIsi;
        ctx.beginPath();
        ctx.moveTo(objek.titik[0][0], objek.titik[0][1]);
        for (let i = 1; i < objek.titik.length; i++) {
          ctx.lineTo(objek.titik[i][0], objek.titik[i][1]);
        }
        ctx.closePath();
        ctx.fill();
      }

      // Gambar garis poligon
      for (let i = 0; i < objek.titik.length; i++) {
        const j = (i + 1) % objek.titik.length;
        if (algoritmaGaris === "dda") {
          AlgoritmaDDA.gambarGaris(
            ctx,
            objek.titik[i][0],
            objek.titik[i][1],
            objek.titik[j][0],
            objek.titik[j][1],
            objek.warnaGaris,
            objek.jenisGaris
          );
        } else {
          AlgoritmaBresenham.gambarGaris(
            ctx,
            objek.titik[i][0],
            objek.titik[i][1],
            objek.titik[j][0],
            objek.titik[j][1],
            objek.warnaGaris,
            objek.jenisGaris
          );
        }
      }
      break;
  }
}

// Tambahan: Dynamic Dropdown dan Form Transformasi
function setupDropdownsAndDynamicForm() {
  // Dropdown bentuk
  const dropdownBentuk = document.getElementById("dropdownBentuk");
  const dropdownAlgoritma = document.getElementById("pilihAlgoritma");
  function updateAlgoritmaDropdown() {
    if (!dropdownAlgoritma) return;
    if (jenisObjek === "garis") {
      dropdownAlgoritma.style.display = "";
      dropdownAlgoritma.innerHTML = `
        <option value="dda">DDA</option>
        <option value="bresenham">Bresenham</option>
      `;
    } else if (jenisObjek === "elips") {
      dropdownAlgoritma.style.display = "";
      dropdownAlgoritma.innerHTML = `
        <option value="midpoint">Midpoint</option>
        <option value="simetris4">Simetris 4 Titik</option>
      `;
    } else if (jenisObjek === "lingkaran") {
      dropdownAlgoritma.style.display = "";
      dropdownAlgoritma.innerHTML = `
        <option value="midpoint">Midpoint</option>
        <option value="simetris4">Simetris 4 Titik</option>
        <option value="simetris8">Simetris 8 Titik</option>
      `;
    } else {
      dropdownAlgoritma.style.display = "none";
    }
  }
  if (dropdownBentuk) {
    jenisObjek = dropdownBentuk.value;
    updateAlgoritmaDropdown();
    dropdownBentuk.addEventListener("change", (e) => {
      jenisObjek = e.target.value;
      updateAlgoritmaDropdown();
    });
  }
  // Dropdown transformasi
  const dropdownTransformasi = document.getElementById("dropdownTransformasi");
  const formTransformasi = document.getElementById("formTransformasi");
  function tampilkanFormTransformasi() {
    const jenis = dropdownTransformasi.value;
    let html = "";
    if (jenis === "rotasi") {
      html = `
        <div class="transformasi-group">
            <h3>Rotasi</h3>
            <div class="input-group">
                <label>Sudut (°):</label>
                <input type="number" id="sudutRotasi" value="0">
            </div>
            <div class="input-group">
                <label>Arah:</label>
                <select id="arahRotasi">
                    <option value="cw">Searah Jarum Jam</option>
                    <option value="ccw">Berlawanan Jarum Jam</option>
                </select>
            </div>
            <button id="btnRotasi">Terapkan Rotasi</button>
        </div>
    `;
    } else if (jenis === "skala") {
      html = `
        <div class="transformasi-group">
            <h3>Skala</h3>
            <div class="input-group">
                <label>Skala:</label>
                <input type="number" id="skalaX" value="1" step="0.1">
            </div>
            <button id="btnSkala">Terapkan Skala</button>
        </div>
    `;
    } else if (jenis === "translasi") {
      html = `
            <div class="transformasi-group">
                <div class="input-panah-dpad">
                    <button id="panahAtas" title="Atas">&#8593;</button>
                </div>
                <div class="input-panah-dpad">
                    <button id="panahKiri" title="Kiri">&#8592;</button>
                    <span class="dpad-center"></span>
                    <button id="panahKanan" title="Kanan">&#8594;</button>
                </div>
                <div class="input-panah-dpad">
                    <button id="panahBawah" title="Bawah">&#8595;</button>
                </div>
            </div>
        `;
    }
    formTransformasi.innerHTML = html;
    pasangEventFormTransformasi();
  }
  dropdownTransformasi.addEventListener("change", tampilkanFormTransformasi);
  tampilkanFormTransformasi();
}

function pasangEventFormTransformasi() {
  // Rotasi
  const btnRotasi = document.getElementById("btnRotasi");
  if (btnRotasi) {
    btnRotasi.addEventListener("click", () => {
      if (objekTerpilih) {
        let sudut =
          parseFloat(document.getElementById("sudutRotasi").value) || 0;
        const arah = document.getElementById("arahRotasi").value;
        if (arah === "ccw") sudut = -sudut;
        Rotasi.objek(objekTerpilih, sudut);
        gambarUlangSemuaObjek();
      }
    });
  }
  // Skala
  const btnSkala = document.getElementById("btnSkala");
  if (btnSkala) {
    btnSkala.addEventListener("click", () => {
      if (objekTerpilih) {
        const s = parseFloat(document.getElementById("skalaX").value) || 1;
        Skala.objek(objekTerpilih, s, s);
        gambarUlangSemuaObjek();
      }
    });
  }
  // Translasi tombol panah
  const panahKiri = document.getElementById("panahKiri");
  const panahKanan = document.getElementById("panahKanan");
  const panahAtas = document.getElementById("panahAtas");
  const panahBawah = document.getElementById("panahBawah");
  if (panahKiri)
    panahKiri.addEventListener("click", () => translasiObjek(-10, 0));
  if (panahKanan)
    panahKanan.addEventListener("click", () => translasiObjek(10, 0));
  if (panahAtas)
    panahAtas.addEventListener("click", () => translasiObjek(0, -10));
  if (panahBawah)
    panahBawah.addEventListener("click", () => translasiObjek(0, 10));
}

function translasiObjek(dx, dy) {
  if (objekTerpilih) {
    Translasi.objek(objekTerpilih, dx, dy);
    gambarUlangSemuaObjek();
  }
}

// Keyboard control untuk translasi
window.addEventListener("keydown", (e) => {
  if (!objekTerpilih) return;
  if (document.activeElement.tagName === "INPUT") return;
  switch (e.key) {
    case "ArrowLeft":
      translasiObjek(-10, 0);
      e.preventDefault();
      break;
    case "ArrowRight":
      translasiObjek(10, 0);
      e.preventDefault();
      break;
    case "ArrowUp":
      translasiObjek(0, -10);
      e.preventDefault();
      break;
    case "ArrowDown":
      translasiObjek(0, 10);
      e.preventDefault();
      break;
  }
});

// Fungsi untuk mengisi area pada kanvas
function isiArea(e) {
  const rect = kanvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);
  // Cek semua objek poligon (termasuk persegi, segitiga, poligon umum)
  let found = false;
  for (const objek of objekList) {
    if (
      objek.jenis === "poligon" &&
      apakahTitikDalamPoligon(x, y, objek.titik)
    ) {
      found = true;
      objek.warnaIsi = warnaIsi;
      gambarUlangSemuaObjek();
      break;
    }
  }
  if (!found) {
    alert("Hanya bisa mengisi di dalam area");
  }
}

// Panggil fungsi init saat halaman dimuat
window.addEventListener("load", init);
