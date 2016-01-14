define(function(){
    "use strict";
    function validator(e){
        var dannyArr = [0, 8];   // opportunity to enter minus and plus taken away
        var index = dannyArr.indexOf(e.which);

        if (index === -1 && (e.which < 48 || e.which > 57)) {
            return false;
        }

        return e;
    }

    return validator;
});