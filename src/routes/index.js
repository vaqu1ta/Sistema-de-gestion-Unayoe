const express = require('express');
const router = express.Router();

const {isLoggedIn} = require('../lib/auth');

router.get('/',isLoggedIn, async (req, res) => {
     res.render('index/index');
})

router.get('/cargaOca',isLoggedIn, (req, res) => {
     res.render('index/cargaOca');
})

router.get('/cargaClinica',isLoggedIn, (req, res) => {
     res.render('index/cargaClinica');
})

router.get('/cargaSum',isLoggedIn, (req, res) => {
     res.render('index/cargaSum');
})

router.get('/cargaUnayoe',isLoggedIn, (req, res) => {
     res.render('index/cargaUnayoe');
})

module.exports = router;