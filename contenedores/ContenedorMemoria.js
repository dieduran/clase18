class  ContenedorMemoria {
    constructor (){
        this.elementos=[]
    }

    getAll= async()=>{//    getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        return [...this.elementos]
    }

    save = async(objeto)=>{ //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        let maxId = 0;
        this.elementos.forEach(valor => {
                if (valor.id > maxId) {
                    maxId = valor.id;}
            }
        );
        maxId+=1; //usamos el siguiente id
        objeto.id=maxId;
        this.elementos.push(objeto)
        return objeto.id;
    }

    getById= async(id)=> {//getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.

        const salida= this.elementos.find(elem=> elem.id==id)
        return salida
    }

    getRandom= async()=> {//getRandom(): Object - Devuelve un objeto random.
        let maxId = 0;
        let auxAleatorio; 
        this.elementos.forEach(valor => {
                if (valor.id > maxId) {
                    maxId = valor.id;}
            }
        );
        auxAleatorio= parseInt(Math.random() * maxId) + 1

        const salida= this.elementos.find(elem=> elem.id==auxAleatorio)
        if(salida){
            return salida
        }else{
            return null//porqeu me daba undefined y pedia null
        }
    }

    updateById = async(objeto)=>{ //updateById (Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        const index= this.elementos.findIndex(p=>p.id==objeto.id)
        if (index==-1){
            throw new Error(`Error al actualizar: elemento no encontrado`)
        } else {
            this.elementos[ index ] = objeto
            return objeto
        }
    }

    deleteById= async(id)=>{//    deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        const index = this.elementos.findIndex(elem => elem.id == id)
        if (index == -1) {
            throw new Error(`Error al borrar: elemento no encontrado`)
        } else {
            return this.elementos.splice(index, 1)[ 0 ]
        }        
    }

    deleteAll= async()=>{//    deleteAll(): void - Elimina todos los objetos presentes en el archivo.
        this.elementos=[]
    }

    updateDetailProductoById = async(id, objetoNuevo)=>{ //updateById (Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        const arrObjetos= this.elementos;
        const nuevoArray=arrObjetos.map(obj => {
            if (parseInt(obj.id)===parseInt(id)){
                obj.productos.push(objetoNuevo)
                return obj
            }else{
                return obj //como estaba
            }})
        this.elementos= nuevoArray;
        return objetoNuevo.id;
    }

    getDetailProductoById= async(id)=> {//getById(Number): Object - Recibe un id y devuelve el array de detalle
        let objeto= this.elementos.find( obj=> (obj.id===id))
        if (objeto){
            return objeto.productos
        }else{
            return []
        }
    }

    deleteDetailProductoById = async(id, idProd)=>{ //
        const arrObjetos= this.elementos;
        console.log(arrObjetos)
        const nuevoArray=arrObjetos.map(obj => {
            if (parseInt(obj.id)===parseInt(id)){
                for (let i=0; i< obj.productos.length;i++)
                {   
                    if(idProd===obj.productos[i].id){
                        obj.productos.splice(i,1) //eliminamos la aparicion, deberia ser la unica
                        console.log(idProd)
                    } 
                }
                return obj
            }else{
                return obj //como estaba
            }})
        this.elementos= nuevoArray;
        return id
    }
}

//module.exports= Contenedor;
export default ContenedorMemoria;