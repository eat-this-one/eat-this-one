'use strict';

describe('View dish page', function() {

    var $controller, authManager, sessionManager, dishRequest, appStatus;

    var user1 = {
        _id : 'user1',
        name : 'Test User 1',
        email : 'test@user1.com',
        token : 'tokenuser1'
    };

    var user2 = {
        _id : 'user2',
        name : 'Test User 2',
        email : 'test@user2.com',
        token : 'tokenuser2'
    };

    var userLoc = {
        _id : 'asd',
        userid : 'notimportant',
        name : 'Empty Location',
        created : new Date()
    };

    var userDish = {
        _id : '111', userid : 'user1', locationid : 'asd', name : 'Dish 1',
        description : 'desc dish 1', when : new Date(), nportions : 3, donation : 0,
        booked : false, nbookedmeals : 2, loc : userLoc, user : user1
    };

    var mockUserDishRequest = function($scope, dishCallback, id) {
        return dishCallback(userDish);
    };

    var anotherUserDish = {
        _id : '222', userid : 'user2', locationid : 'asd', name : 'Dish 2',
        description : 'desc dish 2', when : new Date(), nportions : 3, donation : 0,
        booked : false, nbookedmeals : 2, loc : userLoc, user : user2
    };

    var mockAnotherUserDishRequest = function($scope, dishCallback, id) {
        return dishCallback(anotherUserDish);
    };

    var alreadyBookedDish = {
        _id : '333', userid : 'user2', locationid : 'asd', name : 'Dish 3',
        description : 'desc dish 3', when : new Date(), nportions : 3, donation : 0,
        booked : true, nbookedmeals : 1, loc : userLoc, user : user2
    };

    var mockAlreadyBookedDishRequest = function($scope, dishCallback, id) {
        return dishCallback(alreadyBookedDish);
    };

    var noRemainingPortionsDish = {
        _id : '444', userid : 'user2', locationid : 'asd', name : 'Dish 4',
        description : 'desc dish 4', when : new Date(), nportions : 3, donation : 0,
        booked : false, nbookedmeals : 3, loc : userLoc, user : user2
    };

    var mockNoRemainingPortionsDishRequest = function($scope, dishCallback, id) {
        return dishCallback(noRemainingPortionsDish);
    };

    var unlimitedPortionsDish = {
        _id : '555', userid : 'user2', locationid : 'asd', name : 'Dish 5',
        description : 'desc dish 5', when : new Date(), nportions : 0, donation : 0,
        booked : false, nbookedmeals : 3, loc : userLoc, user : user2
    };

    var mockUnlimitedPortionsDishRequest = function($scope, dishCallback, id) {
        return dishCallback(unlimitedPortionsDish);
    };


    beforeEach(module('eat-this-one'));

    beforeEach(inject(function(_$controller_, _authManager_, _sessionManager_, _dishRequest_, _appStatus_){
        $controller = _$controller_;
        authManager = _authManager_;
        sessionManager = _sessionManager_;
        dishRequest = _dishRequest_;
        appStatus = _appStatus_;
    }));

    afterEach(function() {
        localStorage.clear();
    });

    describe('$scope.userCanBook()', function() {

        var $scope, controller;

        beforeEach(function() {
            authManager.authenticate(user1._id);
            sessionManager.setUser(user1);
            localStorage.setItem('loc', JSON.stringify(userLoc));
            $scope = {};
        });

        afterEach(function() {
            sessionManager.cleanSession();
        });

        it('should not allow the user to book their own dishes', function() {
            controller = $controller('DishesViewController', { $scope: $scope, dishRequest: mockUserDishRequest });

            expect(appStatus.isAllCompleted()).toBe(true);
            expect($scope.dish.remainingportions).toBe(1);
            expect($scope.userCanBook()).toBe(false);
            expect($scope.dishusefulinfotext).toBe($scope.lang.lastportion);
        });

        it('should allow the user to book other users dishes', function() {
            controller = $controller('DishesViewController', { $scope: $scope, dishRequest: mockAnotherUserDishRequest });

            expect(appStatus.isAllCompleted()).toBe(true);
            expect($scope.dish.remainingportions).toBe(1);
            expect($scope.userCanBook()).toBe(true);
            expect($scope.dishusefulinfotext).toBe($scope.lang.lastportion);
        });

        it('should not allow the user to book when the dish was already booked', function() {
            controller = $controller('DishesViewController', { $scope: $scope, dishRequest: mockAlreadyBookedDishRequest });

            expect(appStatus.isAllCompleted()).toBe(true);
            expect($scope.dish.remainingportions).toBe(2);
            expect($scope.userCanBook()).toBe(false);
            expect($scope.dishusefulinfotext).toBe($scope.lang.alreadybookedtext);
        });

        it('should not allow the user to book when no more portions are avaiable', function() {
            controller = $controller('DishesViewController', { $scope: $scope, dishRequest: mockNoRemainingPortionsDishRequest });

            expect(appStatus.isAllCompleted()).toBe(true);
            expect($scope.dish.remainingportions).toBe(0);
            expect($scope.userCanBook()).toBe(false);
            expect($scope.dishusefulinfotext).toBe($scope.lang.allportionsbooked);
        });

        it('should allow the user to book when infinite portions are avaiable', function() {
            controller = $controller('DishesViewController', { $scope: $scope, dishRequest: mockUnlimitedPortionsDishRequest });

            expect(appStatus.isAllCompleted()).toBe(true);
            expect($scope.dish.remainingportions).toBe(-1);
            expect($scope.userCanBook()).toBe(true);
            expect($scope.dishusefulinfotext).toBe('');
        });

    });
});
