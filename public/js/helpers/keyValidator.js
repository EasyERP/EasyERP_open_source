define(function(){
    "use strict";
    function validator(e, isDot){
        var dannyArr = [0, 8];
        var index;
        if (isDot){
            dannyArr.push(46);
        }

        index = dannyArr.indexOf(e.which);

        if (index === -1 && (e.which < 48 || e.which > 57)) {
            return false;
        }

        return e;
    }

    return validator;
});