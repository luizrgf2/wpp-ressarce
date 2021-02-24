const mongoose = require('mongoose')


//configurando mongodb

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/whatsapp',{useNewUrlParser:true,useFindAndModify:true}).then(()=>{
    
    
    console.log('Conectado.....')
    
    
    
}).catch((err)=>{
    
    console.log('Erro ao se conectar ao banco MongoDB!!')
    
    
})


//model para inserir no mongodb
module.exports = mongoose