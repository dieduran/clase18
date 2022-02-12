
import {carritosDao} from '../daos/carritos/index.js'
import logger from '../src/logger.js'
import enviamosCorreo from '../src/mail.js'
import enviamosSMS from '../src/sms.js'
import enviamosWHP from '../src/whatsapp.js'
/**
 * id
 * timestamp(carrito)
 * productos [{id timestamp(producto),nombre, descripcion, codigo, foto(url),precio,stock}]
 */

const nuevoCarrito= async (req, res) => {
    const {timestamp=Date.now(), productos= [] , idusuario }= req.body
    const finalizado=0
    const id= await carritosDao.save({timestamp, productos, idusuario, finalizado})
    res.json({id})
}

const eliminarCarrito =async(req, res) => {
    const id=parseInt(req.params.id)
    let salida=  await carritosDao.getById(id)
    if(!salida){
        return res.json({ error : 'carrito no encontrado' })
    }
    await carritosDao.deleteById(id)
    return res.json(salida);
}

const todosProductosCarrito= async(req, res) => {
    const idCarro=parseInt(req.params.id)
    let salida=  await carritosDao.getDetailProductoById(idCarro)
    if(!salida){
        return res.json({ error : 'carro no actualizado' })
    }
    return res.json(salida);
}

const agregarProductoCarroId =  async(req, res) => {
    const idCarro=parseInt(req.params.id)
    const {id,timestamp=Date.now(),nombre='',descripcion='', codigo='', foto='',precio=0,stock=0}= req.body
    const nuevoDetalleProducto= { id, timestamp, nombre, descripcion, codigo, foto, precio, stock}
    let salida=  await carritosDao.updateDetailProductoById(idCarro,nuevoDetalleProducto)
    if(!salida){
        return res.json({ error : 'carro no actualizado' })
    }
    return res.json(salida);
}

const eliminarProductoCarrito =async(req, res) => {
    const id=parseInt(req.params.id)
    const id_prod=parseInt(req.params.id_prod)
    let salida=  await carritosDao.getById(id)
    if(!salida){
        /* ahora borramos el item */
        return res.json({ error : 'carro no encontrado' })
    }
    await carritosDao.deleteDetailProductoById(id,id_prod)
    return res.json(salida);
}

const finalizarCarrito =async(req, res) => {
    const idCarro=parseInt(req.params.id)
    //console.log('en finalizarCarrito...')
    logger.info('Finalizamos carrito...')
    const usuario= req.user

    let salida=  await carritosDao.getById(idCarro)
    if(!salida){
        /* ahora borramos el item */
        return res.json({ error : 'carro no encontrado' })
    }
    //await carritosDao.deleteDetailProductoById(id,id_prod)

    let date = new Date();
    let fechaFin = date.toLocaleString();
    let separador=`---------------------- \n`
    let textoMensaje=separador
    textoMensaje+=`Pedido finalizado\n`
    textoMensaje+=fechaFin + `\n`
    textoMensaje+=separador
    textoMensaje+=`Nombre: ${usuario.name}\n` 
    textoMensaje +=`Usuario: ${usuario.username}\n`
    textoMensaje+=`Direccion: ${usuario.address}\n`
    textoMensaje+=`Telefono: ${usuario.phone}\n`
    textoMensaje+=`\n`
    textoMensaje+=separador
    textoMensaje+=`Cantidad . Producto  \n`
    textoMensaje+=separador

    let productos=  await carritosDao.getDetailProductoById(idCarro)
    
    productos.forEach(pro =>{
        textoMensaje+=`${pro.stock} . ${pro.nombre}  \n`
    })

    textoMensaje+=`-----------------\n`
    textoMensaje+=`Fin del pedido\n`

    enviamosCorreo(`Nuevo pedido de: ${usuario.name} ${usuario.username}`,textoMensaje)
    enviamosWHP(textoMensaje)
    enviamosSMS("El pedido ha sido recibido y se encuentra en proceso.")

    //console.log(textoMensaje)
    logger.info(textoMensaje)
    return res.json(salida);
}

//module.exports={ nuevoCarrito,eliminarCarrito,todosProductosCarrito, agregarProductoCarroId, eliminarProductoCarrito}
export { nuevoCarrito,eliminarCarrito,todosProductosCarrito, agregarProductoCarroId, eliminarProductoCarrito, finalizarCarrito}