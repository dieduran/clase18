import config from '../../src/config.js'

let productosDao

switch (config.OPCION_DATOS) {
    case 'json':
        const { default: ProductosDaoArchivo } = await import('./ProductosDaoArchivo.js')
        productosDao = new ProductosDaoArchivo(config.fileSystem.path)
        break
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./ProductosDaoFirebase.js')
        productosDao = new ProductosDaoFirebase()
        break
    case 'mongodb':
        const { default: ProductosDaoMongoDb } = await import('./ProductosDaoMongoDb.js')
        productosDao = new ProductosDaoMongoDb()
        break
    default:
        const { default: ProductosDaoMemoria } = await import('./ProductosDaoMemoria.js')
        productosDao = new ProductosDaoMemoria()
        break
}

export { productosDao }
