cargarProductos();

async function modificarProducto(idProducto){
    const nombre  = document.getElementById('nombre').value
    const descripcion  = document.getElementById('descripcion').value
    const codigo  = document.getElementById('codigo').value
    const foto  = document.getElementById('foto').value
    const precio  = document.getElementById('precio').value
    const stock  = document.getElementById('stock').value
    const data={nombre,descripcion,codigo,foto,precio,stock}
    console.log(data)

    const settings = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    await fetch(`/api/productos/${idProducto}`, settings)
        .then(response => response.json())
        .then((rta) => {
            console.log(rta)
            console.log('envio modificarProducto')
            cargarProductos()
        })
}

async function eliminarProducto(idProducto){
    const settings = {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    await fetch(`/api/productos/${idProducto}`, settings)
        .then(response => response.json())
        .then((rta) => {
            cargarProductos();
        })
}

async function prepararModificarEliminar(id, modificar=true){
    const producto  = await fetch(`/api/productos/${id}`).then(response => response.json())
    const formularioEditor  = document.getElementById('formularioEditor')
    console.log(producto)
    console.log(producto.nombre)
    let htmlFormulario=''
    if (modificar===false){
        htmlFormulario+=`<h2>Eliminar producto</h2>`
    }else{
        htmlFormulario+=`<h2>Modificar producto</h2>`
    }
    htmlFormulario+=`
        <div class="row">
        <form action="/api/productos" class="card col-md-4" style="background-color:darkgray;">
            nombre:      <input type="text" id="nombre" name="nombre" value="${producto.nombre}"  ><br>
            descripcion: <input type="text" id="descripcion" name="descripcion"  value="${producto.descripcion}"><br>
            codigo:      <input type="text" id="codigo" name="codigo" value="${producto.codigo}"><br>
            foto: <input type="text" id="foto" name="foto" value="${producto.foto}"><br>
            precio: <input type="text" id="precio" name="precio" value="${producto.precio}"><br>
            stock: <input type="text" id="stock" name="stock" value="${producto.stock}"><br>`
            if (modificar===false){
                htmlFormulario+=`<a onclick="eliminarProducto(${id})" class="btn btn-sm btn-success float-right" >Grabar</a>`
            }else{
                htmlFormulario+=`<a onclick="modificarProducto(${id})" class="btn btn-sm btn-success float-right" >Grabar</a>`
            }
            htmlFormulario+=`
            <a onclick="prepararNuevo()" class="btn btn-sm btn-danger " >Cancelar</a>
        </form>
        </div>`
    formularioEditor.innerHTML= htmlFormulario;
}

async function cargarProductos() {
    const listaProductos = document.getElementById('listaProductos')
    const productos  = await fetch('/api/productos').then(response => response.json())
    let htmlProducto=""
    htmlProducto+=`<div class="row">`
    productos.forEach(elem => {
        htmlProducto+= `<div class="col-md-4">  
            <div class="card card-product">
                <div class="img-carg"><img style="max-height: 100px; max-width: 100px; display: block" src=${elem.foto}"></div>
                <div class="info-card">
                    <h4 >${elem.nombre}</h4>
                    <hr>
                    <h6>${elem.descripcion}</h6>
                    <p>Cantidad: ${elem.stock} <br>
                    Codigo: ${elem.codigo}</p>
                    <a onclick="prepararModificarEliminar(${elem.id},false)" class="btn btn-sm btn-danger float-right">Eliminar</a>	
                    <a onclick="prepararModificarEliminar(${elem.id},true)" class="btn btn-sm btn-success float-right">Editar</a>	
                    <p class="precio">$ ${elem.precio}</p>
                </div> 
            </div>
        </div> `
    });
    htmlProducto+=`</div>`
    listaProductos.innerHTML= htmlProducto;
    prepararNuevo();
}

async function prepararNuevo(){
    const formularioEditor  = document.getElementById('formularioEditor')
    let htmlFormulario=''
    htmlFormulario+=`
        <h2>Agregar nuevo producto</h2>
        <div class="row">
        <form action="/api/productos" class="card col-md-4" style="background-color:darkgray;">
            nombre:      <input type="text" id="nombre" name="nombre" required><br>
            descripcion: <input type="text" id="descripcion" name="descripcion" required><br>
            codigo:      <input type="text" id="codigo" name="codigo" required><br>
            foto: <input type="text" id="foto" name="foto"><br>
            precio: <input type="text" id="precio" name="precio" required="true"><br>
            stock: <input type="text" id="stock" name="stock"><br>
            <a onclick="agregarNuevoProducto()" class="btn btn-sm btn-success float-right" >Grabar</a>
            <a onclick="limpiarProductos()" class="btn btn-sm btn-danger " >Cancelar</a>
        </form>
        </div>`
    formularioEditor.innerHTML= htmlFormulario;
}

async function agregarNuevoProducto(){
    const nombre  = document.getElementById('nombre').value
    const descripcion  = document.getElementById('descripcion').value
    const codigo  = document.getElementById('codigo').value
    const foto  = document.getElementById('foto').value
    const precio  = document.getElementById('precio').value
    const stock  = document.getElementById('stock').value
    const data={nombre,descripcion,codigo,foto,precio,stock}
    console.log(data)

    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    console.log(settings)
    await fetch(`/api/productos/`, settings)
        .then(response => response.json())
        .then((rta) => {
            console.log(rta)
            console.log('envio agregarNuevoProducto')
            cargarProductos()
        })
}

async function limpiarProductos(){
    document.getElementById('nombre').value=""
    document.getElementById('descripcion').value=""
    document.getElementById('codigo').value=""
    document.getElementById('foto').value=""
    document.getElementById('precio').value=""
    document.getElementById('stock').value=""
}