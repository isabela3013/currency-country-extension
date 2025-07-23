export async function fetchCountries() {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,currencies");
    
    if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
        console.error("Unexpected data:", data);
        throw new Error("Expected an array from REST Countries API");
    }

    return data
        .filter(c => c.currencies)
        .map(c => ({
            name: c.name.common,
            currencyCode: Object.keys(c.currencies)[0],
            flag: c.flags.png
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

// src/utils/exchangeRates.js
export async function getExchangeRate(baseCurrency, targetCurrency) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("cachedRates", async (result) => {
            let ratesMap = result.cachedRates || {};

            const cachedEntry = ratesMap[baseCurrency];

            if (!cachedEntry || isCacheStale(cachedEntry.timestamp)) {
                try {
                    const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
                    const data = await res.json();

                    if (!data.rates) {
                        return reject("API error");
                    }

                    ratesMap[baseCurrency] = {
                        timestamp: Date.now(),
                        data: data.rates
                    };

                    chrome.storage.local.set({ cachedRates: ratesMap });
                } catch (err) {
                    console.error("Fetch failed", err);
                    return reject("Fetch failed");
                }
            }

            const rate = ratesMap[baseCurrency].data?.[targetCurrency];
            resolve(rate ?? "N/A");
        });
    });
}

function isCacheStale(timestamp) {
    const CACHE_DURATION = 60 * 60 * 1000; // 1 hora
    return Date.now() - timestamp > CACHE_DURATION;
}

