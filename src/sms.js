import twilio from 'twilio'
import logger from './logger.js'

const accountSid = process.env.TWILIO_ACCOUNTSID
const authToken = process.env.TWILIO_AUTHTOKEN

const client = twilio(accountSid, authToken)


const enviamosSMS = async(textoMensaje)=>{
    try {
    const message = await client.messages.create({
        body: textoMensaje||"Sin texto",
        from: process.env.NUMERO_SMS_CELULAR_TWILIO,
        to: process.env.NUMERO_SMS_PEDIDO 
    })
    //console.log(message)
    logger.info('Enviamos SMS')
    } catch (error) {
    //console.log(error)
    logger.error('Enviamos SMS: ',error)
    }
}

export default enviamosSMS