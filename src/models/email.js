const mongoose = require('../database/index')

const EmailScheme = mongoose.Schema({
    nome:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        lowercase:true
    },
    create:{
        type:Date,
        default:Date.now()
    }
})

const EmailModel = mongoose.model('email',EmailScheme)

module.exports = EmailModel