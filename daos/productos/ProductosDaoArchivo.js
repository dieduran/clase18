import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

class ProductosDaoArchivo extends ContenedorArchivo {

    constructor(rutaDir) {
        super(`${rutaDir}/producto.json`)
    }
}

export default ProductosDaoArchivo
