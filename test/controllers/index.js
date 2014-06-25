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
});
