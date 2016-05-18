// JavaScript source code
function rendomArg(arg) {
    var alfabetical = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    var res = '';
    var rendomNumber = function (m) {
        return Math.floor((Math.random() * m));
    }
    var doit = true;
    var i = 0;
    while (doit) {
        res += alfabetical.substr(rendomNumber(alfabetical.length), 1);
        if (i === 50) { doit = false; }
        i++;
    }
    if (!doit) { arg(res); }

}


exports.rendomArg = rendomArg;