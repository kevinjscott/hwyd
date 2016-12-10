'use strict';

var mongoose = require('mongoose');
var Teacher = mongoose.model('Teacher');
var Customer = mongoose.model('Customer');

var _ = require('lodash');
var moment = require('moment-timezone');
var promise = require('bluebird');
var messages = promise.promisifyAll(require('./messages'));
var count = 7;

Customer.findOne({ 'delivery.address': '#customer1' })
.populate('kids.teacher')
.lean()
.then(function (item) {
  if (item) {
    // console.log('found customer: ' + item);
    // console.log(JSON.stringify(item.kids, null, 2));
    messages.getQuestionsForKids(item.kids, count)
    .then(function(data){
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(function(err){
      console.error (err);
    });
  } else {
    console.log('customer not found');
  }
});

// Teacher.findOne({ 'slack': '#teacher1'})
// .then(function (item) {
//   if (item) {
//     // console.log('found teacher: ' + item);
//     console.log('found teacher: ' + item);
//     console.log('Teachers custom questions: ' + JSON.stringify(messages.getCustomQuestions(item, count), null, 2));
//   } else {
//     console.log('teacher not found');
//   }
// })

// Customer.findOne({ 'delivery.address': '#customer1'})
// .populate('kids.teacher')
// .then(function (item) {
//   if (item) {
//     // console.log('found customer: ' + item);
//     console.log('Customers custom questions: ' + JSON.stringify(messages.getCustomQuestions(item.kids[0], count), null, 2));
//   } else {
//     console.log('customer not found');
//   }
// })

// console.log(JSON.stringify(messages.getStockQuestions(count), null, 2));
// console.log(JSON.stringify(messages.toCalendarDays(), null, 2));

// console.log(JSON.stringify(messages.getCustomQuestions(customers[0].kids[0], count), null, 2));
// messages.advanceToNextDailyQuestion();
// console.log(JSON.stringify(messages.getQuestions(customers[0].kids), null, 2));
