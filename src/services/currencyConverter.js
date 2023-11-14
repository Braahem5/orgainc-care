const exchangeRate = require("open-exchange-rates"),
  fx = require("money");

exchangeRate.set({ app_id: process.env.OPEN_EXCHANGE_RATE_ID });

function currencyConverter(amount, productCurrency, userPreferredCurrency) {
  return new Promise((resolve, reject) => {
    exchangeRate.latest(function (err, data) {
      if (err) {
        // error occurred
        console.log("Error:", err);
        reject(err);
      } else {
        try {
          fx.base = "USD";
          fx.rates = {};
          for (let i in data) {
            fx.rates[i] = data.rates[i];
          }
          fx.settings = { from: productCurrency };
          let amountInEur = fx(amount).to("EUR");
          let convertedAmount = fx(amount).to(userPreferredCurrency);
          resolve([convertedAmount, amountInEur]);
        } catch (err) {
          console.error(`Currency conversion failed with ${err}`);
          reject(err);
        }
      }
    });
  });
}

module.exports = currencyConverter;
