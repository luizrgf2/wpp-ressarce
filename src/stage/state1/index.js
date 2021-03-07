const User = require('../../models/index')
const dates = require('./index.json')
const Email = require('../../models/email')
const Red = require('../../models/redirecionamentos')

var  mercado = 0
var valor = 0



//op1 Simples nacional
//op2 lucro presumido


async function Stage1(client,message,socket){
    let aux = await User.findOne({userid:message.from})
    let estado = aux.state1



    if(estado == null){
        await client.sendText(message.from,dates.stage0) //mandando mensagem das opçoes 1: simples nacional 2: lucro presumido
        await User.updateOne({userid:message.from},{state1:{nome:null,state:0}}) //atalizar estado
        
    }
    //redirecionamento de cliente requerido
    else if(estado.state === 0){
        

        //Simples nacional escolha
        if(message.body === '1'){
            
            await User.updateOne({userid:message.from},{state1:{nome:'op1',state:1}}) // atualizando estado da opçao 1 siimples nacional
            await client.sendText(message.from,dates.stage2) //mandando mensagem perguntando email
            
            
        }
        //Lucro presumido escolha
        else if(message.body === '2'){
            
            await User.updateOne({userid:message.from},{state1:{nome:'op2',state:1}}) // atuaçizando banco de dados lucro presumido, opçao2
            await client.sendText(message.from, dates.stage7) //redirecionar cliente para um atendente ressarce lucro presumido
            await client.sendText(message.from,dates.stage10) //pergunta a area de atuaçoa da empresa

            
        }else{
            client.sendText(message.from,'Digite algo válido😉!')
        }
    }
    else if(estado.state === 1){
        
        //Simples nacional
        if(aux.state1.nome=='op1'){
            
            await client.sendText(message.from,dates.stage3) // mandado mensagem opçoes de mercados opaçoes de 1 a 10
            await User.updateOne({userid:message.from},{state1:{nome:'op1',state:2}}) // atualizando satate1 e colocando op1
            await Email.create({email:message.body,nome:aux.nome}) // mandando email e o nome para uma collection camada email no banco whatsapp
        
        
        }
        //Lucro Presumido
        else{
            
            const msgs = await User.findOne({userid:message.from}) //pegando mensagens importantes salvas no banco de dados

            const msg_finais = msgs.conversas.msg

            msg_finais.push('área de atuação: '+message.body) // adicionando conversa importante ao banco de dados

            await User.updateOne({userid:message.from},{conversas:{msg: msg_finais},state1:{nome:'op2',state:2}}) // salvando banco de dados a area de atuaçao da empresa

            await client.sendText(message.from,dates.stage11) // mandando menssagem perguntando o cnpj

            
        }
    }
    else if(estado.state === 2){
        
        if(aux.state1.nome==='op1'){
            
            if(message.body === '1'){
                mercado =0.3
                await client.sendText(message.from,dates.stage5)
                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:3,mercado:mercado}})
                
            }
            else if(message.body === '2'){
                mercado =0.3
                await client.sendText(message.from,dates.stage5)
                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:3,mercado:mercado}})
                
            }
            else if(message.body === '3'){
                mercado =0.6
                await client.sendText(message.from,dates.stage5)
                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:3,mercado:mercado}})
            }
            else if(message.body === '4'){
                
                mercado =0.9
                await client.sendText(message.from,dates.stage5)
                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:3,mercado:mercado}})
                
            }
            else if(message.body === '5'){
                mercado =0.85
                await client.sendText(message.from,dates.stage5)
                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:3,mercado:mercado}})
                
            }
            else if(message.body === '6'){
                
                mercado =0.8
                await client.sendText(message.from,dates.stage5)
                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:3,mercado:mercado}})
            }
            else if(message.body === '7'){
                
                mercado =0.4
                await client.sendText(message.from,dates.stage5)
                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:3,mercado:mercado}})
            }
            else if(message.body === '8'){
                mercado =0.25
                await client.sendText(message.from,dates.stage5)
                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:3,mercado:mercado}})
                
            }
            else if(message.body === '9'){
                
                mercado =0.4
                await client.sendText(message.from,dates.stage5)
                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:3,mercado:mercado}})
            }
            else if(message.body === '10'){
                
                await client.sendText(message.from,dates.stage8)
                await client.sendText(message.from,dates.stage9)
                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:3,mercado:mercado}})
            }else{
                
                await client.sendText(message.from,'Digite algo válido😉!')
            }
            
        }else{
            
            const msgs = await User.findOne({userid:message.from}) //pegando mensagens importantes salvas no banco de dados

            const msg_finais = msgs.conversas.msg

            msg_finais.push('cnpj: '+message.body) // adicionando conversa importante ao banco de dados

            await User.updateOne({userid:message.from},{conversas:{msg: msg_finais},state1:{nome:'op2',state:3}}) // salvando as mensagens e o novo estado no banco de dados

            await client.sendText(message.from,dates.stage12) // perguntando  em qual estado esta a empresa
            
        }
    }
    //redirecionamento pendente
    else if(estado.state === 3){
        
        if(aux.state1.nome==='op1'){ // verifica se a opçao foi simples nacional
            if(mercado !=0){//caso seja zero isso indica que a opçao selecionada de mercado de atuaçao da empresa é a 10, onde nao possui enquadramento para semulaçao
                valor = message.body

                let valores = await require('../../services/api')(valor,mercado) //acessa a api de simulação da ressarce

                let text = dates.stage6.replace('XX',valores[1]).replace('ZZ',valores[0]) //substitui os textos pelos valoes(ganho mensal e a porcentagem do mercado)


                await User.updateOne({userid:message.from},{state1:{nome:'op1',state:4}}) // atualiza o banco de dados
                await client.sendText(message.from,text) //envia a mensagem mostrando quanto tem pra receber
                let user = await User.findOne({userid:message.from})
                await Red.create({userid:message.from,red:'Simples nacional',nome:user.nome,conversas:[]}) // salva no banco de dados que esta interessado em conversar com um atendente
                

            }else{



                if(message.body == '1'){//deleta o cliente da base de dados
                    await client.sendText(message.from,'Obrigado pela preferência, volte sempre que precisar!')
                    await User.deleteOne({userid:message.from})
                }
                else if(message.body == '2'){//redireciona o cliente para um profissional ressarce
                    await client.sendText(message.from,'Aguarde até nossos profissionais atenderem você, é bem rápido.')
                    let user = await User.findOne({userid:message.from})

                    await Red.create({userid:message.from,red:'Escolheu a opção 10',nome:user.nome,conversas:[]}) // salva no banco de dados que esta interessado em conversar com um atendente
                    await User.updateOne({userid:message.from},{state1:{nome:'10',state:4}}) // atualiza o banco de dados
                    
                }
                else{
                    await client.sendText(message.from,'Digite algo válido😉!')
                }


            }
            
        }else{
            

            const msgs = await User.findOne({userid:message.from}) //pegando mensagens importantes salvas no banco de dados

            const msg_finais = msgs.conversas.msg

            msg_finais.push('estado: '+message.body) // adicionando conversa importante ao banco de dados

            await User.updateOne({userid:message.from},{conversas:{msg: msg_finais},state1:{nome:'op2',state:4}}) // salvando as mensagens e o novo estado no banco de dados

            
            await client.sendText(message.from,dates.stage13) //perguntando se a empresa emite cumpom fiscal

        }
    }

    else if(estado.state === 4){
        if(aux.state1.nome==='op1'){// verifica se a opçao foi simples nacional
        
        
                
            const usuario = await User.findOne({userid:message.from})
            socket.emit('message',[usuario.nome,usuario.userid,message.body])
            
        
        }
        


        else{
            
            const msgs = await User.findOne({userid:message.from}) //pegando mensagens importantes salvas no banco de dados
    
            const msg_finais = msgs.conversas.msg
    
            msg_finais.push('emite cupom fiscal: '+message.body) // adicionando conversa importante ao banco de dados
    
            await User.updateOne({userid:message.from},{conversas:{msg: msg_finais},state1:{nome:'op2',state:5}}) // salvando as mensagens e o novo estado no banco de dados
    
            
            await client.sendText(message.from,dates.stage14) //perguntando se a empresa emite cumpom fiscal
        }


    }
    else if  (estado.state === 5){




        const msgs = await User.findOne({userid:message.from}) //pegando mensagens importantes salvas no banco de dados

        const msg_finais = msgs.conversas.msg

        msg_finais.push('número de funcionarios: '+message.body) // adicionando conversa importante ao banco de dados

        await User.updateOne({userid:message.from},{conversas:{msg: msg_finais},state1:{nome:'op2',state:6}}) // salvando as mensagens e o novo estado no banco de dados

        
        await client.sendText(message.from,'Perfeito, aguarde um atendente Ressarce... é bem rápido!') //perguntando quantos funcionarios a empresa tem
        let user = await User.findOne({userid:message.from})
        await Red.create({userid:message.from,red:'Lucro Real ou Presumido',conversas:msg_finais,nome:user.nome}) // salva no banco de dados que esta interessado em conversar com um atendente



    }
    //rediorecionar para um atendente ressarce
    else if(estado.state === 6){

        const usuario = await User.findOne({userid:message.from})
        socket.emit('message',[usuario.nome,usuario.userid,message.body])

    }
    
    
}

module.exports = Stage1