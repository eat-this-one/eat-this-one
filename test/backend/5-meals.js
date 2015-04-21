'use strict';

var request = require('supertest');
var assert = require('assert');
var nconf = require('nconf');

// To pass vars between chained tests.
nconf.use('memory');

describe('EatMeal', function() {

    describe('Book a dish', function() {

        it('should allow members to book dishes', function(done) {

            request('http://localhost:3000')
                .post('/api/meals')
                .send({
                    dishid: JSON.parse(nconf.get('user1Dish'))._id,
                    message: 'I will not be send from localhost',
                    token: nconf.get('user2Token')
                })
                .expect(201, done);

        });

        it('should not allow the chef to book its dish', function(done) {

            request('http://localhost:3000')
                .post('/api/meals')
                .send({
                    dishid: JSON.parse(nconf.get('user1Dish'))._id,
                    message: 'I will not be send from localhost',
                    token: nconf.get('user1Token')
                })
                .expect(400, 'You can not book your own dishes', done);

        });

        it('should not allow non group members to book a dish', function(done) {

            request('http://localhost:3000')
                .post('/api/meals')
                .send({
                    dishid: JSON.parse(nconf.get('user1Dish'))._id,
                    message: 'I will not be send from localhost',
                    token: nconf.get('user3Token')
                })
                .expect(401, 'You are not a member of this group', done);


        });

        it('should not allow a user that already booked a dish to book it again', function(done) {

            request('http://localhost:3000')
                .post('/api/meals')
                .send({
                    dishid: JSON.parse(nconf.get('user1Dish'))._id,
                    message: 'I will not be send from localhost',
                    token: nconf.get('user2Token')
                })
                .expect(400, 'Already booked', done);


        });

    });

});
