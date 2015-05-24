'use strict';

var request = require('supertest');
var assert = require('assert');
var nconf = require('nconf');

// To pass vars between chained tests.
nconf.use('memory');

describe('EatUser', function() {

    // We need this to support multiple requests per it().
    // All it() with more than one request should call requestDone()
    // instead of done() this requires each it() to start the test
    // setting nrequest number and localDone to done.
    var nrequests = 0;
    var localDone = null;
    var requestDone = function(err) {
        // Forward error to done().
        if (err) {
            return localDone(err);
        }

        nrequests--;
        if (nrequests === 0) {
            localDone();
        }
        return this;
    };

    beforeEach(function() {
        nrequests = 0;
        localDone = null;
    });

    describe('Create a user', function() {

        it('should add new valid GCM and APN users', function(done) {

            nrequests = 3;
            localDone = done;

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'regid',
                    name : 'manolo',
                    email : 'manolo@example.com',
                    gcmregid : '1231231231.231231'
                })
                .expect(201)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    // We store the token for later use.
                    nconf.set('user1Token', JSON.parse(res.text).token);

                    // We also store the id as we want to update it later.
                    nconf.set('user1Id', JSON.parse(res.text)._id);

                    requestDone();
                });

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'apntoken',
                    name : 'josefa',
                    email : 'josefa@example.com',
                    apntoken : '123sda1231231231231'
                })
                .expect(201)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    // We store the token for later use.
                    nconf.set('user2Token', JSON.parse(res.text).token);

                    // We also store the id as we want to update it later.
                    nconf.set('user2Id', JSON.parse(res.text)._id);

                    requestDone();
                });

            // We need a 3rd user for testing multiple groups.
            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'apntoken',
                    name : 'enriqueta',
                    email : 'enriqueta@example.com',
                    apntoken : '123ssdfasdfda1231231231231'
                })
                .expect(201)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    // We store the token for later use.
                    nconf.set('user3Token', JSON.parse(res.text).token);
                    requestDone();
                });


        });

        it('should not allow users with invalid data', function(done) {

            nrequests = 5;
            localDone = done;

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'apntoken',
                    name : 'carme*(&!^@%#*n',
                    email : 'carmen@example.com',
                    apntoken : '123sda12312asdf31231231'
                })
                .expect(400, 'Bad request', requestDone);

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'apntoken',
                    name : 'carmen',
                    email : 'carmen@examps*&^^&!#le.com',
                    apntoken : '123ssdfadsfda1231231231231'
                })
                .expect(400, 'Bad request', requestDone);

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'apntoken',
                    name : 'carmen',
                    email : 'carmen@example.net'
                })
                .expect(400, 'Bad request', requestDone);

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'regid',
                    name : 'carmen',
                    email : 'carmen@example.net'
                })
                .expect(400, 'Bad request', requestDone);

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'unexisting',
                    name : 'carmen',
                    email : 'carmen@example.net'
                })
                .expect(400, 'Unknown auth provided', requestDone);
        });
    });

    describe('Update a user', function() {

        it('should update a user based on their gcmregid or their apntoken', function(done) {

            nrequests = 2;
            localDone = done;

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'regid',
                    name : 'manolo v2',
                    email : 'manolo2@example.com',
                    gcmregid : '1231231231.231231'
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    assert.equal(res.body.name, 'manolo v2');
                    assert.equal(res.body.email, 'manolo2@example.com');
                    assert.equal(res.body.gcmregid, '1231231231.231231');
                    requestDone();
                });

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'apntoken',
                    name : 'josefa v2',
                    email : 'josefa2@example.com',
                    apntoken : '123sda1231231231231'
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    assert.equal(res.body.name, 'josefa v2');
                    assert.equal(res.body.email, 'josefa2@example.com');
                    assert.equal(res.body.apntoken, '123sda1231231231231');
                    requestDone();
                });
        });

        it('should update a user gcmregid or apntoken based on the token', function(done) {

            nrequests = 2;
            localDone = done;

            request('http://localhost:3000')
                .put('/api/users/' + nconf.get('user1Id'))
                .send({
                    provider: 'regid',
                    token: nconf.get('user1Token'),
                    gcmregid : '123sda1231231231231updatedgcm'
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    assert.equal(res.body.gcmregid, '123sda1231231231231updatedgcm');
                    requestDone();
                });

            request('http://localhost:3000')
                .put('/api/users/' + nconf.get('user2Id'))
                .send({
                    provider: 'apntoken',
                    token: nconf.get('user2Token'),
                    apntoken : '123sda1231231231231updatedapn'
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    assert.equal(res.body.apntoken, '123sda1231231231231updatedapn');
                    requestDone();
                });

        });

    });

});
