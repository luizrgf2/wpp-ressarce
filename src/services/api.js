const axios = require('axios')



module.exports = async (valor,mercado) =>{
    base_url = 'http://localhost:3001/dados'
    const response = await axios.get(base_url+'/'+valor.toString()+'/'+mercado.toString())

    return response.data.value

}