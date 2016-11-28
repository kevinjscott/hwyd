var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var StockQuestionSchema = new mongoose.Schema({
  currentIndex: Number,
  questions: []
});

StockQuestionSchema.plugin(timestamps);

// var StockQuestion = mongoose.model('StockQuestion', StockQuestionSchema);
// module.exports.StockQuestion = StockQuestion;

mongoose.model('StockQuestion', StockQuestionSchema);
// module.exports = mongoose.model('StockQuestion', StockQuestionSchema);
