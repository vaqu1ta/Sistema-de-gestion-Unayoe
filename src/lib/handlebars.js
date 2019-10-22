const {format}= require('timeago.js')

const helpers = {};

helpers.timeago = (timestamp) => {
     return format(timestamp);
}

helpers.tipoDeCarga = ()=>{
     document.getElementById('cargas').addEventListener('click', ()=>{
          console.log('Hola Mundo');
          
     })
}

module.exports = helpers;