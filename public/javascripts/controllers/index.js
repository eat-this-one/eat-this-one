angular.module('eat-it')
    .controller('indexController', ['$scope', '$window', function($scope, $window) {

    $scope.pageTitle = 'Eat-it';
    $scope.lang = $.eatLang[$.eatConfig.lang];

    var params = '';
    var wherevalue = $('#id-where').val();
    var whenvalue = $('#id-when').val();

    if (wherevalue != "") {
        params = '?where=' + wherevalue;
    }
    if (whenvalue != "") {
        if (params != '') {
            params += '&when=' + whenvalue;
        } else {
            params = '?when=' + whenvalue;
        }
    }

    $scope.searchDish = function() {
        $window.location.href = '/dishes/index.html' + params;
    };

    $scope.addDish = function() {
        $window.location.href = '/dishes/edit.html' + params;
    };
}]);
