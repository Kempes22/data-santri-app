const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const dataPath = path.join(__dirname, '../data/santri.json');

// Tampilkan daftar santri
exports.viewSantri = (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath));
  let html = `
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Daftar Santri</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container mt-5">
      <h1 class="text-center mb-4">Daftar Santri</h1>
      ${req.query.success ? '<div class="alert alert-success">Data berhasil disimpan!</div>' : ''}
      <form method="POST" action="/api/santri/add" class="mb-4 row g-2">
        <div class="col"><input type="text" name="nama" class="form-control" placeholder="Nama" required></div>
        <div class="col"><input type="text" name="jenjang" class="form-control" placeholder="Jenjang" required></div>
        <div class="col"><input type="text" name="alamat" class="form-control" placeholder="Alamat" required></div>
        <div class="col"><input type="text" name="orangtua" class="form-control" placeholder="Orang Tua" required></div>
        <div class="col"><input type="date" name="tanggallahir" class="form-control" required></div>
        <div class="col"><button type="submit" class="btn btn-success w-100">Tambah</button></div>
      </form>
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr><th>ID</th><th>Nama</th><th>Jenjang</th><th>Alamat</th><th>Orang Tua</th><th>Tanggal Lahir</th><th>Aksi</th></tr>
        </thead>
        <tbody>`;

  data.forEach((s, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td>${s.nama}</td>
      <td>${s.jenjang}</td>
      <td>${s.alamat}</td>
      <td>${s.orangtua}</td>
      <td>${s.tanggallahir}</td>
      <td><a href="/api/santri/edit/${s.id}" class="btn btn-warning btn-sm">Edit</a></td>
    </tr>`;
  });

  html += `
        </tbody>
      </table>
      <a href="/api/santri/export/pdf" class="btn btn-danger">Export PDF</a>
      <a href="/api/santri/export/excel" class="btn btn-success">Export Excel</a>
    </body></html>`;

  res.send(html);
};

// Tambah santri
exports.addSantriForm = (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath));
  const newSantri = {
    id: Date.now(),
    ...req.body
  };
  data.push(newSantri);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.redirect('/api/santri/view?success=1');
};

// Tampilkan form edit
exports.viewEditSantri = (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync(dataPath));
  const santri = data.find(s => s.id === id);
  if (!santri) return res.status(404).send('Santri tidak ditemukan');

  let html = `
    <html><head><title>Edit Santri</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"></head>
    <body class="container mt-5">
      <h2>Edit Data Santri</h2>
      <form method="POST" action="/api/santri/edit/${santri.id}">
        <input type="text" name="nama" value="${santri.nama}" class="form-control mb-2" required />
        <input type="text" name="jenjang" value="${santri.jenjang}" class="form-control mb-2" required />
        <input type="text" name="alamat" value="${santri.alamat}" class="form-control mb-2" required />
        <input type="text" name="orangtua" value="${santri.orangtua}" class="form-control mb-2" required />
        <input type="date" name="tanggallahir" value="${santri.tanggallahir}" class="form-control mb-2" required />
        <button type="submit" class="btn btn-primary">Simpan</button>
        <a href="/api/santri/view" class="btn btn-secondary">Batal</a>
      </form>
    </body></html>`;
  res.send(html);
};

// Simpan hasil edit
exports.updateSantri = (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync(dataPath));
  const index = data.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).send('Santri tidak ditemukan');

  data[index] = { ...data[index], ...req.body };
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.redirect('/api/santri/view?success=1');
};

// Export ke PDF
exports.exportPDF = (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath));
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=santri.pdf');
  doc.pipe(res);

  doc.fontSize(16).text('Daftar Santri', { align: 'center' });
  doc.moveDown();
  data.forEach((s, i) => {
    doc.fontSize(12).text(`${i + 1}. ${s.nama} | ${s.jenjang} | ${s.alamat} | ${s.orangtua} | ${s.tanggallahir}`);
  });

  doc.end();
};

// Export ke Excel
exports.exportExcel = async (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath));
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Santri');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Nama', key: 'nama', width: 20 },
    { header: 'Jenjang', key: 'jenjang', width: 15 },
    { header: 'Alamat', key: 'alamat', width: 25 },
    { header: 'Orang Tua', key: 'orangtua', width: 20 },
    { header: 'Tanggal Lahir', key: 'tanggallahir', width: 15 }
  ];

  data.forEach(item => worksheet.addRow(item));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=santri.xlsx');
  await workbook.xlsx.write(res);
  res.end();
};
