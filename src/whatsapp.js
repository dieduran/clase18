/**
const options = {
    body: 'Hola soy un WSP desde Node.js!',
    //mediaUrl: [ 'https://www.investingmoney.biz/public/img/art/xl/18012019161021Twilio-IoT.jpg' ], //para adjuntos
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+5491100000000'
 }
 */
import twilio from 'twilio'
import logger from './logger.js'

const accountSid = process.env.TWILIO_ACCOUNTSID
const authToken = process.env.TWILIO_AUTHTOKEN

const client = twilio(accountSid, authToken)

const enviamosWHP = async(textoMensaje, nroDestino)=>{
    try {
        const message = await client.messages.create({
            body: textoMensaje||'Hola soy un WSP desde Node.js!',
            //mediaUrl: [ 'https://www.investingmoney.biz/public/img/art/xl/18012019161021Twilio-IoT.jpg' ],//para adjuntos
            from: 'whatsapp:'+ process.env.NUMERO_WHP_CELULAR_TWILIO, //'whatsapp:+14155238886',
            to: 'whatsapp:'+  process.env.NUMERO_WHP_PEDIDO//'whatsapp:+5491100000000'
        })
        //console.log(message)
        logger.info('Enviamos WHP')
    } catch (error) {
        //console.log(error)
        logger.error('Enviamos WHP: ', error)
    }
}

export default enviamosWHP