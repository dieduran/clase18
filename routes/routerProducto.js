import { Router } from 'express';
import {todosProductos, productoPorId , nuevoProducto, actualizarProducto, eliminarProducto}  from '../controllers/producto.js'   

//import {productosDao} from '../daos/productos/index.js'

const routerProductos = new Router();

/** Para este ejercicio fijo */
/** Fijamos si el usuario actual es administrador o no */
const USRADMINISTRADOR=true

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

//GET '/api/productos' -> devuelve todos los productos.
routerProductos.get('/', todosProductos);

//GET '/api/productos/:id' -> devuelve un producto según su id.
routerProductos.get('/:id', productoPorId);

//POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
routerProductos.post('/', rutasProtegidas, nuevoProducto);

// //PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
routerProductos.put('/:id', rutasProtegidas, actualizarProducto );

//DELETE '/api/productos/:id' -> elimina un producto según su id.
routerProductos.delete('/:id', rutasProtegidas, eliminarProducto);

//module.exports = routerProductos;
export {routerProductos}