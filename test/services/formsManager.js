'use strict';

describe('Forms manager', function() {

    var formsManager;

    var $scope = {

        emptyName : {
            label : 'Name',
            validation : ['required'],
            value : ''
        },
        goodName : {
            label : 'Name',
            validation : ['required', 'text'],
            value : 'IV\' asda " asd .;,AL_-=s UE'
        },
        wrongName : {
            label : 'Name',
            validation : ['required', 'text'],
            value : 'I CONTAIN < P./OO'
        },
        goodEmail : {
            label : 'Email',
            validation : ['required', 'email'],
            value : 'name@email.com'
        },
        wrongEmail1 : {
            label : 'Email',
            validation : ['required', 'email'],
            value : 'name@domain'
        },
        wrongEmail2 : {
            label : 'Email',
            validation : ['required', 'email'],
            value : '@domain.com'
        }
    };

    beforeEach(module('eat-this-one'));

    beforeEach(inject(function(_formsManager_) {
        formsManager = _formsManager_;
    }));

    describe('Validate fields', function() {

        it('should validate required fields', function() {
            expect(formsManager.validate(['emptyName'], $scope)).toBe(false);
        });

        it('should validate text fields', function() {
            expect(formsManager.validate(['goodName'], $scope)).toBe(true);
            expect(formsManager.validate(['wrongName'], $scope)).toBe(false);
        });

        it('should validate email fields', function() {
            expect(formsManager.validate(['goodEmail'], $scope)).toBe(true);
            expect(formsManager.validate(['wrongEmail1'], $scope)).toBe(false);
            expect(formsManager.validate(['wrongEmail2'], $scope)).toBe(false);
        });

    });
});


