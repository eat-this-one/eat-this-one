angular.module('eat-it')
    .controller('dishesController', ['$scope', function($scope) {

    $scope.pageTitle = 'Dishes';

    var params = {
        'where' : $.urlParser.getParam('where'),
        'when' : $.urlParser.getParam('when')
    };

    $.appStatus.waiting();
    $.dishesRequest($scope, params);
}]);
