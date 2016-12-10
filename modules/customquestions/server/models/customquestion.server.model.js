'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp');

/**
 * Customquestion Schema
 */
var CustomquestionSchema = new Schema({
  message: {
    type: String,
    default: '',
    required: 'Please fill in the text',
    trim: true
  },
  date: {
    type: String,
    default: '',
    required: 'Please fill in the date (as a string d/m/yyyy)',
    trim: true
  },
  teacher: [{ type: Schema.ObjectId, ref: 'Teacher' }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

CustomquestionSchema.plugin(timestamps);

mongoose.model('Customquestion', CustomquestionSchema);
