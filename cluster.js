/**
 * Created by Roman on 17.08.2015.
 */
/**
 * Created by Roman on 23.12.2014.
 */
"use strict";
var cluster = require('cluster');

if (cluster.isMaster) {

    var cpuCount = require('os').cpus().length;

    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });

    cluster.on('online', function (worker) {
        console.log("The worker" + worker.id + " responded after it was forked");
    });

    cluster.on('listening', function (worker, address) {
        console.log("A worker " + worker.id + " is now connected to " + address.address + ":" + address.port);
    });

} else {
    require('./server');
}
