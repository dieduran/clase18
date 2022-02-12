import config from '../../src/config.js'

let carritosDao

switch (config.OPCION_DATOS) {
    case 'json':
        const { default: CarritosDaoArchivo } = await import('./CarritosDaoArchivo.js')
        carritosDao = new CarritosDaoArchivo(config.fileSystem.path)
        break
    case 'firebase':
        const { default: CarritosDaoFirebase } = await import('./CarritosDaoFirebase.js')
        carritosDao = new CarritosDaoFirebase()
        break
    case 'mongodb':
        const { default: CarritosDaoMongoDb } = await import('./CarritosDaoMongoDb.js')
        carritosDao = new CarritosDaoMongoDb()
        break
    default:
        const { default: CarritosDaoMemoria } = await import('./CarritosDaoMemoria.js')
        carritosDao = new CarritosDaoMemoria()
        break
}

export { carritosDao }
