const passport = require('passport');
const LocalStrategy = require('passport-local');

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
     usernameField: 'usuario',
     passwordField: 'usuarioPassword',
     passReqToCallback: true
}, async (req, usuario, usuarioPassword, done) =>{
     console.log(req.body);
     
     const rows = await pool.query('SELECT * FROM usuario WHERE usuario = ?', [usuario]);
     if(rows.length > 0){
          const user = rows[0];
          //console.log(usuarioPassword);
          //console.log(user.usuarioPassword);
          
          const validPassword = await helpers.matchPassword(usuarioPassword, user.usuarioPassword);
          //console.log(validPassword);
          if(validPassword == true) {
               done(null, user, req.flash('success','welcome ' + user.usuario));
          }else {
               done(null, false, req.flash('message','Contraseña invalida'));
          }
     }
     else{
          return done(null, false, req.flash('message','El nombre de usuario no existe'));
     }
}));

passport.use('local.signup', new LocalStrategy({
     usernameField: 'usuario',
     passwordField: 'usuarioPassword',
     passReqToCallback: true
}, async (req, usuario, usuarioPassword, done) => {
     //console.log(req.body);
     
     const newUser = {
          usuario,
          usuarioPassword
     };
     newUser.usuarioPassword = await helpers.encryptPassword(usuarioPassword);

     const result = await pool.query('INSERT INTO usuario SET ?', [newUser]);
     
     newUser.id = result.insertId;
     return done(null, newUser);
     
}));

passport.serializeUser((usuario, done) => {
     done(null, usuario.id);
})

passport.deserializeUser(async (id, done) => {
     const rows = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
     done(null, rows[0]);
})



