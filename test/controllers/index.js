'use strict';

describe('Index Controller', function() {

    var scope;

    beforeEach(module('eat-this-one'));
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('indexController', {$scope: scope});
    }));

    it('should contain a page title', function() {
        expect(scope.pageTitle).toBe('Eat-this-one');
    });

    it('should default to empty fields', function() {
        expect(scope.where.value.toBe('');
        expect(scope.when.value.toBe('');
    });

    it('should default to hidden timepickers and datepickers', function() {
    });

    it('should show the calendar when clicking the calendar button', function() {
    });

    it('should show the calendar when clicking the calendar button', function() {
    });
});
