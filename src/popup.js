import { fetchCountries, getExchangeRate } from './utils/api.js';

const amountInput = document.getElementById("amountInput");
const baseCurrencySelect = document.getElementById("baseCurrency");
const targetCountrySelect = document.getElementById("targetCurrency");
const infoContainer = document.getElementById("infoContainer");

let countries = [];

async function populateSelectors() {
    const countries = await fetchCountries();

    // Para base currency (solo monedas únicas)
    const uniqueCurrencies = [...new Set(countries.map(c => c.currencyCode))];
    uniqueCurrencies.sort().forEach(code => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = code;
        baseCurrencySelect.appendChild(opt);
    });

    // Para destino (con bandera y nombre)
    countries.forEach(({ name, flag, currencyCode }) => {
        const opt = document.createElement("option");
        opt.value = JSON.stringify({ name, currencyCode, flag });
        opt.textContent = `${name} (${currencyCode})`;
        targetCountrySelect.appendChild(opt);
    });

    baseCurrencySelect.value = "USD"; // default
    countrySelect.dispatchEvent(new Event("change")); // Auto-load first
}

async function updateConversion() {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        infoContainer.innerHTML = `<p>Ingresa un monto válido.</p>`;
        return;
    }

    const base = baseCurrencySelect.value;
    const { name, currencyCode: target, flag } = JSON.parse(targetCountrySelect.value);

    if (base === target) {
        infoContainer.innerHTML = `
            <img src="${flag}" width="50">
            <p><strong>${amount} ${base} = ${amount} ${target}</strong></p>
            <p>(Moneda base y destino iguales)</p>
        `;
        return;
    }

    const rate = await getExchangeRate(base, target);
    const converted = (rate * amount).toFixed(2);

    infoContainer.innerHTML = `
        <img src="${flag}" width="50">
        <p>1 ${base} = ${rate} ${target}</p>
        <p><strong>${amount} ${base} = ${converted} ${target}</strong></p>
    `;
}

amountInput.addEventListener("input", updateConversion);
baseCurrencySelect.addEventListener("change", updateConversion);
targetCountrySelect.addEventListener("change", updateConversion);

populateSelectors();
