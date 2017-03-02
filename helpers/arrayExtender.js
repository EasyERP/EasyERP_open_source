var mongoose = require('mongoose');

module.exports = (function () {
    Array.prototype.objectID = function () {
        var _arrayOfID = [];
        var objectId = mongoose.Types.ObjectId;
        var i;

        for (i = 0; i < this.length; i++) {
            if (this[i] && typeof this[i] === 'object' && this[i].hasOwnProperty('_id')) {
                _arrayOfID.push(this[i]._id);
            } else if (this[i] && typeof this[i] === 'object') {
                _arrayOfID.push(this[i]);
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

    Array.prototype.toStringObjectIds = function () {
        var ObjectId = mongoose.Types.ObjectId;
        var arr = this.map(function (_objectId) {
            if (_objectId instanceof ObjectId) {
                return _objectId.toString();
            } else if (typeof _objectId === 'string') {
                return _objectId;
            } else {
                throw new Error({message: 'Incorrect value for ObjectId'});
            }
        });

        return arr;
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
