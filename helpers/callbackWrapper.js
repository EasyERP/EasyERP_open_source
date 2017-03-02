exports.populate = function (err, result) {
    function Populate(err, result) {
        this.populate = function () {
            return this;
        };

        this.exec = function (cb) {
            if (typeof cb === 'function') {
                return cb(err, result);
            }
        };

        this.lean = function () {
            return this;
        };
    }

    return new Populate(err, result);
};

