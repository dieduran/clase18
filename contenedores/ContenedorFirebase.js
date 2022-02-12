import admin from 'firebase-admin'
import config from  '../src/config.js'

admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
})

const db=admin.firestore()

class  ContenedorFirebase {
    constructor  (nombreColeccion){

        this.nombreColeccion=nombreColeccion
        this.coleccion=  db.collection(nombreColeccion);
        //this.conectar();
    }
    
    getAll= async()=>{//    getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        try{
            const contenido = []
            let snapshot = await this.coleccion.get()
            if (snapshot.docs.length > 0) {
                for (const elemento of snapshot.docs) {
                 contenido.push(elemento.data())
              }}
            return contenido
        }catch(error){
            const contenido = []
            return contenido // JSON.parse(contenido)
        }
    }

    save = async(objeto)=>{ //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        let maxId = 0;
       
        const arrObjetos= await this.getAll();
        arrObjetos.forEach(elem => {
            if(elem.id>maxId)
                { maxId=elem.id}
        })
        maxId+=1; //usamos el siguiente id
        objeto.id=maxId
        try{
            const guardado = await this.coleccion.add(objeto)
            return objeto.id;
        }catch (err){
            throw new Error('No se pudo guardar:', err);
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

    // getRandom= async()=> {//getRandom(): Object - Devuelve un objeto random.
    //     const arrObjetos= await this.getAll();
    //     let maxId = 0;
    //     let auxAleatorio; 
    //     arrObjetos.forEach(valor => {
    //             if (valor.id > maxId) {
    //                 maxId = valor.id;}
    //         }
    //     );
    //     auxAleatorio= parseInt(Math.random() * maxId) + 1
    //     try{
    //         const arrObjetos= await this.getAll();
    //         let salida=  arrObjetos.find( obj=> (obj.id===auxAleatorio))
    //         if (salida){
    //             return salida
    //         }else{
    //             return null //porque me daba undefined y pedia null
    //         }
    //     }catch{
    //         throw new Error('Error al obtener el producto aleatorio');
    //     }
    // }

    async update(number,elem) {
        try {
          const doc = this.coleccion.doc(`${number}`)
          await doc.update(elem)
          console.log(`Update id: ${number} ok!`);
        } catch (error) {
          this.MuestroError(error, "update");
          return "Error en conseguir el id: " + number;
        }
      }

    updateById = async(objeto)=>{ //updateById (Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try{
            this.coleccion.where('id','==',objeto.id)
                .get()
                .then(async function(snapshots){
                    const updates=[]
                    snapshots.forEach((doc)=>
                        updates.push(doc.ref.update(objeto))
                    )
                    await Promise.all(updates);
                })

            console.log('actualizado: ', objeto)

            return objeto.id;
        }catch (err){
            throw new Error('Error al actualizar el Id.', err);
        }
    }

    deleteById= async(id)=>{//    deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        try{
            this.coleccion.where('id','==',id)
            .get()
            .then(async function(snapshots){
                const deletes=[]
                snapshots.forEach((doc)=>
                    deletes.push(doc.ref.delete())
                )
                await Promise.all(deletes);
            })

        }catch{
            throw new Error('Error al obtener al borrar el Id');
        }
    }

    deleteAll= async()=>{//    deleteAll(): void - Elimina todos los objetos presentes en el archivo.
        try{
            this.coleccion
            .get()
            .then(async function(snapshots){
                const deletes=[]
                snapshots.forEach((doc)=>
                    deletes.push(doc.ref.delete())
                )
                await Promise.all(deletes);
            })
        } catch(error){
            throw new Error('Error al obtener al borrar todos los objetos');
        }
    }

    updateDetailProductoById = async(id, objetoNuevo)=>{ //updateById (Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try{
            const arrObjetos = await this.getDetailProductoById(id);
            arrObjetos.push(objetoNuevo)

            this.coleccion.where('id','==',id)
            .get()
            .then(async function(snapshots){
                const updates=[]
                snapshots.forEach((doc)=>
                    updates.push(doc.ref.update({productos: arrObjetos}))
                )
                await Promise.all(updates);
            })
            return this.getById(id)
        }catch{
            throw new Error('Error al actualizar detalle producto por Id');
        }
    }

    getDetailProductoById= async(id)=> {//getById(Number): Object - Recibe un id y devuelve el array de detalle
        try{
            const objeto= await this.getById(id);
            if(objeto){
                return objeto.productos;
            }else{
                return []
            }
        }catch{
            throw new Error('Error al obtener el detalle segun Id');
        }
    }

    deleteDetailProductoById = async(id, idProd)=>{ //
        try{
            const arrObjetos = await this.getDetailProductoById(id);
            for (let i=0; i< arrObjetos.length;i++)
            {   
                if(idProd===arrObjetos[i].id){
                    arrObjetos.splice(i,1) //eliminamos la aparicion, deberia ser la unica
                } 
            }

            this.coleccion.where('id','==',id)
            .get()
            .then(async function(snapshots){
                const updates=[]
                snapshots.forEach((doc)=>
                    updates.push(doc.ref.update({productos: arrObjetos}))
                )
                await Promise.all(updates);
            })
            return this.getById(id)

        }catch{
            throw new Error('Error al obtener al actualizar el Id');
        }
    }

}

export default ContenedorFirebase;