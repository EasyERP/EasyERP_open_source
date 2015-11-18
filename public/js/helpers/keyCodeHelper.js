define([], function () {
    var isDigit = function (keyCode) {
        return (keyCode >= 48 && keyCode <= 57) //0-9 number
            || (keyCode >= 96 && keyCode <= 105); //0-9 numpad
    };

    var isBackspace = function (keyCode) {
        return keyCode === 8;
    };

    return {isDigit: isDigit, isBackspace: isBackspace};
});
