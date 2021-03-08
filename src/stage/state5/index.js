const User = require('../../models/index')
const dates = require('./index.json')
const Red = require('../../models/redirecionamentos')

async function stage2(client,message,socket){

    const aux_estado = await User.findOne({userid:message.from})
    const estado = aux_estado.state5
    


    if(estado == null){

        await client.sendText(message.from,dates.stage0) //opção 1 se você for Cliente 2 se você for Franqueado(a) 3 Para encerrar.
        await User.updateOne({userid:message.from},{state5:{nome:'op1',state:0}}) // atualizando estado no banco de dados pra poder seguir
    }

    else if(estado.state == 0){

        //redirecionar para um atendente
        if(message.body == '1'){
            await User.updateOne({userid:message.from},{state5:{nome:'op1',state:1}}) // 
            await client.sendText(message.from,dates.stage1) // aguarde um atendente ressarce
            let user = await User.find({userid:message.from})
            await Red.create({userid:message.from,red:'Falar com jurídico cliente',conversas:[],nome:user.nome}) // salva no banco de dados que esta interessado em conversar com um atendente
            
        }
        //redirecionar para um atendente ressarce
        else if(message.body == '2'){

            await User.updateOne({userid:message.from},{state5:{nome:'op2',state:1}}) // 
            await client.sendText(message.from,dates.stage1) // aguarde um atendente ressarce
            let user = await User.find({userid:message.from})
            await Red.create({userid:message.from,red:'Falar com jurídico franqueado',conversas:[],nome:user.nome}) // salva no banco de dados que esta interessado em conversar com um atendente
            
            

        }
        else if(message.body == '3'){

            await client.sendText(message.from,dates.stage3) // 1) mensagem de agradecimentos
            await User.deleteOne({userid:message.from})

        }
        else{
            
            await client.sendText(message.from,'Digite algo válido😉!')

        }

    }
    else if(estado.state == 1){


        
        const usuario = await User.findOne({userid:message.from})
        socket.emit('message',[usuario.nome,usuario.userid,message.body])


    }


    



}

module.exports = stage2