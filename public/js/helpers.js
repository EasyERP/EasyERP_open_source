define([], function () {
    function minFromDates(arrayOfDates) {
        arrayOfDates = _.map(arrayOfDates, function (date) {
            return new Date(date).valueOf();
        });

        return new Date(Math.min.apply(null, arrayOfDates));
    };

    function currencySplitter(currency) {
        return currency.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    }

    function weekSplitter(date) {
        return date.replace(/(\d{4})/, "$1/");
    }

    function spaceReplacer (value){
        return value.replace(/\s/g, '');
    }

    return {
        minFromDates    : minFromDates,
        currencySplitter: currencySplitter,
        weekSplitter    : weekSplitter,
        spaceReplacer   : spaceReplacer
    };
});