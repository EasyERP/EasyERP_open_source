var mongoose = require('mongoose');

module.exports = (function () {
    String.prototype.capitalizer = function (filter) {
        var self = this;
        var switchObject;

        function capitalize() {
            return self.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

        function firstCapitalize() {
            return self.substr(0, 1).toUpperCase() + self.substr(1);
        }

        switchObject = {
            Caps     : capitalize,
            FirstCaps: firstCapitalize,
            Upper    : self.toUpperCase,
            Lower    : self.toLowerCase
        };

        if (switchObject[filter]) {
            return switchObject[filter]();
        }

        return '';
    };
}());
