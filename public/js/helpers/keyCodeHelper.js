define([], function () {
    var isDigit = function (keyCode) {
        return (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105);

    };

    var isBackspace = function (keyCode) {
        return keyCode === 8;
    };

    return {isDigit: isDigit, isBackspace: isBackspace};
});
