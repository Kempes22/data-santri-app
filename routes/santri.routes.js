const express = require('express');
const router = express.Router();
const controller = require('../controllers/santri.controller');

// Route utama
router.get('/santri/view', controller.viewSantri);
router.post('/santri/add', controller.addSantriForm);

// Edit
router.get('/santri/edit/:id', controller.viewEditSantri);
router.post('/santri/edit/:id', controller.updateSantri);

// Ekspor
router.get('/santri/export/pdf', controller.exportPDF);
router.get('/santri/export/excel', controller.exportExcel);

module.exports = router;
