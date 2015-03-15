'use strict';

describe('Main page', function() {

    var $controller, authManager, sessionManager, dishesRequest, appStatus;

    var user1 = {
        id : 'unexisting',
        name : 'Test User 1',
        email : 'test@user1.com',
        token : 'tokenuser1'
    };

    var loc = {
        id : 'asd',
        userid : 'notimportant',
        name : 'Empty Location',
        created : new Date()
    };

    var dishesList = [
        {
            _id : '111', userid : 'notimportant', locationid : 'asd', name : 'Dish 1',
            description : 'desc dish 1', when : new Date(), nportions : 2, donation : 3
        },{
            _id : '222', userid : 'notimportant', locationid : 'asd', name : 'Dish 2',
            description : 'desc dish 2', when : new Date(), nportions : 0, donation : 0
        }
    ];

    var mockDishesRequest = function($scope, dishesCallback, errorCallback) {
        return dishesCallback(dishesList);
    };

    var mockNoDishesRequest = function($scope, dishesCallback, errorCallback) {
        return dishesCallback([]);
    };

    beforeEach(module('eat-this-one'));

    beforeEach(inject(function(_$controller_, _authManager_, _sessionManager_, _dishesRequest_, _appStatus_){
        $controller = _$controller_;
        authManager = _authManager_;
        sessionManager = _sessionManager_;
        dishesRequest = _dishesRequest_;
        appStatus = _appStatus_;
    }));

    describe('$scope.showNoDishes', function() {

        var $scope, controller;

        afterEach(function() {
            sessionManager.cleanSession();
            localStorage.clear();
        });

        it('should display dishes by default', function() {
            $scope = {};
            controller = $controller('IndexController', { $scope: $scope });

            var spy = jasmine.createSpy(dishesRequest);

            expect($scope.showNoDishes).toBe(false);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should not display dishes when the user has no dishes', function() {

            authManager.authenticate(user1.id);
            sessionManager.setUser(user1);
            localStorage.setItem('loc', JSON.stringify(loc));

            $scope = {};
            controller = $controller('IndexController', { $scope: $scope, dishesRequest: mockNoDishesRequest });

            expect($scope.showNoDishes).toBe(true);
            expect($scope.dishes.length).toBe(0);
            expect(appStatus.isAllCompleted()).toBe(true);
        });

        it('should display dishes when the user has dishes', function() {

            authManager.authenticate(user1.id);
            sessionManager.setUser(user1);
            localStorage.setItem('loc', JSON.stringify(loc));

            $scope = {};
            controller = $controller('IndexController', { $scope: $scope, dishesRequest: mockDishesRequest });

            expect($scope.showNoDishes).toBe(false);
            expect($scope.dishes.length).toBe(2);
            expect(appStatus.isAllCompleted()).toBe(true);
        });

    });
});
