// JavaScript source code
var randomPass = (function randomPass() {
    // var uuid = require('node-uuid')();
    function generate(passLength) {
        var useTime = false;
        var now = (new Date()).valueOf();
        var alfabetical = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890' + now;
        var res = '';

        var doit = true;
        var i = 0;

        if (!passLength) {
            useTime = true;
            passLength = 50;
        }

        function rendomNumber(m) {
            return Math.floor((Math.random() * m));
        }

        while (doit) {
            res += alfabetical.substr(rendomNumber(alfabetical.length), 1);

            if (i === passLength) {
                doit = false;
            }
            i++;
        }

        if (!doit) {
            if (useTime) {
                return (res + now);
            }
            return res;
        }
    }

    function generateUuid() {
        // var uuidLocal = uuid;
        // return uuidLocal;
    }

    function getTicksKey() {
        return new Date().getTime();
    }

    return {
        generate   : generate,
        getTicksKey: getTicksKey
        // generateUuid: generateUuid
    };
})();

module.exports = randomPass;
