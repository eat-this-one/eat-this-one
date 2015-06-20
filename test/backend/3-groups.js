'use strict';

var request = require('supertest');
var assert = require('assert');
var nconf = require('nconf');

// To pass vars between chained tests.
nconf.use('memory');

describe('EatGroup & EatGroupMember', function() {

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

    describe('Create a group and let users join', function() {

        it('should add valid new groups', function(done) {

            nrequests = 2;
            localDone = done;

            request('http://localhost:3000')
                .post('/api/groups')
                .send({
                    name: 'Test group user 1',
                    country: 'GB',
                    token: nconf.get('user1Token')
                })
                .expect(201)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    nconf.set('user1Group', res.text);
                    requestDone();
                });


            request('http://localhost:3000')
                .post('/api/groups')
                .send({
                    name: 'Test group user 3',
                    country: 'GB',
                    token: nconf.get('user3Token')
                })
                .expect(201)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    nconf.set('user3Group', res.text);
                    requestDone();
                });

        });

        it('should allow other users to join', function(done) {

            request('http://localhost:3000')
                .post('/api/group-members')
                .send({
                    groupid : JSON.parse(nconf.get('user1Group'))._id,
                    token: nconf.get('user2Token'),
                    message: 'User 2 joined (will not be sent through localhost)'
                })
                .expect(201, done);

        });

        it('should list group members', function(done) {

            nrequests = 3;
            localDone = done;

            request('http://localhost:3000')
                .get('/api/groups')
                .send({
                    id : JSON.parse(nconf.get('user1Group'))._id,
                    token: nconf.get('user1Token')
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    assert.equal(res.body[0].members.length, 2);
                    requestDone();
                });

            // Members than joined can also check the group users.
            request('http://localhost:3000')
                .get('/api/groups')
                .send({
                    id : JSON.parse(nconf.get('user1Group'))._id,
                    token: nconf.get('user2Token')
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    assert.equal(res.body[0].members.length, 2);
                    requestDone();
                });

            request('http://localhost:3000')
                .get('/api/groups')
                .send({
                    id : JSON.parse(nconf.get('user3Group'))._id,
                    token: nconf.get('user3Token')
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    assert.equal(res.body[0].members.length, 1);
                    requestDone();
                });

        });

        it('should allow non-members to get the other\'s groups info, but not the members list', function(done) {

            nrequests = 2;
            localDone = done;

            request('http://localhost:3000')
                .get('/api/groups')
                .send({
                    id : JSON.parse(nconf.get('user1Group'))._id,
                    token: nconf.get('user3Token')
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    assert.equal(res.body[0].members, undefined);
                    assert.equal(res.body[0].name, 'Test group user 1');
                    requestDone();
                });


            request('http://localhost:3000')
                .get('/api/groups')
                .send({
                    id : JSON.parse(nconf.get('user3Group'))._id,
                    token: nconf.get('user1Token')
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    assert.equal(res.body[0].members, undefined);
                    assert.equal(res.body[0].name, 'Test group user 3');
                    requestDone();
                });

        });

        it('should not allow duplicated group names', function(done) {

            request('http://localhost:3000')
                .post('/api/groups')
                .send({
                    name: 'Test group user 1',
                    country: 'AU',
                    token: nconf.get('user2Token')
                })
                .expect(400, 'Group already exists', done);

        });

        it('should block unauthorized users to create new groups', function(done) {

            request('http://localhost:3000')
                .post('/api/groups')
                .send({
                    name: 'Fake token group',
                    country: 'GB',
                    token: 'faketoken'
                })
                .expect(401, 'Wrong credentials', done);
        });

        it('should block users that are already members of a group to create another group', function(done) {

            request('http://localhost:3000')
                .post('/api/groups')
                .send({
                    name: 'Another user 1 group',
                    country: 'AU',
                    token: nconf.get('user1Token')
                })
                .expect(400, 'Restricted to one group per user', done);

        });

        it('should block users that are already members of a group to join another group', function(done) {

            request('http://localhost:3000')
                .post('/api/group-members')
                .send({
                    groupid : JSON.parse(nconf.get('user1Group'))._id,
                    token: nconf.get('user3Token'),
                    message: 'User 3 is already member of another group'
                })
                .expect(400, 'Restricted to one group per user', done);

        });

        it('should allow users to cancel their membership and enrol in another group', function(done) {

            nrequests = 2;
            localDone = done;

            request('http://localhost:3000')
                .delete('/api/group-members/' + JSON.parse(nconf.get('user1Group'))._id)
                .send({
                    token: nconf.get('user2Token')
                })
                .expect(200, requestDone);

            request('http://localhost:3000')
                .post('/api/group-members')
                .send({
                    groupid : JSON.parse(nconf.get('user1Group'))._id,
                    token: nconf.get('user2Token')
                })
                .expect(201, requestDone);
        });
    });

});
