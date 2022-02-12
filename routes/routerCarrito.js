import { Router } from 'express';
import {nuevoCarrito, eliminarCarrito, todosProductosCarrito, agregarProductoCarroId, eliminarProductoCarrito, finalizarCarrito}  from '../controllers/carrito.js'

const routerCarritos = new Router();

/** Para este ejercicio fijo */
/** Fijamos si el usuario actual es administrador o no */
const USRADMINISTRADOR=false

/** protegemos ruta como middleware*/
const rutasProtegidas = new Router()

rutasProtegidas.use((req, res, next) => {
    if (USRADMINISTRADOR===false){
        //console.log(req)
        res.json({ error: -1, descripcion: `ruta '${req.baseUrl}' metodo '${req.method}'  no autorizada.`});
        return
    }
    next();
});

//POST '/api/carrito' -> crea un carrito
routerCarritos.post('/', nuevoCarrito);

//DELETE '/api/carrito/:id' -> elimina el carrito según su id.
routerCarritos.delete('/:id', eliminarCarrito);

//POST '/api/carrito/:id' -> elimina el carrito según su id.
routerCarritos.post('/:id/finalizar', finalizarCarrito);

//GET '/api/carrito/:id/productos' -> devuelve todos los productos del carrito
routerCarritos.get('/:id/productos', todosProductosCarrito);

//POST '/api/carrito/:id/productos' -> recibe y agrega un producto
routerCarritos.post('/:id/productos', agregarProductoCarroId);

//DELETE '/api/carrito/:id' -> elimina el id del carrito según su id.
routerCarritos.delete('/:id/productos/:id_prod', eliminarProductoCarrito);

//module.exports =  routerCarrito;
export {routerCarritos}