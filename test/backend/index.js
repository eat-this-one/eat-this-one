'use strict';

var should = require('should');
var request = require("supertest");

/**
 * We hardcode localhost:3000 to prevent big issues...
 *
 * - Create a user
 * - Create a group
 * - Join a group
 * - Update a user
 * - List dishes
 * - List group members
 * - Add a dish
 * - Edit a dish
 * - Book a dish
 */
describe('Eat this one', function() {

    // We need this to support multiple requests per it().
    // All it() with more than one request should call this
    // function instead of done() and specify nrequests value
    // before starting the requests.
    var nrequests = 0;
    var localDone = function(done) {

        // In case the test is calling localDone instead of done().
        if (nrequests === 0) {
            console.log('Call done() instead of localDone() if you have a single request');
            done();
            return;
        }
        nrequests--;
        if (nrequests === 0) {
            done();
            return;
        }
    };

    beforeEach(function() {
        nrequests = 0;
    });

    it('should allow even guest user logs to be inserted', function(done) {

        request('http://localhost:3000')
            .post('/api/logs')
            .send({what: 'something', where: 'there'})
            .end(function(err, res) {
                res.should.have.property('status', 201);
                done();
            });

    });

    describe('Create a user', function() {

        it('should add new valid GCM and APN users', function(done) {

            nrequests = 2;

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'regid',
                    name : 'manolo',
                    email : 'manolo@example.com',
                    gcmregid : '1231231231.231231'
                })
                .end(function(err, res) {
                    res.should.have.property('status', 201);
                    localDone(done);
                });

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'apntoken',
                    name : 'carmen',
                    email : 'carmen@example.com',
                    apntoken : '123sda1231231231231'
                })
                .end(function(err, res) {
                    res.should.have.property('status', 201);
                    localDone(done);
                });

        });

        it('should not allow users with invalid data', function() {

            request('http://localhost:3000')
                .post('/api/users')
                .send({
                    provider: 'apntoken',
                    name : 'carme*(&!^@%#*n',
                    email : 'carmen@example.com',
                    apntoken : '123sda1231231231231'
                })
                .end(function(err, res) {
                    res.should.have.property('status', 400);
                    done();
                });

        });
    });
});
