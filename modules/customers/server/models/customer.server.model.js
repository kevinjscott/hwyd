'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  validator = require('validator'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp');


var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Customer name',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  firstname: String,
  delivery: {
    time: String,
    method: String,
    address: String
  },
  teacher: {
    type: Schema.ObjectId,
    ref: 'Teacher'
  },
  kids: [
    {
      name: String,
      teacher: {
        type: Schema.ObjectId,
        ref: 'Teacher'
      }
    }
  ]
});

CustomerSchema.plugin(timestamps);

mongoose.model('Customer', CustomerSchema);
