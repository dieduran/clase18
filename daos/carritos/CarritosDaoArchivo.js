import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

class CarritosDaoArchivo extends ContenedorArchivo {

    constructor(rutaDir) {
        super(`${rutaDir}/carrito.json`)
    }
}

export default CarritosDaoArchivo
