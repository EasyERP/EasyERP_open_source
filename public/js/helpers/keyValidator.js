define(function(){
    "use strict";
    function validator(e){
        var dannyArr = [0, 8, 43, 45];
        var index = dannyArr.indexOf(e.which);

        if (index !== -1 && (e.which < 48 || e.which > 57)) {
            return false;
        }

        return e;
    }

    return validator;
});