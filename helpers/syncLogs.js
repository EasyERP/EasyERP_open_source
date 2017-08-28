'use strict';

var CONSTANTS = require('../constants/mainConstants');
var mongoose = require('mongoose');
var SyncSchema = mongoose.Schemas.syncLogs;

module.exports = function (models) {
    var syncLogsService = require('../services/syncLogs')(models);

    function initialize(options) {
        var SyncModel = models.get(options.dbName, 'syncLogs', SyncSchema);
        var syncModel;

        delete options.dbName;

        syncModel = new SyncModel(options);

        return syncModel;
    }

    function create(options, callback) {
        syncLogsService.create(options, function (err, model) {
            if (callback) {
                if (err) {
                    return callback(err);
                }

                return model;
            }

            if (err) {
                console.log(err);
            }

            console.log('Log create success!');
        });
    }

    function addSuccess(log, keys, options) {
        log[keys.action][keys.category].succeed++;
        log[keys.action][keys.category].data.push({
            entityId         : options.entityId,
            entityDescription: options.entityDescription,
            message          : options.message,
            status           : CONSTANTS.SYNC_LOGS.SUCCESS_TYPE.SUCCESS,
            type             : options.type
        });

        return log;
    }

    function addUnlink(log, keys, options) {
        log[keys.action][keys.category].unlinked++;
        log[keys.action][keys.category].data.push({
            entityId         : options.entityId,
            entityDescription: options.entityDescription,
            message          : options.message,
            status           : CONSTANTS.SYNC_LOGS.SUCCESS_TYPE.UNLINK,
            type             : options.type || CONSTANTS.SYNC_LOGS.TYPE.CREATE
        });

        return log;
    }

    function addConflict(log, keys, options) {
        log[keys.action][keys.category].conflicted++;
        log[keys.action][keys.category].data.push({
            entityId         : options.entityId,
            entityDescription: options.entityDescription,
            message          : options.message,
            status           : CONSTANTS.SYNC_LOGS.SUCCESS_TYPE.CONFLICT,
            type             : options.type || CONSTANTS.SYNC_LOGS.TYPE.CREATE
        });

        return log;
    }

    function addError(log, keys, options) {
        log.errorsCount++;
        log.status = log.status === CONSTANTS.SYNC_LOGS.STATUS.CRITICAL ? log.status : CONSTANTS.SYNC_LOGS.STATUS.WARNING;
        log[keys.action][keys.category].isComplete = false;
        log[keys.action][keys.category].errors.push({
            entityId         : options.entityId,
            entityDescription: options.entityDescription,
            message          : options.message
        });
        return log;
    }

    function addCriticalError(log, keys, options) {
        log.criticalErrorsCount++;
        log.status = CONSTANTS.SYNC_LOGS.STATUS.CRITICAL;
        log[keys.action][keys.category].isComplete = false;
        log[keys.action][keys.category].errors.push({
            entityId         : options.entityId,
            entityDescription: options.entityDescription,
            message          : options.message,
            isCritical       : true
        });

        return log;
    }

    return {
        create          : create,
        initialize      : initialize,
        addSuccess      : addSuccess,
        addUnlink       : addUnlink,
        addConflict     : addConflict,
        addError        : addError,
        addCriticalError: addCriticalError
    };
};
