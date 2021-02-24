const mongoose = require('../database/index')


const redScheme = mongoose.Schema({
    red : {
        type:String,
        require:true
    },
    conversas:{
        type:Array,
    },
    userid:{
        type:String,
        require:true
    }
})

const redModel = mongoose.model('redirects',redScheme)


module.exports = redModel