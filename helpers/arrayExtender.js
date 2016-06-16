var mongoose = require('mongoose');

module.exports = (function () {
    Array.prototype.objectID = function () {
        var _arrayOfID = [];
        var objectId = mongoose.Types.ObjectId;
        var i;

        for (i = 0; i < this.length; i++) {
            if (this[i] && typeof this[i] === 'object' && this[i].hasOwnProperty('_id')) {
                _arrayOfID.push(this[i]._id);
            } else {
                if (typeof this[i] === 'string' && this[i].length === 24) {
                    _arrayOfID.push(objectId(this[i]));
                }
                if (this[i] === null || this[i] === 'null') {
                    _arrayOfID.push(null);
                }

            }
        }
        return _arrayOfID;
    };

    Array.prototype.toNumber = function () {
        var _arrayOfNumbers = [];
        var el;
        var value;
        var i;

        for (i = 0; i < this.length; i++) {
            el = this[i];
            value = parseInt(el, 10);

            if (typeof el === 'string' || typeof el === 'number' && isFinite(value)) {
                _arrayOfNumbers.push(value);
            }
        }
        return _arrayOfNumbers;
    };
}());
