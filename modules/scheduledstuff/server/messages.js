'use strict';

var _ = require('lodash');
var moment = require('moment-timezone');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Promise = require('bluebird');

var teachers = require('./seeds/data-teachers');
var stockquestions;

var StockQuestion = mongoose.model('StockQuestion');
var Teacher = mongoose.model('Teacher');
var CustomQuestion = mongoose.model('Customquestion');

var today = function(addDays) {
  addDays = _.isInteger(addDays) ? addDays : 0;
  // addDays = -1; // uncomment for testing
  return moment().tz('America/New_York').add(addDays, 'days');
};

exports.init = function(callback){
  StockQuestion.find()
  .then(function (sq) {
    if (!sq.length) {
      console.log('Reinitializing questions');
      var sq2 = new StockQuestion(require('./seeds/data-stockquestions'));
      stockquestions = sq2;
      return sq2.save();
    } else {
      stockquestions = sq[0];
    }
  })

  .then(function(){
    if (callback) callback(null);
  })

  .catch(function(err){
    console.log('error:', err);
  });
};

exports.refreshFromDB = function () {
  Teacher.find()
  .then(function(docs) {
    teachers = _.cloneDeep(docs);
  });

  StockQuestion.find()
  .then(function (docs) {
    stockquestions = docs[0];
  });
};

exports.toCalendarDays = function() {
  var questions = _.cloneDeep(stockquestions.questions);
  var index = stockquestions.currentIndex;

  var thedate;
  var startPad = 0;
  var d, i;

  var daysPastMonday = ((_.toInteger((today()).format('d')) + 1) % 7) - 2;
  var offset = (index) % questions.length;

  questions = _.concat(questions.splice(offset), questions);

  for (i = 0; i < questions.length; i++) {
    thedate = moment(today()).add(i, 'days');
    d = _.toInteger(thedate.format('d'));

    if (d === 6 || d === 0) {
      questions.splice(i, 0, '');
    }
  }

  questions = _.map(questions, function(question, i) {
    var thedatestr = moment(today()).add(i, 'days').format('l');
    return {
      message: question,
      date: thedatestr
    };
  });
  return questions;
};

exports.getStockQuestions = function(count) {
  count = count || 1;
  var result = [];
  var questions = this.toCalendarDays();
  var j = 0;

  for (var i = 0; i < count; i++) {
    result.push(questions[i]);
  }

  return result;
};

exports.getCustomQuestionsForKid = function(kid, count) {
  var self = this;
  return new Promise(function(resolve, reject) {
    count = count || 1;
    var result = [];
    var customitem = {};
    var teacher, j, checkDate;

    teacher = kid.teacher;

    CustomQuestion.find({ teacher: teacher._id })
    .lean()
    .exec(function (err, customquestions) {
      if (err) return handleError(err);

      for (j = 0; j < count; j++) {
        checkDate = moment(today()).tz('America/New_York').add(j, 'days').format('l');
        customitem = {};
        if (teacher) {
          customitem = _.find(customquestions, ['date', checkDate]) || {};
        }
        customitem.kid = kid.name || '';
        customitem.date = checkDate;
        customitem.message = customitem.message || '';
        result.push(customitem);
      }

      resolve(result);
    });
  })
};

exports.getQuestionsForKids = function(kids, numDays) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var count = numDays || 1;
    var result = [];
    var stock = self.getStockQuestions(count);
    var customarr = [];
    var i, j;
    // todo: handle case where kids is not an array, but just a single element
    var kidArrLength = kids.length

    var questions = [
      {
        date: '1/1/2011',
        stockmessage: 'This is the stock message',
        custommessages: []
      }
    ];

    // var itemPromises = _.map(kids, self.getCustomQuestionsForKid);
    var itemPromises = _.map(kids, function(coll) {
      return (self.getCustomQuestionsForKid(coll, count));
    });

    Promise.all(itemPromises)
    .then(function(results) {
       results.forEach(function(item) {
         customarr.push(item);
       });
      //  console.log(JSON.stringify(customarr, null, 2));
       for (i = 0; i < count; i++) {
         var s = stock[i];
         var custommessages = [];

         for (j = 0; j < kidArrLength; j++) {
           // console.log(customarr[j][i]);
           custommessages.push(
             {
               kid: customarr[j][i].kid,
               message: customarr[j][i].message
             }
           );
         }

         result.push(
           {
             date: s.date,
             stockmessage: s.message,
             custommessages: custommessages,
           }
         );
       }
       resolve(result);
    })
    .catch(function(err) {
      console.log("Failed:", err);
    });
  })
}

exports.format = function(o) {
  var result = '';

  // result += moment(o.date, 'l').format('LLLL') + '\n';
  result += o.stockmessage;

  for (var i = 0; i < o.custommessages.length; i++) {
    if (o.custommessages[i].message) {
      result += '\n\nAsk ' + o.custommessages[i].kid + ': ';
      result += o.custommessages[i].message;
    }
  }

  return result;
};

exports.advanceToNextDailyQuestion = function() {
  stockquestions.currentIndex++;
  stockquestions.currentIndex = stockquestions.currentIndex % stockquestions.questions.length;

  StockQuestion.update({}, { $set: { currentIndex: stockquestions.currentIndex } }, function() {
    console.log('updated currentIndex in DB');
  });

};
