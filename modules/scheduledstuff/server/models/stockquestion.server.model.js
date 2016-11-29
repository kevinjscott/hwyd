var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var StockQuestionSchema = new mongoose.Schema({
  currentIndex: Number,
  questions: []
});

StockQuestionSchema.plugin(timestamps);

mongoose.model('StockQuestion', StockQuestionSchema);
