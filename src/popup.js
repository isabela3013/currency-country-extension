import { fetchCountries, fetchExchangeRate } from './utils/api.js';

const countrySelect = document.getElementById("countrySelect");
const infoContainer = document.getElementById("infoContainer");

async function populateCountries() {
    const countries = await fetchCountries();

    countries.forEach(({ name, flag, currencyCode }) => {
        const option = document.createElement("option");
        option.value = JSON.stringify({ name, currencyCode, flag });
        option.textContent = name;
        countrySelect.appendChild(option);
    });

    countrySelect.dispatchEvent(new Event("change")); // Auto-load first
}

async function updateInfo() {
    const { name, currencyCode, flag } = JSON.parse(countrySelect.value);
    const rate = await fetchExchangeRate(currencyCode);

    infoContainer.innerHTML = `
        <img src="${flag}" width="50">
        <p><strong>${name}</strong></p>
        <p>1 USD = ${rate} ${currencyCode}</p>
    `;
}

countrySelect.addEventListener("change", updateInfo);
populateCountries();
