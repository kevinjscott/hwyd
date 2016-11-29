'use strict';

var Slack = require('slack-node');

function slack(text, channel) {
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
}

module.exports.slack = slack;
