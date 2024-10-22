const monedaSelect = document.querySelector('#moneda');
const criptoSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultadoDiv = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded', () => {
    apiCriptos();
    formulario.addEventListener('submit', validarFormulario);
});

async function apiCriptos() {

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try {
        const res = await fetch(url);
        const resp = await res.json();
        llenarCriptoSelect(resp.Data);
    } catch (error) {
        console.log(error);
    }
}

function llenarCriptoSelect(criptos) {

    criptos.forEach( cripto => {
        const { CoinInfo: { Name, FullName } } = cripto;

        const optionCripto = document.createElement('OPTION');
        optionCripto.value = Name;
        optionCripto.textContent = FullName;

        criptoSelect.appendChild(optionCripto);
    });

}

async function validarFormulario(e) {
    e.preventDefault();
    const moneda = monedaSelect.value;
    const cripto = criptoSelect.value;

    if(moneda === '' || cripto === '') {
        mostrarAlerta('Llene los campos');
        return;
    }

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}`;

    mostrarSpinner();

        try {
            const res = await fetch(url);
            const comparacion = await res.json();
            imprimirComparacion(comparacion.DISPLAY[cripto][moneda])
        } catch (error) {
            console.log(error);
        }
}

function imprimirComparacion(cotizacion) {

    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `<p>Precio más alto del dia: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `<p>Precio más bajo del dia: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `<p>Variacion del precio en las ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `<p>Ultima actualizacion: <span>${LASTUPDATE}</span>`;

    resultadoDiv.appendChild(precio);
    resultadoDiv.appendChild(precioAlto);
    resultadoDiv.appendChild(precioBajo);
    resultadoDiv.appendChild(ultimasHoras);
    resultadoDiv.appendChild(ultimaActualizacion);

}

function limpiarHTML() {
    while(resultadoDiv.firstChild) {
        resultadoDiv.removeChild(resultadoDiv.firstChild);
    }
}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.error');

    if(!existeAlerta){
        const alerta = document.createElement('P');
        alerta.classList.add('error');
        alerta.textContent = mensaje;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');

    spinner.innerHTML = `<div class="bounce1"></div>
                         <div class="bounce2"></div>
                         <div class="bounce3"></div>`;

    resultadoDiv.appendChild(spinner);                     
}

