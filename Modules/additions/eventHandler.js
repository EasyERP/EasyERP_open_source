var eventHandler = function (module) {
    var _events = require('events');
    var event = new _events.EventEmitter();

    return {
        event: event
    };
};
module.exports = eventHandler;
