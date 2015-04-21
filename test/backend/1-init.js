'use strict';

var request = require("supertest");

describe('Eat this one', function() {

    it('should allow even guest user logs to be inserted', function(done) {

        request('http://localhost:3000')
            .post('/api/logs')
            .send({what: 'something', where: 'there'})
            .expect(201, done);
    });
});
