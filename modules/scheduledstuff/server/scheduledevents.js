'use strict';

var mongoose = require('mongoose');
var moment = require('moment-timezone');
var _ = require('lodash');
var Customer = mongoose.model('Customer');
var send = require('./send');
// var messages = require('./messages');
var promise = require('bluebird');
var messages = promise.promisifyAll(require('./messages'));

exports.sendMessagesForThisMinute = function() {
  var t = moment().tz('America/New_York').format('H:mm');
  // var t = moment.tz('2014-06-01T19:00:40Z', 'America/New_York').format('H:mm'); // 16:33

  Customer.find({ 'delivery.time': t })
  .populate('kids.teacher')
  .then(function (matchingcustomers) {
    console.log(t + ' Customers found: ' + JSON.stringify(matchingcustomers, null, 2));
    if (matchingcustomers.length) {
      _.forEach(matchingcustomers, function(customer) {
        var questionarr = messages.getQuestions(customer.kids);
        var msg = messages.format(questionarr[0]);

        if (questionarr[0].stockmessage) {
          switch(customer.delivery.method) {
            case 'slack':
              send.slack(msg, customer.delivery.address);
              break;
            default:
              console.log('delivery method not found for user ' + JSON.stringify(customer));
          }
        }
      });
    }
    messages.refreshFromDB();
  });
};

exports.advanceToNextDailyQuestion = function () {
  messages.advanceToNextDailyQuestion();
  send.slack('messages.advanceToNextDailyQuestion()', '#hwyd-test');
};

exports.pingSlack = function (msg) {
  send.slack(msg);
};