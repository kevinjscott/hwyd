var _ = require('lodash');
var moment = require('moment-timezone');
var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var teachers = require('./seeds/data-teachers');
var stockquestions;
var today = moment().tz('America/New_York');

var StockQuestion = mongoose.model('StockQuestion');
var Teacher = mongoose.model('Teacher');

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
}

exports.refreshFromDB = function () {
  Teacher.find()
  .then(function(docs) {
    teachers = _.cloneDeep(docs);
  })

  StockQuestion.find()
  .then(function (docs) {
    stockquestions = docs[0];
  })
}

exports.advanceToday = function(n) {
  today.add(n, 'days');
}

exports.toCalendarDays = function() {
  var questions = _.cloneDeep(stockquestions.questions);
  var index = stockquestions.currentIndex;

  t = moment(today).add(-0, 'days');    // for testing
  var thedate = t;

  // console.log((today).format('LLLL'));
  daysPastMonday = ((_.toInteger((today).format('d')) + 1 ) % 7) - 2;
  var offset = (index) % questions.length;

  questions = _.concat(questions.splice(offset), questions);
  startPad = 0;

  for (var i = 0; i < questions.length; i++) {
    thedate = moment(today).add(i, 'days');
    d = _.toInteger(thedate.format('d'));

    if (d == 6 || d == 0) {
      questions.splice(i, 0, '');
    }
  }

  questions = _.map(questions, function(question, i) {
    var thedatestr = moment(today).add(i, 'days').format('l');
    return {
      message: question,
      date: thedatestr
    }
  })
  return questions;
}

exports.getCustomQuestions = function(kidOrTeacher, count) {
  count = count || 1;
  var result = [];
  var customitem = {};
  var teacher, kid;
  var temp = kidOrTeacher._doc; // todo: why do I need ._doc here?

  if (temp.customitems) {
    // it's a teacher
    teacher = temp;
    kid = {};
  } else {
    // it's a kid
    kid = temp;
    teacher = kid.teacher._doc;
  }
  for (j = 0; j < count; j++) {
    checkDate = moment(today).tz('America/New_York').add(j, 'days').format('l');
    customitem = {};
    if (teacher) {
      customitem = _.find(teacher.customitems, ['date', checkDate]) || {};
    }
    customitem.kid = kid.name || '';
    customitem.date = checkDate;
    customitem.message = customitem.message || '';
    result.push(customitem);
  }

  return result;
}

exports.getStockQuestions = function(count) {
  count = count || 1;
  var result = [];
  var questions = this.toCalendarDays();
  var j = 0;

  for (var i = 0; i < count; i++) {
    result.push(questions[i]);
  }

  return result;
}

exports.getQuestions = function(kidsOrTeacher, numDays) {
  var count = numDays || 1;
  var result = [];
  var stock = this.getStockQuestions(count);
  var custom = this.getCustomQuestions(kidsOrTeacher, count);
  var customarr = [];
  var kidArrLength = _.isArray(kidsOrTeacher) ? kidsOrTeacher.length : 1;

  if (_.isArray(kidsOrTeacher)) {
    for (var i = 0; i < kidArrLength; i++) {
      customarr.push(
        this.getCustomQuestions(kidsOrTeacher[i], count)
      )
    }
  } else {
    customarr.push(
      this.getCustomQuestions(kidsOrTeacher, count)
    )
  }

  for (var i = 0; i < count; i++) {
    var s = stock[i];
    var custommessages = [];

    for (var j = 0; j < kidArrLength; j++) {
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
    )
  }

  return result;
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
}

exports.advanceToNextDailyQuestion = function() {
  stockquestions.currentIndex++;
  stockquestions.currentIndex = stockquestions.currentIndex % stockquestions.questions.length;

  StockQuestion.update( {  }, { $set: { currentIndex: stockquestions.currentIndex }}, function() {
    console.log('updated currentIndex in DB');
  });

}


