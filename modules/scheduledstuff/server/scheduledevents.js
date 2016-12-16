'use strict';

var mongoose = require('mongoose');
var moment = require('moment-timezone');
var _ = require('lodash');
var Customer = mongoose.model('Customer');
var send = require('./send');
var promise = require('bluebird');
var messages = promise.promisifyAll(require('./messages'));
var s = require('underscore.string');
var path = require('path');
var config = require(path.resolve('./config/config'));

exports.sendMessagesForThisMinute = function() {
  var t = moment().tz('America/New_York').format('H:mm');
  // var t = moment.tz('2016-12-10T20:01:40Z', 'America/New_York').format('H:mm'); // 15:01 - uncomment this to test with a specific date/time

  var k = {};
  var subj = '';

  Customer.find({ 'delivery.time': t })
  .lean()
  .populate('kids.teacher')
  .then(function (matchingcustomers) {
    console.log(t + ' (v' + config.meanjs.version + ') Customers found: ' + JSON.stringify(matchingcustomers, null, 2));
    if (matchingcustomers.length) {
      _.forEach(matchingcustomers, function(customer) {
        messages.getQuestionsForKids(customer.kids)
        .then(function(questionarr) {
          var msg = messages.format(questionarr[0]);  // 0 = today
          // console.log(msg);
          if (msg) {
            switch(customer.delivery.method) {
              case 'slack':
                send.slack(msg, customer.delivery.address);
                break;
              case 'email':
                k = customer.kids;
                k = _.map(k, 'name');
                k = _.uniq(k);
                k = _.sortBy(k);
                subj = 'A great question for ' + s.toSentenceSerial(k, ', ', ' and ');
                send.dailyCustomerEmail(subj, msg, customer.delivery.address);
                break;
              default:
                console.log('delivery method not found for user ' + JSON.stringify(customer));
            }
          }
        })
        .catch(function(err){
          console.error (err);
        });

      });
    }
    messages.refreshFromDB();
  });
};

exports.advanceToNextDailyQuestion = function () {
  messages.advanceToNextDailyQuestion();
  // send.slack('messages.advanceToNextDailyQuestion()', '#hwyd-test');
};

exports.pingSlack = function (msg) {
  send.slack(msg);
};
