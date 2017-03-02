// JavaScript source code
var randomPass = (function randomPass() {
    function generate(passLength) {
        var alfabetical = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        var doit = true;
        var res = '';
        var i = 0;
        var useTime;
        var now;

        if (!passLength) {
            useTime = true;
            passLength = 50;
        }

        now = (new Date()).valueOf();
        alfabetical += now;

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

    return {
        generate: generate
    };
})();

module.exports = randomPass;
