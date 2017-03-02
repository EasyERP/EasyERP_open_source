module.exports = function () {
    return new function () {
        this.getRate = function (rates, baseCurrency, newCurrency) {
            if (!rates) {
                return 1;
            }

            if (newCurrency === baseCurrency) {
                return 1;
            }

            if (rates[newCurrency] && rates[newCurrency][baseCurrency]) {
                return rates[newCurrency][baseCurrency];
            }

            if (rates[baseCurrency] && rates[baseCurrency][newCurrency]) {
                return 1 / rates[baseCurrency][newCurrency];
            }

            return 1;
        }
    };
};
