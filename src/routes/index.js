const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
     res.render('index/index');
})

router.get('/cargaOca', (req, res) => {
     res.render('index/cargaOca');
})

router.get('/cargaClinica', (req, res) => {
     res.render('index/cargaClinica');
})

router.get('/cargaSum', (req, res) => {
     res.render('index/cargaSum');
})

router.get('/cargaUnayoe', (req, res) => {
     res.render('index/cargaUnayoe');
})

module.exports = router;