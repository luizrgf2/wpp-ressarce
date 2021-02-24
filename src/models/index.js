const mongoose = require('../database/index')


const ClienteScheme = mongoose.Schema({


    userid:{
        type:String,
        require:true
    },
    state:{
        type:Number,
        require:true,
        default:0   
    },
    nome:{
        type:String,
        require:true
    },
    state1:{
        type:Object,
        require:true,
        default:null
    },
    state2:{
        type:Object,
        default:null
    },
    state3:{
        type:Object,
        default:null   
    },
    state4:{
        type:Object,
        default:null   
    },
    state5:{
        type:Object,
        default:null   
    },
    state6:{
        type:Object,
        default:null   
    },
    state_out:{
        type:Number,
        default:null
    },
    message:{
        type:String,
        default:''
    },
    conversas:{
        type:Object,
        default:{msg:[]}
    }

})


const ClientModel = mongoose.model('chats',ClienteScheme)


module.exports = ClientModel


