'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp');


/**
 * School Schema
 */
var SchoolSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill School name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

SchoolSchema.plugin(timestamps);

mongoose.model('School', SchoolSchema);
