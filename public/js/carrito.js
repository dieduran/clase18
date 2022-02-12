let idCarrito=0
inicializarCarrito();
cargarProductos();

async function inicializarCarrito(){
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    };
    await fetch('/api/carrito/', settings)
        .then(response => response.json())
        .then((rta) => {
            idCarrito = rta.id
            cargarCarrito(idCarrito)
        })
}

async function agregarProducto(codProducto, nombre, cantidad, precio){
    const data ={id: codProducto, nombre, stock:cantidad, precio}
    console.log(data)
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    await fetch(`/api/carrito/${idCarrito}/productos`, settings)
        .then(response => response.json())
        .then((rta) => {
            cargarCarrito(idCarrito)
        })
}

async function quitarDelCarro(idProducto){
    const settings = {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    await fetch(`/api/carrito/${idCarrito}/productos/${idProducto}`, settings)
        .then(response => response.json())
        .then((rta) => {
            cargarCarrito(idCarrito)
        })
}

async function vaciarCarrito(){
    console.log('vaciar..')
    const settings = {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    console.log('vaciamos...')
    await fetch(`/api/carrito/${idCarrito}`, settings)
        .then(response => response.json())
        .then((rta) => {
             inicializarCarrito()
            })
}

async function finalizarPedido(){
    console.log('finalizar pedido..')
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    console.log('vaciamos...')
    await fetch(`/api/carrito/${idCarrito}/finalizar`, settings)
        .then(response => response.json())
        .then((rta) => {
            inicializarCarrito()
            const listaCarrito = document.getElementById('listaCarrito')
            let htmlCarrito=""
            htmlCarrito+=`<div >`
            htmlCarrito+=`<center>Pedido finalizado. Datos enviados.</center>`
            htmlCarrito+=`</div>`
            listaCarrito.innerHTML= htmlCarrito;
        })
}


async function cargarCarrito() {
    const listaCarrito = document.getElementById('listaCarrito')
    const productos = await fetch(`/api/carrito/${idCarrito}/productos`).then(response => response.json())
    let htmlCarrito=""
    htmlCarrito+=`<div >`
    productos.forEach(elem => {
        console.log(elem.foto)
        console.log(elem);
        //esto iba dentro del class "card card-product"
        // <div class="img-carg"><img style="max-height: 100px; max-width: 100px; display: block" src=${elem.foto}"></div>
        htmlCarrito+= `<div >  
            <div class="card card-product">
                <div class="info-card">
                    <h4 >${elem.nombre}</h4>
                    <h6>${elem.descripcion}</h6>
                    Cantidad: ${elem.stock}
                    Precio: ${elem.precio}
                    <a onclick= "quitarDelCarro(${elem.id})" class="btn btn-sm btn-danger float-right">Quitar del Carro</a>	
                    <p class="precio">$ ${elem.precio}</p>
                </div> 
            </div>
        </div> `
    });
    htmlCarrito+=`</div>`
    console.log(productos.length)
    if (productos.length>0) {
        htmlCarrito+='<a onclick="vaciarCarrito()" class="btn btn-sm btn-danger" >Vaciar Carro</a> (*) solo a efectos de usar la API de borrado de carrito'
        htmlCarrito+='<a onclick="finalizarPedido()" class="btn btn-success float-right" >Finalizar Pedido</a>'
    }
    listaCarrito.innerHTML= htmlCarrito;
}

async function cargarProductos() {
    const listaProductos = document.getElementById('listaProductos')
    const productos  = await fetch('/api/productos').then(response => response.json())
    let htmlProducto=""
    htmlProducto+=`<div >`
    productos.forEach(elem => {
        //esto iba dentro del class "card card-product"
        htmlProducto+= `<div >  
        <div class="card card-product">
            <div class="img-card"  ><img style="max-height: 100px; max-width: 100px; display: block" src=${elem.foto}"></div>
            <div class="info-card">
                <h4 >${elem.nombre}</h4>
                <h6>${elem.descripcion}</h6>
                Codigo: ${elem.codigo}</p>
                <a onclick= "agregarProducto(${elem.id},'${elem.nombre}',1,${elem.precio})"  class="btn btn-sm btn-success float-right">Agregar al Carro</a>	
                <p class="precio">$ ${elem.precio}</p>
            </div> 
            </div>
        </div> `
    });
    htmlProducto+=`</div>`
    listaProductos.innerHTML= htmlProducto;
}


