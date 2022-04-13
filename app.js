// Variables 
const ingreso = document.querySelector('#ingreso');
const gasto = document.querySelector('#gasto');
const input = document.querySelector('input');
const boton = document.querySelector('.btnAgregar');
const opciones = document.querySelector('.opciones');
const montoFinal = document.querySelector('.montoFinal');
const tarjetas = document.querySelector('.tarjetas');
const select = document.querySelector('#select');
// Arrays
let ingresoGasto = [];


// Eventos
// Cargar el localStorage el cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Elegir el localStorage, en su defecto el array vacío
    ingresoGasto = JSON.parse(localStorage.getItem('ingresoGasto')) || [];

    escribirHTML(ingresoGasto);
})
// Hacer funcional el botón
boton.addEventListener('click', guardarDatos);
document.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        guardarDatos();
    }
})
select.addEventListener('change', selectChange);
// Desmarcar radio que no se usa
gasto.addEventListener('click', revisarRadio);
ingreso.addEventListener('click', revisarRadio2);

// Clase para los ingresos y egresos
class Datos {
    constructor(cantidad, tipo, fecha) {
        this.cantidad = cantidad,
            this.tipo = tipo,
            this.fecha = fecha,
            this.id = Date.now()
    }
}

// Funciones
function guardarDatos() {
    // Datos para el objeto
    let valor = parseFloat(input.value);
    // Fecha
    const dateTime = luxon.DateTime;
    const actual = dateTime.now();
    const dia = actual.toLocaleString();
    const hora = actual.toLocaleString(dateTime.TIME_SIMPLE);
    textoFecha = ` ${dia} a las ${hora}hs`;

    // Comprobar si es gasto o ingreso
    if (gasto.checked & input.value !== '') {

        let tipoDeValor = "egreso";
        ingresoGasto.push(new Datos(valor, tipoDeValor, textoFecha));

        escribirHTML(ingresoGasto);

    } else if (ingreso.checked & input.value !== '') {

        let tipoDeValor = "ingreso";
        ingresoGasto.push(new Datos(valor, tipoDeValor, textoFecha));

        escribirHTML(ingresoGasto);

    } else {
        const div = document.createElement('div');
        div.textContent = 'Tenés que marcar 1 opción';
        opciones.appendChild(div);
        setTimeout(
            () => {
                div.remove();
            }, 3000
        )
    }
    resetForm();
}

// Escribir el HTML
function escribirHTML(ingresoGasto) {
    tarjetas.textContent = '';
    ingresoGasto.forEach(element => {
        const div = document.createElement('div');

        // Agregar botón de eliminar
        const botonEliminar = document.createElement('p');
        botonEliminar.classList.add('botonEliminar');
        botonEliminar.textContent = "X";

        // Añadir función de eliminar
        botonEliminar.addEventListener('click', () => {
            borrarMonto(element.id);
        })

        // Añadir la tarjeta al HTML
        div.textContent = `Tuviste un ${element.tipo} de $${element.cantidad} el ${element.fecha}`;
        tarjetas.appendChild(div);
        div.appendChild(botonEliminar);
    });
    let ingresosSumas = ingresoGasto.filter(element => element.tipo == 'ingreso');
    let egresosSumas = ingresoGasto.filter(element => element.tipo == 'egreso');

    let ingresosSuma = [];
    let gastosSuma = [];
    let ingresoCero = 0;
    let gastoCero = 0;
    for (let i = 0; i < ingresosSumas.length; i++) {
        ingresosSuma.push(ingresosSumas[i].cantidad);
    }
    for (let i = 0; i < egresosSumas.length; i++) {
        gastosSuma.push(egresosSumas[i].cantidad);
    }

    for (let i = 0; i < ingresosSuma.length; i++) {
        ingresoCero += ingresosSuma[i];
    }
    for (let i = 0; i < gastosSuma.length; i++) {
        gastoCero += gastosSuma[i];
    }

    const sumaTotal = ingresoCero - gastoCero;
    montoFinal.textContent = `Monto total $${sumaTotal}`;

    localStorage.setItem('ingresoGasto', JSON.stringify(ingresoGasto));
}

// Función para borrar el monto
function borrarMonto(id) {
    ingresoGasto = ingresoGasto.filter(element => element.id !== id);

    escribirHTML(ingresoGasto);
}


// Filtrar entre egresos e ingresos
function selectChange() {
    if (select.value == 'todos') {
        escribirHTML(ingresoGasto);
    } else if (select.value == 'ingresos') {
        escribirHTML(ingresoGasto.filter(element => element.tipo == 'ingreso'))
    } else if (select.value == 'egresos') {
        escribirHTML(ingresoGasto.filter(element => element.tipo == 'egreso'))
    }
}

// Resetear formulario
function resetForm() {
    gasto.checked = false;
    ingreso.checked = false;
    input.value = '';
}

// Resetea el radio que no quieras usar
function revisarRadio() {
    if (gasto.checked) {
        ingreso.checked = false;
    }
}
function revisarRadio2() {
    if (ingreso.checked) {
        gasto.checked = false;
    }
}
