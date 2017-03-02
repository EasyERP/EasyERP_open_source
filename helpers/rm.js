'use strict';

module.exports = function (dbsNames, event, models) {
    var amqp = require('amqp');
    var async = require('async');
    var consumers = require('./rmConsummers')(dbsNames, event, models);

    var Broker = function (options) {
        var exchanges = {};
        var queues = {};

        options = options || {};

        this.brokerType = options.brokerType;
        delete options.brokerType;

        this.exchangeOptions = {
            durable   : true,
            type      : 'direct',
            autoDelete: false
        };

        this.queueOptions = {
            durable   : true,
            exclusive : false,
            autoDelete: false
        };

        this.registerExchange = function (connection, exchange, cb) {
            var _exchange = exchanges[exchange.name];

            if (_exchange) {
                console.log('\x1b[32m%s\x1b[0m', 'Exchange ' + exchange.name + ' already opened');

                return cb(_exchange);
            }

            connection.exchange(exchange.name, exchange.exchangeOptions, function (ex) {
                console.log('\x1b[32m%s\x1b[0m', 'Exchange ' + ex.name + ' is open');

                exchanges[exchange.name] = ex;
                cb(ex);
            });
        };

        this.registerQueue = function (connection, queue, cb) {
            var _queue = queues[queue.name];

            if (_queue) {
                console.log('\x1b[32m%s\x1b[0m', 'Queue ' + queue.name + ' already opened');

                return cb(_queue);
            }

            connection.queue(queue.name, queue.queueOptions, function (_queue) {
                console.log('\x1b[32m%s\x1b[0m', 'Queue ' + _queue.name + ' is open');

                queues[queue.name] = _queue;
                cb(_queue);
            });
        };

        this.publishMessage = function (exchangeName, message, routingKey, callback) {
            var self = this;

            self.getConnection(function (connection) {
                var exchange = {
                    name           : exchangeName,
                    exchangeOptions: self.exchangeOptions
                };

                self.registerExchange(connection, exchange, function (ex) {
                    ex.publish(routingKey, message, {deliveryMode: 2, mandatory: true}, callback);
                });
            });
        };
    };

    Broker.prototype.connect = function (options) {
        var self = this;
        var connection = amqp.createConnection(options);

        this.connection = connection;

        connection.once('ready', function () {
            console.log('\x1b[32m%s\x1b[0m', '>>>>>>>>>> RM CONNECTED <<<<<<<<<<');

            self.loadSubscribers(consumers);
        });

        connection.on('error', function (err) {
            console.log('\x1b[31m%s\x1b[0m', 'Error from amqp: ', err);
        });

        return this;
    };

    Broker.prototype.getConnection = function (callback) {
        if (typeof callback === 'function') {
            return callback(this.connection);
        }

        return this.connection;
    };

    Broker.prototype.disconnectRabbit = function () {
        this.connection.disconnect();
        delete this.connection;
    };

    Broker.prototype.loadSubscribers = function (subscribers) {
        var self = this;

        this.getConnection(function (connection) {
            var q;

            if (subscribers instanceof Array) {
                q = async.queue(function (subscriber, callback) {
                    self.loadSubscriber(connection, subscriber.exchange, subscriber.queue, subscriber.routingKey, subscriber.callback, callback);
                }, 1);

                q.drain = function () {
                    console.log('\x1b[32m%s\x1b[0m', '>>>>>>>>>> All subscribers loaded <<<<<<<<<<');
                };

                subscribers.forEach(function (subscriber) {
                    q.push(subscriber, function () {
                        console.log('finished ' + subscriber.routingKey);
                    });
                });
            } else {
                self.loadSubscriber(connection, subscribers.exchange, subscribers.queue, subscribers.routingKey, subscribers.callback);
            }
        });
    };

    Broker.prototype.loadSubscriber = function (connection, exchangeName, queueName, routingKey, callback, eachCb) {
        var exchange = {
            name           : exchangeName,
            exchangeOptions: this.exchangeOptions
        };

        var queue = {
            name        : queueName,
            queueOptions: this.queueOptions
        };

        this.loadSubscriberCallback(connection, exchange, queue, routingKey, callback, eachCb);
    };

    Broker.prototype.loadSubscriberCallback = function (connection, exchange, queue, routingKey, callback, eachCb) {
        function bindQueue(_queue, callback, cb) {
            var listenerCount = _queue.listenerCount('queueBindOk');

            function subscriber() {
                _queue.subscribe({ack: true}, callback);
            }

            _queue.bind(exchange.name, routingKey);

            if (!listenerCount) {
                _queue.on('queueBindOk', subscriber);
            }
            if (typeof cb === 'function') {
                cb();
            }
        }

        function polymorhRegister() {
            var self = this;

            self.registerExchange(connection, exchange, function (ex) {
                self.registerQueue(connection, queue, function (_queue) {
                    callback = callback.bind(_queue);
                    return bindQueue(_queue, callback, eachCb);
                });
            });
        }

        function publisherRegister() {
            this.registerExchange(connection, exchange, function (ex) {
                if (typeof eachCb === 'function') {
                    eachCb();
                }
            });
        }

        function consumerRegister() {
            this.registerQueue(connection, queue, function (_queue) {
                callback = callback.bind(_queue);
                return bindQueue(_queue, callback, eachCb);
            });
        }

        switch (this.brokerType) {
            case 'publisher':
                return publisherRegister.call(this);
            case 'consumer':
                return consumerRegister.call(this);
            default:
                return polymorhRegister.call(this);
        }
    };

    return Broker;
};

