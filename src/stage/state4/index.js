const User = require('../../models/index')
const dates = require('./index.json')
const Red = require('../../models/redirecionamentos')

async function stage2(client,message,socket){

    const aux_estado = await User.findOne({userid:message.from})
    const estado = aux_estado.state4
    


    if(estado == null){

        await client.sendText(message.from,dates.stage0) //opção 1 se você for Cliente 2 se você for Franqueado(a) 3 Para encerrar.
        await User.updateOne({userid:message.from},{state4:{nome:'op1',state:0}}) // atualizando estado no banco de dados pra poder seguir
    }

    else if(estado.state == 0){


        if(message.body == '1'){
            await User.updateOne({userid:message.from},{state4:{nome:'op1',state:1}}) // 
            await client.sendText(message.from,dates.stage1) // 1)Como funcionam os prazos da restituição? 2)Falar com Financeiro
            
        }
        //redirecionar para um atendente ressarce
        else if(message.body == '2'){

            await User.updateOne({userid:message.from},{state4:{nome:'op2',state:1}}) // 
            await client.sendText(message.from,dates.stage5) // 1)Como funcionam os prazos da restituição? 2)Falar com Financeiro
            

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


        if(estado.nome = 'op1'){


            if(message.body == '1'){

                await client.sendText(message.from,dates.stage2) //mensagem com a resposata da opçao 1
                await client.sendText(message.from,dates.stage3) //mensagem agradecendo o contato
                await User.deleteOne({userid:message.from})



            }
            //redirecionar cliente para atendetente
            else if(message.body == '2'){


                await client.sendText(message.from,dates.stage4) // mensagem para aguardar um atendente
                await User.updateOne({userid:message.from},{state4:{nome:'op1',state:2}}) // 
                let user  =  await User.findOne({userid:message.from})

                await Red.create({userid:message.from,red:'Falar com financeiro cliente',conversas:[],nome:user.nome}) // salva no banco de dados que esta interessado em conversar com um atendente
                

            }
            else{
                
                await client.sendText(message.from,'Digite algo válido😉!')

            }

        }
        else{
            
            
            if(message.body == '1'){

                await client.sendText(message.from,dates.stage6) //mensagem com a resposata da opçao 1
                await client.sendText(message.from,dates.stage3) //mensagem agradecendo o contato
                await User.deleteOne({userid:message.from})

            }
            //redirecionar cliente para atendetente
            else if(message.body == '2'){


                await client.sendText(message.from,dates.stage4) // mensagem para aguardar um atendente
                await User.updateOne({userid:message.from},{state4:{nome:'op1',state:2}}) // 
                let user = await User.findOne({userid:message.from})
                await Red.create({userid:message.from,red:'Falar com financeiro franqueado',conversas:[],nome:user.nome}) // salva no banco de dados que esta interessado em conversar com um atendente



            }
            else{
                
                await client.sendText(message.from,'Digite algo válido😉!')

            }

        
        
        
        }

    }
    else if(estado.state == 2){

        
        const usuario = await User.findOne({userid:message.from})
        socket.emit('message',[usuario.nome,usuario.userid,message.body])

    }
    



}

module.exports = stage2