/**
 * Created by Roman on 06.01.2015.
 */
'use strict';
var _storageType = process.env.FILE_STORAGE || 'localFs';
var NOT_ENOUGH_INCOMING_PARAMETER = 'Not Enough Incoming Parameter';
var protoObject = {
    checkBase64: function (targetString) {
        var BASE64_REG_EXPR = /^data:image\/\w+;base64,/;
        return BASE64_REG_EXPR.test(targetString);
    },

    convertFromBase64: function (Base64String) {
        return new Buffer(Base64String.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    },

    validateIncomingParameters: function (args) {
        var argumentsLength = args.length;
        var isCallback;
        var callback = args[4];
        var options = args[3];

        switch (argumentsLength) {
            case 4:
                isCallback = typeof callback === 'function';
                break;
            case 3:
                isCallback = typeof options === 'function';
                if (isCallback) {
                    callback = options;
                    options = defaultOptions;
                }
                break;
            case 2:
                options = defaultOptions;
                break;
            default:
                console.error(NOT_ENOUGH_INCOMING_PARAMETER);

                return false;
        }

        return isCallback;
    }
};
// var awsStorage = require('./aws')(protoObject);
// var azureStorage = require('./azure');
var localStorage = require('./localFs');
var Storages = {
    // aws    : awsStorage,
    // azure  : azureStorage,
    localFs: localStorage
};

function fileStorage(storageType) {
    this.storageType = storageType || _storageType;
    Storages[this.storageType].call(this);
}

module.exports = fileStorage;
