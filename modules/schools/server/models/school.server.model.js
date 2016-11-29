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
  poc: {
    email: {
      type: String,
      default: '',
      required: 'Please fill in email',
      trim: true
    },
    name: {
      type: String,
      default: '',
      trim: true
    },
    slack: {
      type: String,
      default: '',
      trim: true
    }
  },
  branding_logo_url: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

SchoolSchema.plugin(timestamps);

mongoose.model('School', SchoolSchema);
