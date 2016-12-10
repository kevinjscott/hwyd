'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var config = require('./config/config');
var server = app.start(function () {
  require('./modules/scheduledstuff/server/init-db').init(function () {
    var scheduler = require('./modules/scheduledstuff/server/scheduler');
    scheduler.init();

    console.log('Starting app version: ' + config.meanjs.version);
    // require('./modules/scheduledstuff/server/doit');
  });

});
