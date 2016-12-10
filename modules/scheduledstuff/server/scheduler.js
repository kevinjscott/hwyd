'use strict';

var schedule = require('node-schedule');
var scheduledevents = require('./scheduledevents');

var init = function() {
  schedule.scheduleJob('*/1 * * * *', function(){
    scheduledevents.sendMessagesForThisMinute();
  });

  schedule.scheduleJob('0 5 * * 1-5', function(){
    console.log('weekday midnight event - bump daily index');
    scheduledevents.advanceToNextDailyQuestion();
  });

  // console.log('Schedule inactive. Executing scheduledevents once...')
  scheduledevents.sendMessagesForThisMinute();
};

module.exports.init = init;
