//npm run dev
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const fileUpload = require('express-fileupload');
const importExcel = require('convert-excel-to-json');
const pool = require('./database');  //db
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore= require('express-mysql-session');
const {database} = require('./keys');
//inicializaciones
const app = express();

//configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
     defaultLayout: 'main',
     layoutsDir: path.join(app.get('views'), 'layouts'),
     partialsDir: path.join(app.get('views'),'partials'),
     extname: '.hbs',
     helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
     secret: 'unayoe',
     resave: false,
     saveUninitialized: false,
     store: new MySQLStore(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Variables globales
app.use((req, res, next) => {
     app.locals.success = req.flash('success');
     app.locals.successCarga = req.flash('successCarga');
     next() ;
});

//Rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));
app.use('/index',require('./routes/index'));

//Archivos Publicos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'funciones')));
app.use(fileUpload());


//Iniciar servidor
app.listen(app.get('port'), () =>{
     console.log('Server en puerto', app.get('port'));
});

app.get('/', async (req, res) => {
     res.render('index/index.hbs');
     
})

app.post('/cargaOca',async (req,res)=>{
let file = req.files.filename;
     
     let filename = file.name;
     
     await file.mv('./excel/'+filename, async (err) => {
          if(err){
               console.log(err)
               res.send('ERROR');
          }
          else{
               console.log('entra a OCA');
               
               let infoExcel = importExcel({
                    sourceFile: './excel/'+filename,
                    header: {rows:1},
                    columnToKey: {
                         A: '_idAlumno', 
                         B: '_alumnoDNI', 
                         C: '_alumnoFacultad', 
                         D: '_alumnoEscuela', 
                         E: '_alumnoApellidoPaterno', 
                         F: '_alumnoApellidoMaterno', 
                         G: '_alumnoNombre', 
                         H: '_alumnoFechaNacimiento', 
                         I: '_alumnoSexo', 
                         J: '_alumnoCorreoIns',
                         K: '_alumnoPlan', 
                         L: '_ocColegioProced',
                         M: '_ocDependeDe',
                         N: '_ocTrabajo',
                         O: '_ocViveCon',
                         P: '_ocTipoVivienda',
                         Q: '_ocTiempoTransporte',
                         R: '_ocDicapacidad',
                         S: '_ocTipoSeguro',
                         T: '_ocApoderado',
                         U: '_ocCorreoApoderado',
                         V: '_ocTelefCasa',
                         W: '_ocMovilApoderado',
                         X: '_ocEstadoCivil',
                         Y: '_ocNumeroMovil',
                         Z: '_ocCorreoPersonal' },
                    sheets: ['Hoja1']
               });
               let r;
               for(let i = 0; infoExcel.Hoja1.length > i; i++){
                    let {
                         _idAlumno,
                         _alumnoDNI,
                         _alumnoFacultad,
                         _alumnoEscuela,
                         _alumnoApellidoPaterno,
                         _alumnoApellidoMaterno,
                         _alumnoNombre,
                         _alumnoFechaNacimiento,
                         _alumnoSexo,
                         _alumnoCorreoIns,
                         _alumnoPlan, 
                         _ocColegioProced,
                         _ocDependeDe,
                         _ocTrabajo,
                         _ocViveCon,
                         _ocTipoVivienda,
                         _ocTiempoTransporte,
                         _ocDicapacidad,
                         _ocTipoSeguro,
                         _ocApoderado,
                         _ocCorreoApoderado,
                         _ocTelefCasa,
                         _ocMovilApoderado,
                         _ocEstadoCivil,
                         _ocNumeroMovil,
                         _ocCorreoPersonal} = infoExcel.Hoja1[i];

                    const newLink = {
                         _idAlumno: _idAlumno.toString(),
                         _alumnoDNI: _alumnoDNI.toString(),
                         _alumnoFacultad: _alumnoFacultad,
                         _alumnoEscuela: _alumnoEscuela,
                         _alumnoApellidoPaterno: _alumnoApellidoPaterno,
                         _alumnoApellidoMaterno: _alumnoApellidoMaterno,
                         _alumnoNombre: _alumnoNombre,
                         _alumnoFechaNacimiento: _alumnoFechaNacimiento,
                         _alumnoSexo: _alumnoSexo,
                         _alumnoCorreoIns: _alumnoCorreoIns,
                         _alumnoPlan: _alumnoPlan.toString(),
                         _ocColegioProced: _ocColegioProced,
                         _ocDependeDe: _ocDependeDe,
                         _ocTrabajo: _ocTrabajo,
                         _ocViveCon: _ocViveCon,
                         _ocTipoVivienda: _ocTipoVivienda,
                         _ocTiempoTransporte: _ocTiempoTransporte,
                         _ocDicapacidad: _ocDicapacidad,
                         _ocTipoSeguro: _ocTipoSeguro,
                         _ocApoderado: _ocApoderado,
                         _ocCorreoApoderado: _ocCorreoApoderado,
                         _ocTelefCasa: _ocTelefCasa,
                         _ocMovilApoderado: _ocMovilApoderado,
                         _ocEstadoCivil: _ocEstadoCivil,
                         _ocNumeroMovil: _ocNumeroMovil,
                         _ocCorreoPersonal: _ocCorreoPersonal
                    };
                    
                    let respuesta = await pool.query('CALL BDUNAYOE.sp_CargarDatosExcelOCA(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                         newLink._idAlumno,
                         newLink._alumnoDNI,
                         newLink._alumnoFacultad,
                         newLink._alumnoEscuela,
                         newLink._alumnoApellidoPaterno,
                         newLink._alumnoApellidoMaterno,
                         newLink._alumnoNombre,
                         newLink._alumnoFechaNacimiento,
                         newLink._alumnoSexo,
                         newLink._alumnoCorreoIns,
                         newLink._alumnoPlan,
                         newLink._ocColegioProced,
                         newLink._ocDependeDe,
                         newLink._ocTrabajo,
                         newLink._ocViveCon,
                         newLink._ocTipoVivienda,
                         newLink._ocTiempoTransporte,
                         newLink._ocDicapacidad,
                         newLink._ocTipoSeguro,
                         newLink._ocApoderado,
                         newLink._ocCorreoApoderado,
                         newLink._ocTelefCasa,
                         newLink._ocMovilApoderado,
                         newLink._ocEstadoCivil,
                         newLink._ocNumeroMovil,
                         newLink._ocCorreoPersonal
                    ]);

                    let [{response}]= respuesta[0];
                    r = response;
               } 
               console.log(r);
               if(r == 0){
                    req.flash('successCarga', 'Todo ok');
               }
               else{
                    req.flash('successCarga', 'algo salio mal');
                    console.log('entra');
               }
               res.redirect('/cargaOca');
          }
     }) 
})


