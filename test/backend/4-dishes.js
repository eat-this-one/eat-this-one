'use strict';

var request = require('supertest');
var assert = require('assert');
var nconf = require('nconf');

// To pass vars between chained tests.
nconf.use('memory');

describe('EatDish', function() {

    var now = new Date();

    var today = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

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

    describe('Create a dish', function() {

        it('should add valid new dishes', function(done) {

            nrequests = 4;
            localDone = done;

            request('http://localhost:3000')
                .post('/api/dishes')
                .send({
                    name: 'Dish 1 user 1',
                    description: 'Dish description',
                    groupid: JSON.parse(nconf.get('user1Group'))._id,
                    nportions: 2,
                    donation: 'open',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(201)
                .end(function(err, res) {
                    if (err) {
                        return requestDone(err);
                    }
                    nconf.set('user1Dish', res.text);
                    requestDone();
                });

            request('http://localhost:3000')
                .post('/api/dishes')
                .send({
                    name: 'Dish 2 user 1',
                    groupid: JSON.parse(nconf.get('user1Group'))._id,
                    nportions: 2,
                    donation: 'open',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(201, requestDone);

            request('http://localhost:3000')
                .post('/api/dishes')
                .send({
                    name: 'Dish 3 user 1',
                    description: 'Dish description',
                    groupid: JSON.parse(nconf.get('user1Group'))._id,
                    nportions: 0,
                    donation: 'open',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(201, requestDone);

            request('http://localhost:3000')
                .post('/api/dishes')
                .send({
                    name: 'Dish 4 user 1',
                    description: 'Dish description',
                    groupid: JSON.parse(nconf.get('user1Group'))._id,
                    nportions: 2,
                    donation: '3',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(201, requestDone);

        });

        it('should not allow to add dishes with invalid data', function(done) {

            nrequests = 6;
            localDone = done;

            request('http://localhost:3000')
                .post('/api/dishes')
                .send({
                    name: 'No valid nportions',
                    groupid: JSON.parse(nconf.get('user1Group'))._id,
                    nportions: 'asd',
                    donation: '3',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(400, 'Bad request', requestDone);

            request('http://localhost:3000')
                .post('/api/dishes')
                .send({
                    name: 'No group id',
                    nportions: 2,
                    donation: '3',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(400, 'Bad request', requestDone);

            request('http://localhost:3000')
                .post('/api/dishes')
                .send({
                    description: 'No name',
                    nportions: 2,
                    donation: '3',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(400, 'Bad request', requestDone);

            request('http://localhost:3000')
                .post('/api/dishes')
                .send({
                    name: 'No donation',
                    nportions: 2,
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(400, 'Bad request', requestDone);

            request('http://localhost:3000')
                .post('/api/dishes')
                .send({
                    name: 'Dish 3 user 1',
                    description: 'Dish description',
                    groupid: JSON.parse(nconf.get('user3Group'))._id,
                    nportions: 0,
                    donation: 'open',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(401, 'You are not a member of this group', requestDone);

            request('http://localhost:3000')
                .post('/api/dishes')
                .send({
                    name: 'Dish 3 user 1',
                    description: 'Dish description',
                    groupid: JSON.parse(nconf.get('user3Group'))._id,
                    nportions: 0,
                    donation: 'open',
                    when: today,
                    token: 'asdas123as'
                })
                .expect(401, 'Wrong credentials', requestDone);

        });

    });

    describe('Edit a dish', function() {

        it('should edit dishes', function(done) {

            request('http://localhost:3000')
                .put('/api/dishes/' + JSON.parse(nconf.get('user1Dish'))._id)
                .send({
                    name: 'Dish 1 user 1 edited',
                    description: 'Dish description',
                    groupid: JSON.parse(nconf.get('user1Group'))._id,
                    nportions: 4,
                    donation: 'nothing',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.name, 'Dish 1 user 1 edited');
                    assert.equal(res.body.nportions, 4);
                    assert.equal(res.body.donation, 'nothing');
                    done();
                });

        });

        it('should not allow other users to edit another user\'s dish', function(done) {

            // Returns 400 because we look for the dish by id + user.
            request('http://localhost:3000')
                .put('/api/dishes/' + JSON.parse(nconf.get('user1Dish'))._id)
                .send({
                    name: 'Someone else is editing this??',
                    groupid: JSON.parse(nconf.get('user1Group'))._id,
                    nportions: 4,
                    donation: 'nothing',
                    when: today,
                    token: nconf.get('user2Token')
                })
                .expect(400, 'Unexisting dish', done)

        });

        it('should not allow to edit dishes with invalid data', function(done) {

            nrequests = 4;
            localDone = done;

            request('http://localhost:3000')
                .put('/api/dishes/' + JSON.parse(nconf.get('user1Dish'))._id)
                .send({
                    name: 'Wrong nportions value',
                    groupid: JSON.parse(nconf.get('user1Group'))._id,
                    nportions: '12sda3',
                    donation: 'nothing',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(400, 'Bad request', requestDone)

            request('http://localhost:3000')
                .put('/api/dishes/' + JSON.parse(nconf.get('user1Dish'))._id)
                .send({
                    name: 'No nportions value',
                    groupid: JSON.parse(nconf.get('user1Group'))._id,
                    donation: 'nothing',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(400, 'Bad request', requestDone)

            request('http://localhost:3000')
                .put('/api/dishes/' + JSON.parse(nconf.get('user1Dish'))._id)
                .send({
                    name: 'Wrong groupid value',
                    groupid: JSON.parse(nconf.get('user1Dish'))._id,
                    nportions: 4,
                    donation: 'nothing',
                    when: 'today',
                    token: nconf.get('user1Token')
                })
                .expect(400, 'Bad request', requestDone)

            request('http://localhost:3000')
                .put('/api/dishes/' + JSON.parse(nconf.get('user1Dish'))._id)
                .send({
                    description: 'No name',
                    groupid: JSON.parse(nconf.get('user1Group'))._id,
                    nportions: '12sda3',
                    donation: 'nothing',
                    when: today,
                    token: nconf.get('user1Token')
                })
                .expect(400, 'Bad request', requestDone)

        });

    });

    describe('Dishes list', function() {

        it('should allow group members to list group dishes', function(done) {

            request('http://localhost:3000')
                .get('/api/dishes')
                .send({
                    token: nconf.get('user2Token')
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body.length, 4);
                    done();
                });

        });

    });

    describe('View a dish', function() {

        it('should allow other group members to see group dishes', function(done) {

            request('http://localhost:3000')
                .get('/api/dishes/' + JSON.parse(nconf.get('user1Dish'))._id)
                .send({
                    token: nconf.get('user2Token')
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.equal(res.body._id, JSON.parse(nconf.get('user1Dish'))._id);
                    assert.equal(res.body.nportions, 4);
                    assert.equal(res.body.donation, 'nothing');
                    done();
                });

        });

        it('should not allow non-group members to see group dishes', function(done) {

            request('http://localhost:3000')
                .get('/api/dishes/' + JSON.parse(nconf.get('user1Dish'))._id)
                .send({
                    token: nconf.get('user3Token')
                })
                .expect(401, 'No access', done);

        });

    });

});
