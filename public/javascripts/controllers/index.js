angular.module('eat-this-one').controller('indexController', ['$scope', '$window', function($scope, $window) {

    $scope.pageTitle = 'Eat-this-one';
    $scope.lang = $.eatLang[$.eatConfig.lang];

    // Defines elements.
    $scope.where = {
        name: 'where',
        label: $scope.lang.where,
        placeholder: $scope.lang.where,
        value: ''
    };
    $scope.when = {
        name: 'when',
        label: $scope.lang.when,
        placeholder: $scope.lang.selectdatetime,
        value: ''
    };

    // date/time pickers hidden by default.
    $scope.showDatepicker = false;
    $scope.showTimepicker = false;

    // Toggles the datepicker.
    $scope.toggleDatepicker = function($event) {
        $scope.showTimepicker = false;
        $scope.showDatepicker = $scope.showDatepicker == false ? true : false;
    };

    // Toggles the timepicker
    $scope.toggleTimepicker = function($event) {
        $scope.showDatepicker = false;
        $scope.showTimepicker = $scope.showTimepicker == false ? true : false;
    };

    // Redirects to search dish page.
    $scope.searchDish = function() {
        $window.location.href = '/dishes/index.html' + $scope.getParams();
    };

    // Redirects to add dish page.
    $scope.addDish = function() {
        $window.location.href = '/dishes/edit.html' + $scope.getParams();
    };

    // Gets the URL params.
    $scope.getParams = function() {

        var params = '';
        if ($scope.where.value != "") {
            params = '?where=' + $scope.where.value;
        }
        if ($scope.when.value != "") {
            if (params != '') {
                params += '&when=' + $scope.when.value.getTime();
            } else {
                params = '?when=' + $scope.when.value.getTime();
            }
        }

        return params;
    };

}]);
