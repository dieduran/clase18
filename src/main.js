import app from './server.js'
import Yargs from 'yargs'
import logger from './logger.js'


const parametros = Yargs(process.argv.slice(2))
                      .alias({
                        p: 'puerto',
                        m: 'modo'
                      })
                      .default({
                        puerto: '8080',
                        modo: 'FORK'
                      })
                      .argv

const PORT=process.env.PORT || parametros.puerto   //ahora por parametro de linea de comando // OJO: LE AGREGO EL PUERTO PORQUE HEROKU ME LO MANEJA

/** Express */
const server = app.listen(PORT, () => {
    //console.log(`Conectado al puerto ${server.address().port}`)
    logger.info(`Conectado al puerto ${server.address().port}`)
})
server.on('error', (error) => {
    //console.log('Ocurrio un  error...')
    //console.log(error)
    logger.log('Ocurrio un  error...', error)
})

