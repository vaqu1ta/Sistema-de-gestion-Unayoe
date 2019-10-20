//npm run dev
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const fileUpload = require('express-fileupload');
const importExcel = require('convert-excel-to-json');
const pool = require('./database');  //db

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
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Variables globales
app.use((req, res, next) => next() );

//Rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));
app.use('/index',require('./routes/index'));

//Archivos Publicos
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());


//Iniciar servidor
app.listen(app.get('port'), () =>{
     console.log('Server en puerto', app.get('port'));
});

app.get('/', async (req, res) => {
     res.render('index/index.hbs');
     
})

app.post('/',async (req,res)=>{
     let file = req.files.filename;
     
     let filename = file.name;
     
     await file.mv('./excel/'+filename, async (err) => {
          if(err){
               console.log(err)
               res.send('ERROR');
          }
          else{
               console.log('entra');
               
               let infoExcel = importExcel({
                    sourceFile: './excel/'+filename,
                    header: {rows:1},
                    columnToKey: {A: 'id', B: 'username', C: 'password', D: 'fullname'},
                    sheets: ['Hoja']
               });
               for(let i = 0; infoExcel.Hoja.length > i; i++){
                    let {id, username, password, fullname} = infoExcel.Hoja[i];
                    const newLink = {
                         id: id,
                         username: username,
                         password: password,
                         fullname: fullname
                    };
                    await pool.query('INSERT INTO users SET ?', [newLink]);

                    
               } 
          }
     }) 
})
