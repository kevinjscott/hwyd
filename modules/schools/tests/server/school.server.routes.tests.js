'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  School = mongoose.model('School'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  school;

/**
 * School routes tests
 */
describe('School CRUD tests', function () {

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

    // Save a user to the test db and create new School
    user.save(function () {
      school = {
        name: 'School name'
      };

      done();
    });
  });

  it('should be able to save a School if logged in', function (done) {
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

        // Save a new School
        agent.post('/api/schools')
          .send(school)
          .expect(200)
          .end(function (schoolSaveErr, schoolSaveRes) {
            // Handle School save error
            if (schoolSaveErr) {
              return done(schoolSaveErr);
            }

            // Get a list of Schools
            agent.get('/api/schools')
              .end(function (schoolsGetErr, schoolsGetRes) {
                // Handle Schools save error
                if (schoolsGetErr) {
                  return done(schoolsGetErr);
                }

                // Get Schools list
                var schools = schoolsGetRes.body;

                // Set assertions
                (schools[0].user._id).should.equal(userId);
                (schools[0].name).should.match('School name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an School if not logged in', function (done) {
    agent.post('/api/schools')
      .send(school)
      .expect(403)
      .end(function (schoolSaveErr, schoolSaveRes) {
        // Call the assertion callback
        done(schoolSaveErr);
      });
  });

  it('should not be able to save an School if no name is provided', function (done) {
    // Invalidate name field
    school.name = '';

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

        // Save a new School
        agent.post('/api/schools')
          .send(school)
          .expect(400)
          .end(function (schoolSaveErr, schoolSaveRes) {
            // Set message assertion
            (schoolSaveRes.body.message).should.match('Please fill School name');

            // Handle School save error
            done(schoolSaveErr);
          });
      });
  });

  it('should be able to update an School if signed in', function (done) {
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

        // Save a new School
        agent.post('/api/schools')
          .send(school)
          .expect(200)
          .end(function (schoolSaveErr, schoolSaveRes) {
            // Handle School save error
            if (schoolSaveErr) {
              return done(schoolSaveErr);
            }

            // Update School name
            school.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing School
            agent.put('/api/schools/' + schoolSaveRes.body._id)
              .send(school)
              .expect(200)
              .end(function (schoolUpdateErr, schoolUpdateRes) {
                // Handle School update error
                if (schoolUpdateErr) {
                  return done(schoolUpdateErr);
                }

                // Set assertions
                (schoolUpdateRes.body._id).should.equal(schoolSaveRes.body._id);
                (schoolUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Schools if not signed in', function (done) {
    // Create new School model instance
    var schoolObj = new School(school);

    // Save the school
    schoolObj.save(function () {
      // Request Schools
      request(app).get('/api/schools')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single School if not signed in', function (done) {
    // Create new School model instance
    var schoolObj = new School(school);

    // Save the School
    schoolObj.save(function () {
      request(app).get('/api/schools/' + schoolObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', school.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single School with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/schools/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'School is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single School which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent School
    request(app).get('/api/schools/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No School with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an School if signed in', function (done) {
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

        // Save a new School
        agent.post('/api/schools')
          .send(school)
          .expect(200)
          .end(function (schoolSaveErr, schoolSaveRes) {
            // Handle School save error
            if (schoolSaveErr) {
              return done(schoolSaveErr);
            }

            // Delete an existing School
            agent.delete('/api/schools/' + schoolSaveRes.body._id)
              .send(school)
              .expect(200)
              .end(function (schoolDeleteErr, schoolDeleteRes) {
                // Handle school error error
                if (schoolDeleteErr) {
                  return done(schoolDeleteErr);
                }

                // Set assertions
                (schoolDeleteRes.body._id).should.equal(schoolSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an School if not signed in', function (done) {
    // Set School user
    school.user = user;

    // Create new School model instance
    var schoolObj = new School(school);

    // Save the School
    schoolObj.save(function () {
      // Try deleting School
      request(app).delete('/api/schools/' + schoolObj._id)
        .expect(403)
        .end(function (schoolDeleteErr, schoolDeleteRes) {
          // Set message assertion
          (schoolDeleteRes.body.message).should.match('User is not authorized');

          // Handle School error error
          done(schoolDeleteErr);
        });

    });
  });

  it('should be able to get a single School that has an orphaned user reference', function (done) {
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

          // Save a new School
          agent.post('/api/schools')
            .send(school)
            .expect(200)
            .end(function (schoolSaveErr, schoolSaveRes) {
              // Handle School save error
              if (schoolSaveErr) {
                return done(schoolSaveErr);
              }

              // Set assertions on new School
              (schoolSaveRes.body.name).should.equal(school.name);
              should.exist(schoolSaveRes.body.user);
              should.equal(schoolSaveRes.body.user._id, orphanId);

              // force the School to have an orphaned user reference
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

                    // Get the School
                    agent.get('/api/schools/' + schoolSaveRes.body._id)
                      .expect(200)
                      .end(function (schoolInfoErr, schoolInfoRes) {
                        // Handle School error
                        if (schoolInfoErr) {
                          return done(schoolInfoErr);
                        }

                        // Set assertions
                        (schoolInfoRes.body._id).should.equal(schoolSaveRes.body._id);
                        (schoolInfoRes.body.name).should.equal(school.name);
                        should.equal(schoolInfoRes.body.user, undefined);

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
      School.remove().exec(done);
    });
  });
});
