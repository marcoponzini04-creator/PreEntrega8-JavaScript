// Seleccionamos los elementos del HTML
const formularioEntrada = document.getElementById("formulario-entrada");

const contenedorEntradas = document.getElementById("contenedor-entradas");

const buscadorEntradas = document.getElementById("buscador-entradas");

// Clase que representa las entradas del evento
class Entrada {
    constructor(tipo, precio, sector, stock) {
        this.tipo = tipo;
        this.precio = precio;
        this.sector = sector;
        this.stock = stock;
    }

    // Descuenta una entrada del stock disponible
    vender() {
        if (this.stock > 0) {
            this.stock--;
            return true;
        }

        return false;
    }
}

// Creamos las entradas del evento
const entradaGeneral = new Entrada("General", 10000, "Campo", 100);
const entradaPreferencial = new Entrada("Preferencial", 15000, "Platea", 50);
const entradaVIP = new Entrada("VIP", 25000, "Sector VIP", 20);

// Recuperamos las entradas guardadas o usamos las iniciales
let entradas = JSON.parse(localStorage.getItem("entradas")) ??
    [entradaGeneral, entradaPreferencial, entradaVIP];

// Guardamos las entradas en el almacenamiento del navegador
   function guardarEntradas() {
    localStorage.setItem("entradas", JSON.stringify(entradas));

   }

// Mostramos las entradas disponibles en la página
function renderizarEntradas(lista = entradas) {
    contenedorEntradas.innerHTML = "";
    // Mostramos un mensaje si no hay entradas
if (lista.length === 0) {
    contenedorEntradas.innerHTML = `
        <p class="mensaje-vacio">No se encontraron entradas.</p>
    `;
    return;
}

    lista.forEach((entrada) => {
    const indice = entradas.indexOf(entrada);
    // Extraemos las propiedades del objeto
    const { tipo, precio, sector, stock } = entrada;

    // verificamos la disponibilidad con un operador ternario
        const disponibilidad = stock > 0 ? "Disponible" : "Agotada";
        contenedorEntradas.innerHTML += `
            <div class="tarjeta-entrada">
                <h3>Entrada ${tipo}</h3>
                <p>Precio: $${precio}</p>
                <p>Sector: ${sector}</p>
                <p>Stock disponible: ${stock}</p>
                <p>Estado: ${disponibilidad}</p>

                <button class="boton-vender" data-indice="${indice}">
                    Vender 1 entrada
                </button>

                <button class="boton-eliminar" data-indice="${indice}">
                    Eliminar entrada
                </button>
            </div>
        `;
    });
}

// Mostramos las entradas al cargar la página
renderizarEntradas();

// Detectamos cuando el usuario envía el formulario
formularioEntrada.addEventListener("submit", function(evento) {
    evento.preventDefault();

    // Obtenemos los valores ingresados
    const tipo = document.getElementById("tipo").value;
    const precio = Number(document.getElementById("precio").value);
    const sector = document.getElementById("sector").value;
    const stock = Number(document.getElementById("stock").value);

    // Creamos un objeto con los datos del formulario
const nuevaEntrada = new Entrada(tipo, precio, sector, stock);

// Agregamos la entrada al array
entradas.push(nuevaEntrada);

// Guardamos los cambion en localStorage
guardarEntradas();

// Actualizamos las entradas que aparecen en pantalla
renderizarEntradas();

// Limpiamos los campos del formulario
formularioEntrada.reset();

// Mostramos un mensaje de confirmación
const mensajeEntrada = document.getElementById("mensaje-entrada");

mensajeEntrada.textContent = "¡Entrada agregada correctamente!";
mensajeEntrada.style.color = "green";


});

// Detectamos cuando el usuario hace clic en eliminar
contenedorEntradas.addEventListener("click", function(evento) {

// Detectamos cuando se vende una entrada
if (evento.target.classList.contains("boton-vender")) {
    const indice = Number(evento.target.dataset.indice);
    
    // Verificamos que haya stock disponible
    if (entradas[indice].stock > 0) {
        entradas[indice].stock--;

        // Guardamos el nuevo stock
        guardarEntradas();

        // Actualizamos las tarjetas
        renderizarEntradas();
    }
}    


    if (evento.target.classList.contains("boton-eliminar")) {

        // Obtenemos la posición de la entrada
        const indice = Number(evento.target.dataset.indice);

        // Eliminamos la entrada del array
        entradas.splice(indice, 1);

        // Guardamos la eliminación en localStorage
        guardarEntradas();

        // Actualizamos las tarjetas
        renderizarEntradas();
    }
});

// Buscamos entradas mientras el usuario escribe
buscadorEntradas.addEventListener("input", function() {

    // Obtenemos el texto escrito en el buscador
    const busqueda = buscadorEntradas.value.toLowerCase();

    // Filtramos las entradas según su tipo
    const entradasFiltradas = entradas.filter((entrada) => {
        return entrada.tipo.toLowerCase().includes(busqueda);
    });

    // Mostramos solamente las entradas encontradas
    renderizarEntradas(entradasFiltradas);
});

// Obtenemos el botón para vaciar las entradas
const botonVaciar = document.getElementById("vaciar-entradas");

// Vaciamos todas las entradas al hacer clic
botonVaciar.addEventListener("click", function() {
    entradas.length = 0;

    // Guarsdamos el array vacío en localStorage
    guardarEntradas();

    // Actualizamos las tarjetas en pantalla
    renderizarEntradas();
});
