const User = require('../../models/index')
const dates = require('./index.json')
const Red = require('../../models/redirecionamentos')

async function stage2(client,message,socket){

    const aux_estado = await User.findOne({userid:message.from})
    const estado = aux_estado.state4


    if(estado == null){

        await client.sendText(message.from,dates.stage0) //mensagem informando com esta o procedimento 
        await client.sendText(message.from,dates.stage1) //mensagem perguntando se pode encerrar o atendimento ressarce
        await User.updateOne({userid:message.from},{state4:{nome:'op1',state:0}}) // atualizando estado no banco de dados pra poder seguir
    }

    else if(estado.state == 0){


        if(message.body == '1'){
            await User.updateOne({userid:message.from},{state4:{nome:'op1',state:1}}) // atualizando estado no banco de dados pra poder seguir
            await client.sendText(message.from,dates.stage2) //encerrar atendimento
            await User.deleteOne({userid:message.from})
    
        }
        else if(message.body == '2'){

            await User.updateOne({userid:message.from},{state4:{nome:'op1',state:1}}) // atualizando estado no banco de dados pra poder seguir
            await client.sendText(message.from,dates.stage3) //aguardar um atendente
            let user = await User.findOne({userid:message.from})
            await Red.create({userid:message.from,red:'Estado do procedimento',conversas:[],nome:user.nome,area:'Suporte'}) // salva no banco de dados que esta interessado em conversar com um atendente


        }
        else{
            
            await client.sendText(message.from,'Digite algo válido😉!')

        }

    }
    else if(estado.state === 1){
        const usuario = await User.findOne({userid:message.from})
        socket.emit('message',{userid:usuario.userid,message:message.body})

        
    }



}

module.exports = stage2