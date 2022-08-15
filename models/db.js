let mongoose = require('mongoose');

const uri = 'mongodb://fauz:forluciproject123@luci-cluster-shard-00-00.wg8qa.mongodb.net:27017,luci-cluster-shard-00-01.wg8qa.mongodb.net:27017,luci-cluster-shard-00-02.wg8qa.mongodb.net:27017/testProjectDatabase?ssl=true&replicaSet=atlas-rhocg9-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.connect(uri, function (err) {
    if (err) {
        console.log('error:' + err);
    } else {
        console.log('Connected to server');
    }
});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to mongoDB cluster');
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function () {
    // console.log('Mongoose disconnected');
});

const gracefulShutDown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through graceful shutdown'/*+ msg */);
        callback();
    });
};

process.once('SIGUSR2', function () {
    gracefulShutDown('nodemon restart', function () {
        process.kill(process.id, 'SIGUSR2');
    });
});

process.on('SIGINT', function () {
    gracefulShutDown('app termination', function () {
        process.exit(0);
    });
});

process.on('SIGTERM', function () {
    gracefulShutDown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

require('./user')
require('./note')
