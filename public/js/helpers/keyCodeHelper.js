define([], function () {
    var isDigit = function (keyCode) {
        return (keyCode >= 48 && keyCode <= 57) //0-9 number
            || (keyCode >= 96 && keyCode <= 105); //0-9 numpad
    };

    var isBackspace = function (keyCode) {
        return keyCode === 8;
    };

    var isBspaceAndDelete = function (keyCode) {
        return (keyCode === 8 ||  keyCode === 46);
    };

    var isEnter = function (keyCode) {
        return keyCode === 13;
    };

    var isDecimalDot = function (keyCode) {
        return keyCode === 190;
    };
    var isArrowsOrHomeEnd = function (keyCode) {
        return (keyCode >= 35 && keyCode <= 39);
    };
    var isBspDelTabEscEnt = function (keyCode) {
        return ([46, 8, 9, 27, 13].indexOf(keyCode) !== -1);
    };

    var isDigitOrDecimalDot = function (keyCode) {
        return isDigit(keyCode) || isDecimalDot(keyCode);
    };

    return {
        isDigit            : isDigit,
        isBackspace        : isBackspace,
        isEnter            : isEnter,
        isDecimalDot       : isDecimalDot,
        isDigitOrDecimalDot: isDigitOrDecimalDot,
        isBspaceAndDelete : isBspaceAndDelete,
        isArrowsOrHomeEnd  : isArrowsOrHomeEnd,
        isBspDelTabEscEnt  : isBspDelTabEscEnt
    };
});
