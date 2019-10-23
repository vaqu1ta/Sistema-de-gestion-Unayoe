const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../lib/auth');

router.get('/',isLoggedIn, (req, res) => {
     res.redirect('alumno/listaAlumnos');
})

router.get('/listaAlumnos',isLoggedIn, (req, res) => {
     res.render('alumno/listaAlumnos');
})

module.exports = router;