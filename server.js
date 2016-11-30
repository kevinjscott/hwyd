'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var server = app.start(function() {
  require('./modules/scheduledstuff/server/init-db').init(function() {
    var scheduler = require('./modules/scheduledstuff/server/scheduler');
    scheduler.init();

    require('./modules/scheduledstuff/server/doit');
  });

});
