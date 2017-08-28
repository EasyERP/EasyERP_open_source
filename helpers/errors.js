'use strict';

var Errors = function () {
    var DEFAULT_ERROR_NAME = 'Error';
    var DEFAULT_ERROR_MESSAGE = 'error';
    var DEFAULT_ERROR_STATUS = 400;

    var BAD_REQUEST = 'Bad request, please check incoming parameters.';
    var NOT_ENOUGH_PARAMS = 'Not enough incoming parameters.';

    function Errors(options) {
        Error.captureStackTrace(this, Errors);

        if (options && options.name) {
            this.name = options.name;
        } else {
            this.name = DEFAULT_ERROR_NAME;
        }

        if (options && options.message) {
            this.message = options.message;
        } else {
            this.message = DEFAULT_ERROR_MESSAGE;
        }

        if (options && options.status) {
            this.status = options.status;
        } else {
            this.status = DEFAULT_ERROR_STATUS;
        }
    }

    Errors.prototype = Object.create(Error.prototype);

    this.UnAuthorized = function () {
        var err = new Error('Unauthorized');

        err.status = 401;

        return err;
    };

    this.BadCredentials = function () {
        var err = new Error('Verify your credentials and Base URL please.');

        err.status = 400;

        return err;
    };

    this.BadRequest = function (options) {
        options = options || {};

        if (!options.name) {
            options.name = 'BadRequest';
        }

        if (!options.message) {
            options.message = BAD_REQUEST;
        }
        if (options && options.reqParams) {
            options.message += 'This parameters are required: ' + options.reqParams;
        }
        if (options && options.duplicate) {
            options.message += 'The same content already exists with provided parameters: ' + options.duplicate;
        }

        return new Errors(options);
    };

    this.NotEnoughParams = function (options) {
        options = options || {};

        if (!options.name) {
            options.name = 'NotEnoughIncomingParameters';
        }

        if (!options.message) {
            options.message = NOT_ENOUGH_PARAMS;
        }
        if (options && options.reqParams) {
            options.message += 'This parameters are required: ' + options.reqParams;
        }

        return new Errors(options);
    };

    this.NotFound = function (options) {
        var msg;

        options = options || {};

        if (!options.name) {
            options.name = 'NotFound';
        }
        if (!options.message) {
            msg = 'Not Found';

            if (options.target) {
                msg += ' ' + msg.target;
            }

            options.message = msg;
        }

        return new Errors(options);
    };

    this.BannedAccount = function (options) {
        options = options || {};

        if (!options.name) {
            options.name = 'BannedAccount';
        }
        if (!options.message) {
            options.message = 'Your account was banned!';
        }

        return new Errors(options);
    };

    this.AccessError = function (options) {
        options = options || {};

        if (!options.name) {
            options.name = 'AccessError';
        }
        if (!options.message) {
            options.message = 'You do not have sufficient rights';
        }
        if (!options.status) {
            options.status = 403;
        }

        return new Errors(options);
    };
};

module.exports = new Errors();
