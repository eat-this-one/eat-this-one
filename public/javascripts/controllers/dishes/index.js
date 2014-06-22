angular.module('eat-it')
    .controller('dishesController', ['$scope', function($scope) {

    $scope.pageTitle = 'Dishes';
    $scope.lang = $.eatLang[$.eatConfig.lang];

    var params = {
        'where' : $.urlParser.getParam('where'),
        'when' : $.urlParser.getParam('when')
    };

    $.appStatus.waiting();
    $.dishesRequest($scope, params);
}]);
