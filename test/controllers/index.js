'use strict';

describe('Index Controller', function() {

    var scope;

    beforeEach(module('eat-this-one'));
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('IndexController', {$scope: scope});
    }));

    it('should contain a page title', function() {
        expect(scope.pageTitle).toBe('Eat-this-one');
    });

    it('should default to empty where and current timestamp when', function() {
        expect(scope.where.value).toBe('');

        // More or less the same.
        expect(scope.when.value.getTime()).toBeGreaterThan(new Date().getTime() - 2000);
        expect(scope.when.value.getTime()).toBeLessThan(new Date().getTime() + 2000);
    });

    it('should default to hidden timepickers and datepickers', function() {
        expect($('#id-time-when')).not.toBeVisible();
        expect($('#id-date-when')).not.toBeVisible();
    });

    //it('should show the calendar when clicking the date button', function() {
        //$('#id-date-btn-when').click();
        //expect($('#id-time-when')).toBeVisible();
    //});

    //it('should show the timepicker when clicking the time button', function() {
    //});
});