app.post('/cargaClinica',async (req,res)=>{
let file = req.files.filename;
     
     let filename = file.name;
     
     await file.mv('./excel/'+filename, async (err) => {
          if(err){
               console.log(err)
               res.send('ERROR');
          }
          else{
               console.log('entra a Clinica');
               
               // let infoExcel = importExcel({
               //      sourceFile: './excel/'+filename,
               //      header: {rows:1},
               //      columnToKey: {A: 'id', B: 'username', C: 'password', D: 'fullname'},
               //      sheets: ['Hoja']
               // });
               // for(let i = 0; infoExcel.Hoja.length > i; i++){
               //      let {id, username, password, fullname} = infoExcel.Hoja[i];
               //      const newLink = {
               //           id: id,
               //           username: username,
               //           password: password,
               //           fullname: fullname
               //      };
               //      await pool.query('INSERT INTO users SET ?', [newLink]);

                    
               // } 
          }
     }) 
})


app.post('/cargaSum',async (req,res)=>{
let file = req.files.filename;
     
     let filename = file.name;
     
     await file.mv('./excel/'+filename, async (err) => {
          if(err){
               console.log(err)
               res.send('ERROR');
          }
          else{
               console.log('entra a Sum');
               
               // let infoExcel = importExcel({
               //      sourceFile: './excel/'+filename,
               //      header: {rows:1},
               //      columnToKey: {A: 'id', B: 'username', C: 'password', D: 'fullname'},
               //      sheets: ['Hoja']
               // });
               // for(let i = 0; infoExcel.Hoja.length > i; i++){
               //      let {id, username, password, fullname} = infoExcel.Hoja[i];
               //      const newLink = {
               //           id: id,
               //           username: username,
               //           password: password,
               //           fullname: fullname
               //      };
               //      await pool.query('INSERT INTO users SET ?', [newLink]);

                    
               // } 
          }
     }) 
})


app.post('/cargaUnayoe',async (req,res)=>{
let file = req.files.filename;
     
     let filename = file.name;
     
     await file.mv('./excel/'+filename, async (err) => {
          if(err){
               console.log(err)
               res.send('ERROR');
          }
          else{
               console.log('entra a Unayoe');
               
               // let infoExcel = importExcel({
               //      sourceFile: './excel/'+filename,
               //      header: {rows:1},
               //      columnToKey: {A: 'id', B: 'username', C: 'password', D: 'fullname'},
               //      sheets: ['Hoja']
               // });
               // for(let i = 0; infoExcel.Hoja.length > i; i++){
               //      let {id, username, password, fullname} = infoExcel.Hoja[i];
               //      const newLink = {
               //           id: id,
               //           username: username,
               //           password: password,
               //           fullname: fullname
               //      };
               //      await pool.query('INSERT INTO users SET ?', [newLink]);

                    
               // } 
          }
     }) 
})



// 16200270,
// 71395604,
// "Fisi",
// "sis",
// "Est",
// "Igermina",
// "Didier",
// 1998-06-07T05:00:36.000Z,
// "M",
// "didierunmsm".edu.pe',
// 15,
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa",
// "aaaaaa"


// _idAlumno:
// _alumnoDNI:
// _alumnoFacultad:
// _alumnoEscuela:
// _alumnoApellidoPaterno:
// _alumnoApellidoMaterno:
// _alumnoNombre:
// _alumnoFechaNacimiento:
// _alumnoSexo:
// _alumnoCorreoIns:
// _alumnoPlan:
// _ocColegioProced:
// _ocDependeDe:
// _ocTrabajo:
// _ocViveCon:
// _ocTipoVivienda:
// _ocTiempoTransporte:
// _ocDicapacidad:
// _ocTipoSeguro:
// _ocApoderado:
// _ocCorreoApoderado:
// _ocTelefCasa:
// _ocMovilApoderado:
// _ocEstadoCivil:
// _ocNumeroMovil:
// _ocCorreoPersonal: