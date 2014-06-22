angular.module('eat-it')
    .controller('dishesEditController', ['$scope', 'appStatus', 'urlParser', function($scope, appStatus, urlParser) {

    $scope.pageTitle = 'Edit dish';
    $scope.lang = $.eatLang[$.eatConfig.lang];

    var id = urlParser.getParam('id');

    // Load the dish info.
    appStatus.waiting();
    $.dishRequest($scope, id);

    $scope.save = function() {
        // TODO Probably some dish cleaning will be required.
        appStatus.waiting();
        $.editDishRequest($scope, dish);
    };
}]);
