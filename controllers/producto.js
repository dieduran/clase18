//import Contenedor from '../contenedores/ContenedorArchivo.js'
import {productosDao} from '../daos/productos/index.js'

const todosProductos= async(req, res) => {
    res.json(await productosDao.getAll());
}

const productoPorId =  async(req, res) => {
    const id=parseInt(req.params.id)
    let salida=  await productosDao.getById(id)
    if(!salida){
        return res.json({ error : 'producto no encontrado' })
    }
    return res.json(salida);
}

const nuevoProducto= async(req, res) => {
    const {timestamp=Date.now(),  nombre='', descripcion='', codigo='', foto='', precio=0,  stock=0 }= req.body
    const id= await productosDao.save({timestamp,  nombre, descripcion, codigo, foto, precio,  stock})
    return res.json({id})
}

const actualizarProducto = async(req, res) => {
    const id=parseInt(req.params.id)
    const {timestamp=Date.now(),  nombre='', descripcion='', codigo='', foto='', precio=0,  stock=0 }= req.body
    let salida=  await  productosDao.getById(id) 
    if(!salida){
        return res.json({ error : 'producto no encontrado' })
    }
    const rtaId=await productosDao.updateById({id, timestamp,  nombre, descripcion, codigo, foto, precio,  stock})
    return res.json({id: rtaId})
}

const eliminarProducto =async(req, res) => {
    const id=parseInt(req.params.id)
    let salida=  await productosDao.getById(id)
    if(!salida){
        return res.json({ error : 'producto no encontrado' })
    }
    await productosDao.deleteById(id)
    return res.json(salida);
}

export { todosProductos, productoPorId, nuevoProducto, actualizarProducto, eliminarProducto}