/**
 * Created by Roman on 13.05.2015.
 */
define([], function(){
    function minFromDates(arrayOfDates){
        arrayOfDates = _.map(arrayOfDates, function(date){
            return new Date(date).valueOf();
        });

        return new Date(Math.min.apply(null, arrayOfDates));
    };

    function currencySplitter(currency){
        return currency.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    }

    function weekSplitter(date){
        var year = date.substr(0, 4);
        var week = date.substr(4, 2);
        var date = (year.concat('/')).concat(week);
        return date;
    }

    return {
        minFromDates: minFromDates,
        currencySplitter: currencySplitter,
        weekSplitter: weekSplitter
    };
});