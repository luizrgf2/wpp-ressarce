const wa = require('@open-wa/wa-automate');
const User = require('./models/index')
const stado = require('./stage/stage.json')
const io = require('socket.io-client')('http://localhost:3000') // conecta um socket clietside a api, node api whatsapp



wa.create().then(client => start(client));

function start(client) {
  
  
    io.on('msg',change=>{

        console.log('mensagem nova')


    })
  
  
    client.onMessage(async message => {
    
    let base = await User.findOne({userid:message.from})
    let state = 0
    let state_out = ''
    
    
    
    try{

        state =  base.state
        state_out =  base.state_out
    }catch{
    }





    //checar se o usuario ja mandou mensagem
    if(!await User.exists({userid:message.from})){
        //mandando a primeira mensagem
        await User.create({userid:message.from,state:1,nome:''})
        await client.sendText(message.from, stado.stage0);
    }
    //mandando segunda mensagem
    if(state === 1){
    
        await User.updateOne({userid:message.from},{state:2,nome:message.body})
        
        let message_aux = stado.state1.split('[NOME DA PESSOA]')

        let message_final = message_aux[0]+message.body+message_aux[1]
        
        await client.sendText(message.from, message_final);

        
    }
    else if(state === 2){
        
        if(message.body === '1'){
            
            await User.updateOne({userid:message.from},{state:3,state_out:1})
            require('./stage/state1/index')(client,message,io)
        }
        else if(message.body === '2'){
            
            await User.updateOne({userid:message.from},{state:3,state_out:2})
            require('./stage/state2/index')(client,message,io)
        }
        else if(message.body === '3'){
            
            await User.updateOne({userid:message.from},{state:3,state_out:3})
            require('./stage/state3/index')(client,message,io)

            
        }
        else if(message.body === '4'){
            
            await User.updateOne({userid:message.from},{state:3,state_out:4})
            require('./stage/state4/index')(client,message,io)

        }
        else if(message.body === '5'){
            
            await User.updateOne({userid:message.from},{state:3,state_out:5})
            require('./stage/state5/index')(client,message,io)

        }
        else if(message.body === '6'){
            
            await User.updateOne({userid:message.from},{state:3,state_out:6})
            require('./stage/state6/index')(client,message,io)
            
        }
        else{
            
            await client.sendText(message.from, stado.stage2);

        }




    }
    else if(state === 3){

        if(state_out === 1){
            require('./stage/state1/index')(client,message,io)
        }
        else if(state_out === 2){
            require('./stage/state2/index')(client,message,io)
        }
        else if(state_out === 3){
            require('./stage/state3/index')(client,message,io)

        }
        else if(state_out === 4){
            require('./stage/state4/index')(client,message,io)

        }
        else if(state_out === 5){
            require('./stage/state5/index')(client,message,io)

        }
        else if(state_out === 6){
            require('./stage/state6/index')(client,message,io)

        }

    }


    


    

  });
}