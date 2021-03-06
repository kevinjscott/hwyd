'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  nodemailer = require('nodemailer'),
  consolidate = require('consolidate'),
  async = require('async');

var smtpTransport = nodemailer.createTransport(config.mailer.options);
var express = require('express');


var Slack = require('slack-node');

exports.slack = function slack(text, channel) {
  channel = channel || '#hwyd-test';
  var slacko = new Slack();
  slacko.setWebhook('https://hooks.slack.com/services/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');
  slacko.webhook({
    channel: channel,
    username: 'HWYD',
    icon_emoji: ':question:',
    text: text
  }, function(err, response) {
    if (response.status === 'ok') {
      console.log('Sent to Slack ' + channel + ': ' + text);
    } else {
      console.log(response);
    }
  });
};

exports.twilioText = function twilioText(text, recipient) {
  var client = require('twilio')(config.twilio.sid, config.twilio.token);

  client.sendMessage({
    to: recipient, // Any number Twilio can deliver to
    from: config.twilio.from, // A number you bought from Twilio and can use for outbound communication
    body: text // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (err) {
      console.log('Not sent to Twilio');
    } else {
      // "responseData" is a JavaScript object containing data received from Twilio.
      // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
      // http://www.twilio.com/docs/api/rest/sending-sms#example-1

      console.log('Sent to Twilio ' + recipient + ': ' + text);
      // console.log(responseData.from); // outputs "+14506667788"
      // console.log(responseData.body); // outputs "word to your mother."
    }
  });
};

exports.sendTestEmail = function (msg, to) {
  var message = null;

  var app = express();  // todo: move these to global?
  app.engine('server.view.html', consolidate[config.templateEngine]);
  app.set('view engine', 'server.view.html');
  app.set('views', './');

  async.waterfall([
    function (done) {
      app.render('modules/teachers/server/templates/heads-up-email', {
        name: 'blah',
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML);
      });
    },
    function (emailHTML, done) {
      var mailOptions = {
        to: to,
        from: config.mailer.from,
        subject: 'Upcoming HWYD questions for your students',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        // res.json('success');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      // return next(err);
    }
  });

};

exports.dailyCustomerEmail = function (subj, msg, to) {
  var message = null;

  async.waterfall([
    function (done) {
      var mailOptions = {
        to: to,
        from: config.mailer.from,
        subject: subj,
        html: msg
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        console.log(err);
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      console.log(err);
      // return next(err);
    }
  });

};

// module.exports.slack = slack;
