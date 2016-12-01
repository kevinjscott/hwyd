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
      console.log('Sent to Slack: ' + text);
    } else {
      console.log(response);
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
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      // return next(err);
    }
  });

};

// module.exports.slack = slack;
