'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Customquestion = mongoose.model('Customquestion'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  customquestion;

/**
 * Customquestion routes tests
 */
describe('Customquestion CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Customquestion
    user.save(function () {
      customquestion = {
        name: 'Customquestion name'
      };

      done();
    });
  });

  it('should be able to save a Customquestion if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Customquestion
        agent.post('/api/customquestions')
          .send(customquestion)
          .expect(200)
          .end(function (customquestionSaveErr, customquestionSaveRes) {
            // Handle Customquestion save error
            if (customquestionSaveErr) {
              return done(customquestionSaveErr);
            }

            // Get a list of Customquestions
            agent.get('/api/customquestions')
              .end(function (customquestionsGetErr, customquestionsGetRes) {
                // Handle Customquestions save error
                if (customquestionsGetErr) {
                  return done(customquestionsGetErr);
                }

                // Get Customquestions list
                var customquestions = customquestionsGetRes.body;

                // Set assertions
                (customquestions[0].user._id).should.equal(userId);
                (customquestions[0].name).should.match('Customquestion name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Customquestion if not logged in', function (done) {
    agent.post('/api/customquestions')
      .send(customquestion)
      .expect(403)
      .end(function (customquestionSaveErr, customquestionSaveRes) {
        // Call the assertion callback
        done(customquestionSaveErr);
      });
  });

  it('should not be able to save an Customquestion if no name is provided', function (done) {
    // Invalidate name field
    customquestion.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Customquestion
        agent.post('/api/customquestions')
          .send(customquestion)
          .expect(400)
          .end(function (customquestionSaveErr, customquestionSaveRes) {
            // Set message assertion
            (customquestionSaveRes.body.message).should.match('Please fill Customquestion name');

            // Handle Customquestion save error
            done(customquestionSaveErr);
          });
      });
  });

  it('should be able to update an Customquestion if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Customquestion
        agent.post('/api/customquestions')
          .send(customquestion)
          .expect(200)
          .end(function (customquestionSaveErr, customquestionSaveRes) {
            // Handle Customquestion save error
            if (customquestionSaveErr) {
              return done(customquestionSaveErr);
            }

            // Update Customquestion name
            customquestion.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Customquestion
            agent.put('/api/customquestions/' + customquestionSaveRes.body._id)
              .send(customquestion)
              .expect(200)
              .end(function (customquestionUpdateErr, customquestionUpdateRes) {
                // Handle Customquestion update error
                if (customquestionUpdateErr) {
                  return done(customquestionUpdateErr);
                }

                // Set assertions
                (customquestionUpdateRes.body._id).should.equal(customquestionSaveRes.body._id);
                (customquestionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Customquestions if not signed in', function (done) {
    // Create new Customquestion model instance
    var customquestionObj = new Customquestion(customquestion);

    // Save the customquestion
    customquestionObj.save(function () {
      // Request Customquestions
      request(app).get('/api/customquestions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Customquestion if not signed in', function (done) {
    // Create new Customquestion model instance
    var customquestionObj = new Customquestion(customquestion);

    // Save the Customquestion
    customquestionObj.save(function () {
      request(app).get('/api/customquestions/' + customquestionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', customquestion.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Customquestion with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/customquestions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Customquestion is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Customquestion which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Customquestion
    request(app).get('/api/customquestions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Customquestion with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Customquestion if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Customquestion
        agent.post('/api/customquestions')
          .send(customquestion)
          .expect(200)
          .end(function (customquestionSaveErr, customquestionSaveRes) {
            // Handle Customquestion save error
            if (customquestionSaveErr) {
              return done(customquestionSaveErr);
            }

            // Delete an existing Customquestion
            agent.delete('/api/customquestions/' + customquestionSaveRes.body._id)
              .send(customquestion)
              .expect(200)
              .end(function (customquestionDeleteErr, customquestionDeleteRes) {
                // Handle customquestion error error
                if (customquestionDeleteErr) {
                  return done(customquestionDeleteErr);
                }

                // Set assertions
                (customquestionDeleteRes.body._id).should.equal(customquestionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Customquestion if not signed in', function (done) {
    // Set Customquestion user
    customquestion.user = user;

    // Create new Customquestion model instance
    var customquestionObj = new Customquestion(customquestion);

    // Save the Customquestion
    customquestionObj.save(function () {
      // Try deleting Customquestion
      request(app).delete('/api/customquestions/' + customquestionObj._id)
        .expect(403)
        .end(function (customquestionDeleteErr, customquestionDeleteRes) {
          // Set message assertion
          (customquestionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Customquestion error error
          done(customquestionDeleteErr);
        });

    });
  });

  it('should be able to get a single Customquestion that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Customquestion
          agent.post('/api/customquestions')
            .send(customquestion)
            .expect(200)
            .end(function (customquestionSaveErr, customquestionSaveRes) {
              // Handle Customquestion save error
              if (customquestionSaveErr) {
                return done(customquestionSaveErr);
              }

              // Set assertions on new Customquestion
              (customquestionSaveRes.body.name).should.equal(customquestion.name);
              should.exist(customquestionSaveRes.body.user);
              should.equal(customquestionSaveRes.body.user._id, orphanId);

              // force the Customquestion to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Customquestion
                    agent.get('/api/customquestions/' + customquestionSaveRes.body._id)
                      .expect(200)
                      .end(function (customquestionInfoErr, customquestionInfoRes) {
                        // Handle Customquestion error
                        if (customquestionInfoErr) {
                          return done(customquestionInfoErr);
                        }

                        // Set assertions
                        (customquestionInfoRes.body._id).should.equal(customquestionSaveRes.body._id);
                        (customquestionInfoRes.body.name).should.equal(customquestion.name);
                        should.equal(customquestionInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Customquestion.remove().exec(done);
    });
  });
});
