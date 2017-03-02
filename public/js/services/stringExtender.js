define([], function () {
    function extend() {
        if (typeof String.prototype.startsWith !== 'function') {
            String.prototype.startsWith = function (str) {
                if (str === 'All') {
                    return true;
                }
                if (str === '0-9') {
                    return !isNaN(parseInt(this[0], 10));
                }
                return this.indexOf(str) === 0;
            };
        }
    }

    return {
        apply: extend
    };
});
