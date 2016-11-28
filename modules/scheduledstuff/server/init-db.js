'use strict';

var send = require('./send');

var seedTeacherData = require('./seeds/data-teachers');
var Teacher = require('./models/teachers').Teacher;

var seedCustomerData = require('./seeds/data-customers');
var Customer = require('./models/customers').Customer;

var seedSchoolData = require('./seeds/data-schools');
var School = require('./models/schools').School;

var messages = require('./messages');

var promise = require('bluebird');
var mongoose = promise.promisifyAll(require('mongoose'));
// var db = mongoose.connection;
var _ = require('lodash');

exports.init = function(callback){
  promise.promisifyAll(require('./messages')).initAsync()
  // .then(seedSchools(true))
  // .then(seedCustomers(true))
  // .then(seedTeachers(true))  // todo: enable/disable these
  .then(function(){
    messages.refreshFromDB();
    if (callback) callback(null);
  });
};

var seedSchools = function(drop) {
  // _id: '20000000000000000000000'
  if (drop) {
    mongoose.connection.db.dropCollection('schools', function(err, result) {
      console.log('dropped schools collection');
    });
  }
  _.each(seedSchoolData, function (o, index) {
    var item = new School(
      {
        poc: {
          email: o.poc.email,
          slack: o.poc.slack,
        },
        name: o.name,
        hash: o.hash,
        salt: o.salt,
        branding: {
          logourl: o.branding.logourl
        }
      }
    );
    item.save();
  });
};

var seedCustomers = function(drop) {
  if (drop) {
    mongoose.connection.db.dropCollection('customers', function(err, result) {
      console.log('dropped customers collection');
    });
  }
  _.each(seedCustomerData, function (o, index) {
    var item = new Customer(
      {
        email: o.email,
        firstname: o.firstname,
        delivery: {
          time: o.delivery.time,
          method: o.delivery.method,
          address: o.delivery.address
        },
        kids: o.kids
      }
    );
    item.save();
  });
};

var seedTeachers = function(drop) {
  // _id: '10000000000000000000000'
  if (drop) {
    mongoose.connection.db.dropCollection('teachers', function(err, result) {
      console.log('dropped teachers collection');
    });
  }
  _.each(seedTeacherData, function (o, index) {
    var item = new Teacher(
      {
        _id: o._id,
        email: o.email,
        slack: o.slack,
        grade: o.grade,
        name: o.name,
        school: o.school,
        customitems: o.customitems
      }
    );
    item.save();
  });
};

