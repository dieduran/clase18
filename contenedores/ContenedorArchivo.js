//const fs = require('fs')
import fs from 'fs'

class  ContenedorArchivo {
    constructor (nombreArchivo){
        this.nombreArchivo=  nombreArchivo;
    }

    getAll= async()=>{//    getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        try{
            const contenido = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
            return JSON.parse(contenido)
        }catch(error){
            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify([], null, 2))
            const contenido = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
            return JSON.parse(contenido)
        }
    }

    save = async(objeto)=>{ //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        const arrObjetos= await this.getAll();
        let maxId = 0;
        arrObjetos.forEach(valor => {
                if (valor.id > maxId) {
                    maxId = valor.id;}
            }
        );
        maxId+=1; //usamos el siguiente id
        objeto.id=maxId;
        arrObjetos.push(objeto)
        try{
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(arrObjetos, null, 2))
            return objeto.id;
        }catch{
            throw new Error('No se pudo guardar');
        }
    }

    getById= async(id)=> {//getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try{
            const arrObjetos= await this.getAll();
            let salida=  arrObjetos.find( obj=> (obj.id===id))
            if (salida){
                return salida
            }else{
                return null //porque me daba undefined y pedia null
            }
        }catch{
            throw new Error('Error al obtener el Id');
        }
    }

    getRandom= async()=> {//getRandom(): Object - Devuelve un objeto random.
        const arrObjetos= await this.getAll();
        let maxId = 0;
        let auxAleatorio; 
        arrObjetos.forEach(valor => {
                if (valor.id > maxId) {
                    maxId = valor.id;}
            }
        );
        auxAleatorio= parseInt(Math.random() * maxId) + 1
        try{
            const arrObjetos= await this.getAll();
            let salida=  arrObjetos.find( obj=> (obj.id===auxAleatorio))
            if (salida){
                return salida
            }else{
                return null //porque me daba undefined y pedia null
            }
        }catch{
            throw new Error('Error al obtener el producto aleatorio');
        }
    }

    updateById = async(objeto)=>{ //updateById (Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try{
            const arrObjetos= await this.getAll();
            const nuevoArray=arrObjetos.map(obj => {
                if (parseInt(objeto.id)===parseInt(obj.id)){
                    return objeto
                }else{
                    return obj
                }})
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(nuevoArray, null, 2))
            return objeto.id
        }catch{
            throw new Error('Error al obtener al actualizar el Id');
        }
    }

    deleteById= async(id)=>{//    deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        try{
            const arrObjetos= await this.getAll();
            for (let i=0; i< arrObjetos.length;i++)
            {   
                if(id===arrObjetos[i].id){
                    arrObjetos.splice(i,1) //eliminamos la aparicion, deberia ser la unica
                } 
            }
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(arrObjetos, null, 2))
        }catch{
            throw new Error('Error al obtener al borrar el Id');
        }
    }

    deleteAll= async()=>{//    deleteAll(): void - Elimina todos los objetos presentes en el archivo.
        try{
            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify([], null, 2))
        } catch(error){
            throw new Error('Error al obtener al borrar todos los objetos');
        }
    }

    updateDetailProductoById = async(id, objetoNuevo)=>{ //updateById (Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try{
            const arrObjetos= await this.getAll();
            const nuevoArray=arrObjetos.map(obj => {
                if (parseInt(obj.id)===parseInt(id)){
                    obj.productos.push(objetoNuevo)
                    return obj
                }else{
                    return obj //como estaba
                }})
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(nuevoArray, null, 2))
            return objetoNuevo.id
        }catch{
            throw new Error('Error al obtener al actualizar el Id');
        }
    }

    getDetailProductoById= async(id)=> {//getById(Number): Object - Recibe un id y devuelve el array de detalle
        try{
            const arrObjetos= await this.getAll();
            let objeto= arrObjetos.find( obj=> (obj.id===id))
            if (objeto){
                return objeto.productos
            }else{
                return []
            }
        }catch{
            throw new Error('Error al obtener el detalle segun Id');
        }
    }

    deleteDetailProductoById = async(id, idProd)=>{ //
        try{
            const arrObjetos= await this.getAll();
            const nuevoArray=arrObjetos.map(obj => {
                if (parseInt(obj.id)===parseInt(id)){
                    for (let i=0; i< obj.productos.length;i++)
                    {   
                        if(idProd===obj.productos[i].id){
                            obj.productos.splice(i,1) //eliminamos la aparicion, deberia ser la unica
                        } 
                    }
                    return obj
                }else{
                    return obj //como estaba
                }})
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(nuevoArray, null, 2))
            return id
        }catch{
            throw new Error('Error al obtener al actualizar el Id');
        }
    }

}

//module.exports= Contenedor;
export default ContenedorArchivo;