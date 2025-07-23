export async function fetchCountries() {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const data = await res.json();

    return data
        .filter(c => c.currencies)
        .map(c => ({
            name: c.name.common,
            currencyCode: Object.keys(c.currencies)[0],
            flag: c.flags.png
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchExchangeRate(currencyCode) {
    const res = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${currencyCode}`);
    const data = await res.json();
    return data.rates[currencyCode] ?? "N/A";
}
