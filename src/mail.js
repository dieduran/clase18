import { createTransport } from 'nodemailer';
import logger from './logger.js';

const TEST_MAIL = process.env.MAIL_ETHEREAL 

const transporter = createTransport({
   host: 'smtp.ethereal.email',
   port: 587,
   auth: {
       user: TEST_MAIL,
       pass: process.env.PASSWORD_MAIL_ETHEREAL
   }
});

const enviamosCorreo= async (tituloCorreo,textoCorreo)=>{
    try {
        const info = await transporter.sendMail({
            from: 'Servidor Node.js',
            to: TEST_MAIL,
            subject: tituloCorreo||'Mail de prueba desde Node.js',
            html: textoCorreo||'Texto de mail de prueba desde Node.js'
        })
        //console.log(info)
        logger.info('Enviamos Correo')
    } catch (error) {
        //console.log(err)
        logger.error('Enviamos Correo: ', error)
    }
}

export default enviamosCorreo

