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

    return {
        minFromDates: minFromDates
    };
});