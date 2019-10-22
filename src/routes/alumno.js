const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
     res.redirect('alumno/listaAlumnos');
})

router.get('/listaAlumnos', (req, res) => {
     res.render('alumno/listaAlumnos');
})

module.exports = router;