const User = require('../../models/index')
const dates = require('./index.json')
const Red = require('../../models/redirecionamentos')

async function stage2(client,message,socket){

    const aux_estado = await User.findOne({userid:message.from})
    const estado = aux_estado.state2


    if(estado == null){

        await client.sendText(message.from,dates.stage6) //mensagem de boas vindas
        await client.sendText(message.from,dates.stage0) //mensagem perguntando sobre o cnpj da empresa
        await User.updateOne({userid:message.from},{state2:{nome:'op1',state:0}}) // atualizando estado no banco de dados pra poder seguir
    }

    else if(estado.state === 0){

        const msg = []
        msg.push('cnpj : '+message.body) // pegando o cnpj e salvando em uma lista
        await User.updateOne({userid:message.from},{state2:{nome:'op1',state:1},conversas:{msg:msg}}) // atualizando estado no banco de dados pra poder seguir
        await client.sendText(message.from,dates.stage1) //perguntando qual a area de atuaçao da empresa

    }
    else if(estado.state === 1){

        const msg_aux = await User.findOne({userid:message.from})

        const msg = msg_aux.conversas.msg
        msg.push('área atuação : '+message.body) // pegando a area de atuaçao e salvando em uma lista
        await User.updateOne({userid:message.from},{state2:{nome:'op1',state:2},conversas:{msg:msg}}) // atualizando estado no banco de dados pra poder seguir
        await client.sendText(message.from,dates.stage2) //estado onde a empresa reside

    }
    else if(estado.state === 2){

        const msg_aux = await User.findOne({userid:message.from})

        const msg = msg_aux.conversas.msg
        msg.push('estado : '+message.body) // pegando o estado do país e salvando em uma lista
        await User.updateOne({userid:message.from},{state2:{nome:'op1',state:3},conversas:{msg:msg}}) // atualizando estado no banco de dados pra poder seguir
        await client.sendText(message.from,dates.stage3) //voce emite cupom fiscal

    }
    else if(estado.state === 3){

        const msg_aux = await User.findOne({userid:message.from})

        const msg = msg_aux.conversas.msg
        msg.push('emite cupom fiscal : '+message.body) // pegando a resposta se a empresa emite cupom fiscal
        await User.updateOne({userid:message.from},{state2:{nome:'op1',state:4},conversas:{msg:msg}}) // atualizando estado no banco de dados pra poder seguir
        await client.sendText(message.from,dates.stage4) //quantos funcionarios sua empresa tem

    }
    else if(estado.state === 4){

        const msg_aux = await User.findOne({userid:message.from})

        const msg = msg_aux.conversas.msg
        msg.push('número de funcionários : '+message.body) // pegando a resposta se a empresa emite cupom fiscal
        await User.updateOne({userid:message.from},{state2:{nome:'op1',state:5},conversas:{msg:msg}}) // atualizando estado no banco de dados pra poder seguir
        await client.sendText(message.from,dates.stage5) //aguardar um funcionario ressarce para atender
        let user = await User.findOne({userid:message.from})
        await Red.create({userid:message.from,red:'Análise de empresa',conversas:msg,nome:user.nome,area:'Comercial'}) // salva no banco de dados que esta interessado em conversar com um atendente
        
    }
    else if(estado.state === 5){


        const usuario = await User.findOne({userid:message.from})
        socket.emit('message',{userid:usuario.userid,message:message.body})

    }



}

module.exports = stage2