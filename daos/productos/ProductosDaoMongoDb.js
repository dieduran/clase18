import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {

// const {timestamp=Date.now(),  nombre='', 
// descripcion='', codigo='', foto='', precio=0,  stock=0 }= req.body
    constructor() {
        super('productos',{
            id: { type: Number },
            timestamp: {type: Date, required: true},
            nombre: { type: String, required: true },
            descripcion: { type: String, required: true },
            codigo: { type: String, required: true },
            foto: { type: String, required: true },
            precio: { type: Number, default: 0 },
            stock: { type: Number, required: true }
        })
    }
}

export default ProductosDaoMongoDb
